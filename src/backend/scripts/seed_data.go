package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/your-repo/blockchain-integration-service/internal/models"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/database"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Connect to the database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	// Call seedData function
	err = seedData(db)
	if err != nil {
		log.Fatalf("Failed to seed data: %v", err)
	}

	// Log seeding status
	log.Println("Database seeding completed successfully")
}

func seedData(db *sql.DB) error {
	// Create a new context
	ctx := context.Background()

	// Begin a database transaction
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Seed organizations
	if err := seedOrganizations(ctx, tx); err != nil {
		return fmt.Errorf("failed to seed organizations: %w", err)
	}

	// Seed vaults
	if err := seedVaults(ctx, tx); err != nil {
		return fmt.Errorf("failed to seed vaults: %w", err)
	}

	// Seed transactions
	if err := seedTransactions(ctx, tx); err != nil {
		return fmt.Errorf("failed to seed transactions: %w", err)
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func seedOrganizations(ctx context.Context, tx *sql.Tx) error {
	// Create sample organization data
	organizations := []models.Organization{
		{
			ID:        uuid.New(),
			Name:      "Acme Corp",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "Globex Corporation",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	// Insert organization data into the database
	for _, org := range organizations {
		_, err := tx.ExecContext(ctx, "INSERT INTO organizations (id, name, created_at, updated_at) VALUES ($1, $2, $3, $4)",
			org.ID, org.Name, org.CreatedAt, org.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert organization: %w", err)
		}
	}

	return nil
}

func seedVaults(ctx context.Context, tx *sql.Tx) error {
	// Create sample vault data
	vaults := []models.Vault{
		{
			ID:             uuid.New(),
			OrganizationID: uuid.New(), // This should be a valid organization ID
			Name:           "Main Vault",
			Balance:        1000000,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ID:             uuid.New(),
			OrganizationID: uuid.New(), // This should be a valid organization ID
			Name:           "Reserve Vault",
			Balance:        5000000,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
	}

	// Insert vault data into the database
	for _, vault := range vaults {
		_, err := tx.ExecContext(ctx, "INSERT INTO vaults (id, organization_id, name, balance, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
			vault.ID, vault.OrganizationID, vault.Name, vault.Balance, vault.CreatedAt, vault.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert vault: %w", err)
		}
	}

	return nil
}

func seedTransactions(ctx context.Context, tx *sql.Tx) error {
	// Create sample transaction data
	transactions := []models.Transaction{
		{
			ID:          uuid.New(),
			VaultID:     uuid.New(), // This should be a valid vault ID
			Amount:      100000,
			Type:        "deposit",
			Status:      "completed",
			BlockchainTxID: "0x1234567890abcdef",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          uuid.New(),
			VaultID:     uuid.New(), // This should be a valid vault ID
			Amount:      50000,
			Type:        "withdrawal",
			Status:      "pending",
			BlockchainTxID: "",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	// Insert transaction data into the database
	for _, transaction := range transactions {
		_, err := tx.ExecContext(ctx, "INSERT INTO transactions (id, vault_id, amount, type, status, blockchain_tx_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			transaction.ID, transaction.VaultID, transaction.Amount, transaction.Type, transaction.Status, transaction.BlockchainTxID, transaction.CreatedAt, transaction.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert transaction: %w", err)
		}
	}

	return nil
}

// Human tasks:
// - Implement error handling for configuration loading failures
// - Add support for command-line arguments to specify which data to seed
// - Implement a mechanism to check if data already exists before seeding
// - Add support for seeding additional entities (e.g., users, settings)
// - Implement a way to generate more realistic and varied sample data
// - Add logging for each step of the seeding process
// - Implement a mechanism to handle database constraints and relationships
// - Add support for seeding data in batches for better performance
// - Implement a way to easily extend the seeding script with new data types
// - Add unit tests for the seeding functions