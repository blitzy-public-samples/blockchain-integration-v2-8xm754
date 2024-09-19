package router

import (
	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/api/handlers"
	"github.com/your-repo/blockchain-integration-service/internal/api/middleware"
	"github.com/your-repo/blockchain-integration-service/internal/services"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// SetupRouter configures and returns the main API router
func SetupRouter(services *services.Services, log *logger.Logger) *gin.Engine {
	// Create a new Gin router
	router := gin.New()

	// Apply global middleware
	router.Use(gin.Recovery())
	router.Use(middleware.Logger(log))
	router.Use(middleware.RateLimiter())

	// Set up health check route
	router.GET("/health", handlers.HealthCheck())

	// Create handler instances
	vaultHandler := handlers.NewVaultHandler(services.VaultService)
	transactionHandler := handlers.NewTransactionHandler(services.TransactionService)
	signatureHandler := handlers.NewSignatureHandler(services.SignatureService)
	analyticsHandler := handlers.NewAnalyticsHandler(services.AnalyticsService)

	// Set up API version group
	v1 := router.Group("/api/v1")
	{
		// Vault routes
		vault := v1.Group("/vault")
		{
			vault.POST("/create", middleware.Authenticate(), vaultHandler.CreateVault)
			vault.GET("/list", middleware.Authenticate(), vaultHandler.ListVaults)
			vault.GET("/:id", middleware.Authenticate(), vaultHandler.GetVault)
			vault.PUT("/:id", middleware.Authenticate(), vaultHandler.UpdateVault)
			vault.DELETE("/:id", middleware.Authenticate(), vaultHandler.DeleteVault)
		}

		// Transaction routes
		tx := v1.Group("/transactions")
		{
			tx.POST("/create", middleware.Authenticate(), transactionHandler.CreateTransaction)
			tx.GET("/list", middleware.Authenticate(), transactionHandler.ListTransactions)
			tx.GET("/:id", middleware.Authenticate(), transactionHandler.GetTransaction)
			tx.PUT("/:id/sign", middleware.Authenticate(), transactionHandler.SignTransaction)
			tx.POST("/:id/broadcast", middleware.Authenticate(), transactionHandler.BroadcastTransaction)
		}

		// Signature routes
		sig := v1.Group("/signatures")
		{
			sig.POST("/create", middleware.Authenticate(), signatureHandler.CreateSignature)
			sig.GET("/list", middleware.Authenticate(), signatureHandler.ListSignatures)
			sig.GET("/:id", middleware.Authenticate(), signatureHandler.GetSignature)
			sig.DELETE("/:id", middleware.Authenticate(), signatureHandler.DeleteSignature)
		}

		// Analytics routes
		analytics := v1.Group("/analytics")
		{
			analytics.GET("/transactions", middleware.Authenticate(), analyticsHandler.GetTransactionAnalytics)
			analytics.GET("/vaults", middleware.Authenticate(), analyticsHandler.GetVaultAnalytics)
			analytics.GET("/usage", middleware.Authenticate(), analyticsHandler.GetUsageAnalytics)
		}
	}

	return router
}

// Human tasks:
// - Implement versioning strategy for API endpoints
// - Add comprehensive documentation for each route (e.g., using Swagger)
// - Implement proper error handling and consistent error responses
// - Add support for CORS configuration
// - Implement request validation middleware for each route
// - Add support for API key authentication for external integrations
// - Implement rate limiting strategies for different API consumers
// - Add monitoring and metrics collection for API usage
// - Implement a mechanism for dynamically enabling/disabling routes
// - Add integration tests for the router setup and route handling