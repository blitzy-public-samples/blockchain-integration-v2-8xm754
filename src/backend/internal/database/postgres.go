package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// PostgresDB represents the PostgreSQL database connection
type PostgresDB struct {
	Pool *pgxpool.Pool
	log  *logger.Logger
}

// NewPostgresDB creates a new PostgreSQL database connection pool
func NewPostgresDB(cfg *config.Config, log *logger.Logger) (*pgxpool.Pool, error) {
	// Construct the database connection string using configuration
	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Password, cfg.DB.Name)

	// Create a new pgxpool configuration
	poolConfig, err := pgxpool.ParseConfig(connString)
	if err != nil {
		log.Error("Failed to parse database configuration", "error", err)
		return nil, err
	}

	// Set max connection lifetime, max connections, and min connections
	poolConfig.MaxConnLifetime = time.Hour
	poolConfig.MaxConns = int32(cfg.DB.MaxConnections)
	poolConfig.MinConns = int32(cfg.DB.MinConnections)

	// Connect to the database using the configuration
	pool, err := pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		log.Error("Failed to connect to database", "error", err)
		return nil, err
	}

	// Ping the database to ensure the connection is valid
	err = pool.Ping(context.Background())
	if err != nil {
		log.Error("Failed to ping database", "error", err)
		return nil, err
	}

	log.Info("Successfully connected to the database")
	return pool, nil
}

// Close closes the database connection pool
func (db *PostgresDB) Close() {
	// Check if the connection pool exists
	if db.Pool != nil {
		// If it exists, close the connection pool
		db.Pool.Close()
		db.log.Info("Database connection closed")
	}
}

// Human tasks:
// TODO: Implement connection retry logic with exponential backoff
// TODO: Add support for database migrations
// TODO: Implement a method to check the health of the database connection
// TODO: Add support for read replicas and write/read splitting
// TODO: Implement connection pooling metrics (e.g., active connections, idle connections)
// TODO: Add support for prepared statements to improve query performance
// TODO: Implement a method to gracefully handle connection timeouts
// TODO: Add support for database transactions
// TODO: Implement query logging for debugging purposes
// TODO: Add support for database schema versioning