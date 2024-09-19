package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/api/middleware"
	"github.com/your-repo/blockchain-integration-service/internal/api/router"
	"github.com/your-repo/blockchain-integration-service/internal/config"
	"github.com/your-repo/blockchain-integration-service/internal/database"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize logger
	l := logger.New(cfg.LogLevel)

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		l.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Set up Gin engine
	gin.SetMode(cfg.GinMode)
	engine := gin.New()

	// Apply middleware
	engine.Use(gin.Recovery())
	engine.Use(middleware.Logger(l))
	// Add more middleware as needed

	// Set up routes
	router.SetupRoutes(engine, db)

	// Initialize HTTP server
	srv := &http.Server{
		Addr:    cfg.ServerAddress,
		Handler: engine,
	}

	// Start server in a goroutine
	go func() {
		l.Infof("Starting server on %s", cfg.ServerAddress)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			l.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Set up graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	l.Info("Shutting down server...")

	// Perform cleanup and shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		l.Fatalf("Server forced to shutdown: %v", err)
	}

	l.Info("Server exiting")
}

// Human tasks:
// TODO: Implement comprehensive error handling and logging
// TODO: Add metrics collection for monitoring server performance
// TODO: Implement health check endpoint
// TODO: Add support for environment-based configuration
// TODO: Implement rate limiting to prevent API abuse
// TODO: Add support for API versioning
// TODO: Implement proper CORS configuration
// TODO: Add integration tests for the main server setup
// TODO: Implement secure handling of sensitive configuration data