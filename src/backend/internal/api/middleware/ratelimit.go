package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
	"golang.org/x/time/rate"
	"time"
	"sync"
)

// Global map to store rate limiters for each IP address
var limiterMap sync.Map

// RateLimitMiddleware implements rate limiting for API requests
func RateLimitMiddleware(redisClient *redis.Client, requestsPerMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the client IP address from the request
		clientIP := c.ClientIP()

		// Check if a rate limiter exists for the IP address in the limiterMap
		limiter, exists := limiterMap.Load(clientIP)
		if !exists {
			// If not, create a new rate limiter for the IP
			limiter = rate.NewLimiter(rate.Every(time.Minute/time.Duration(requestsPerMinute)), requestsPerMinute)
			limiterMap.Store(clientIP, limiter)
		}

		// Check if the request is allowed by the rate limiter
		if !limiter.(*rate.Limiter).Allow() {
			// If not allowed, abort the request with a 'Too Many Requests' error
			c.AbortWithStatusJSON(429, errors.NewAPIError("Too Many Requests", "Rate limit exceeded"))
			return
		}

		// If allowed, call the next handler in the chain
		c.Next()
	}
}

// RedisRateLimitMiddleware implements rate limiting using Redis for distributed environments
func RedisRateLimitMiddleware(redisClient *redis.Client, requestsPerMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the client IP address from the request
		clientIP := c.ClientIP()

		// Create a Redis key for the IP address
		key := "rate_limit:" + clientIP

		// Use Redis to increment the request count for the IP
		count, err := redisClient.Incr(c, key).Result()
		if err != nil {
			c.AbortWithStatusJSON(500, errors.NewAPIError("Internal Server Error", "Failed to check rate limit"))
			return
		}

		// Check if the request count exceeds the limit
		if count > int64(requestsPerMinute) {
			// If exceeded, abort the request with a 'Too Many Requests' error
			c.AbortWithStatusJSON(429, errors.NewAPIError("Too Many Requests", "Rate limit exceeded"))
			return
		}

		// If not exceeded, set the key expiration and call the next handler
		if count == 1 {
			redisClient.Expire(c, key, time.Minute)
		}
		c.Next()
	}
}

// Human tasks:
// - Implement dynamic rate limiting based on user roles or API keys
// - Add support for different rate limits for different endpoints
// - Implement a sliding window rate limit algorithm for more accurate limiting
// - Add burst allowance for temporary spikes in traffic
// - Implement rate limit headers in responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
// - Add logging and monitoring for rate limit events
// - Implement graceful degradation of service when rate limits are reached
// - Add unit tests for rate limiting functions
// - Implement rate limit bypass for certain IP addresses or user agents (e.g., health checks)
// - Add support for rate limiting based on custom attributes (e.g., user ID, API key)