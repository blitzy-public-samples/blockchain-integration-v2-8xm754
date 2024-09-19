package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/services/auth"
	"github.com/your-repo/blockchain-integration-service/pkg/jwt"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
	"strings"
)

// AuthMiddleware is a middleware function to authenticate incoming requests
func AuthMiddleware(authSvc *auth.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the Authorization header from the request
		authHeader := c.GetHeader("Authorization")

		// Check if the Authorization header is present and in the correct format
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(401, errors.NewUnauthorizedError("Invalid or missing Authorization header"))
			return
		}

		// Extract the token from the Authorization header
		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate the token using the JWT package
		claims, err := jwt.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(401, errors.NewUnauthorizedError("Invalid token"))
			return
		}

		// Extract the user ID from the token claims
		userID, ok := claims["user_id"].(string)
		if !ok {
			c.AbortWithStatusJSON(401, errors.NewUnauthorizedError("Invalid token claims"))
			return
		}

		// Call the auth service to get the user details
		user, err := authSvc.GetUserByID(userID)
		if err != nil {
			c.AbortWithStatusJSON(401, errors.NewUnauthorizedError("User not found"))
			return
		}

		// Set the user details in the gin.Context for use in subsequent handlers
		c.Set("user", user)

		// Call the next handler in the chain
		c.Next()
	}
}

// RoleMiddleware is a middleware function to check if the authenticated user has the required role
func RoleMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the user details from the gin.Context
		user, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(401, errors.NewUnauthorizedError("User not authenticated"))
			return
		}

		// Check if the user's role matches the required role
		if user.(auth.User).Role != requiredRole {
			c.AbortWithStatusJSON(403, errors.NewForbiddenError("Insufficient permissions"))
			return
		}

		// If the role matches, call the next handler in the chain
		c.Next()
	}
}

// Human tasks:
// TODO: Implement proper error responses with clear messages for authentication failures
// TODO: Add support for multiple authentication methods (e.g., API keys, OAuth)
// TODO: Implement rate limiting for authentication attempts to prevent brute force attacks
// TODO: Add logging for authentication and authorization events
// TODO: Implement token refresh mechanism to extend session duration
// TODO: Add support for role-based access control (RBAC) with more granular permissions
// TODO: Implement IP whitelisting for additional security
// TODO: Add unit tests for the middleware functions
// TODO: Implement secure token storage and rotation
// TODO: Add support for multi-factor authentication