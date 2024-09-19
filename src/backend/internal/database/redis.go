package database

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// RedisClient struct representing the Redis client
type RedisClient struct {
	Client *redis.Client
	log    *logger.Logger
}

// NewRedisClient creates a new Redis client
func NewRedisClient(cfg *config.Config, log *logger.Logger) (*RedisClient, error) {
	// Create a new Redis client options struct
	options := &redis.Options{
		Addr:     cfg.Redis.Address,
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.Database,
	}

	// Create a new Redis client with the options
	client := redis.NewClient(options)

	// Ping the Redis server to ensure the connection is valid
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Ping(ctx).Result()
	if err != nil {
		// If an error occurs, log it and return the error
		log.Error("Failed to connect to Redis", "error", err)
		return nil, err
	}

	// If successful, return the Redis client instance
	log.Info("Successfully connected to Redis")
	return &RedisClient{
		Client: client,
		log:    log,
	}, nil
}

// Close method to close the Redis client connection
func (rc *RedisClient) Close() error {
	// Check if the Redis client exists
	if rc.Client != nil {
		// If it exists, close the Redis client connection
		err := rc.Client.Close()
		if err != nil {
			// Log the error if closure fails
			rc.log.Error("Failed to close Redis connection", "error", err)
			return err
		}
		// Log the closure of the Redis connection
		rc.log.Info("Redis connection closed successfully")
	}
	return nil
}

// Human tasks:
// TODO: Implement connection retry logic with exponential backoff
// TODO: Add support for Redis Sentinel for high availability
// TODO: Implement a method to check the health of the Redis connection
// TODO: Add support for Redis Cluster for scalability
// TODO: Implement connection pooling metrics (e.g., active connections, idle connections)
// TODO: Add support for Redis pub/sub functionality
// TODO: Implement a method to gracefully handle connection timeouts
// TODO: Add support for Redis transactions
// TODO: Implement key prefix management to avoid key collisions
// TODO: Add support for Redis lua scripting for complex operations