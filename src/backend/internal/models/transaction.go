package models

import (
	"time"

	"github.com/google/uuid"
)

// Transaction represents a blockchain transaction in the system
type Transaction struct {
	ID            uuid.UUID `json:"id"`
	VaultID       uuid.UUID `json:"vault_id"`
	BlockchainType string    `json:"blockchain_type"`
	FromAddress   string    `json:"from_address"`
	ToAddress     string    `json:"to_address"`
	Amount        string    `json:"amount"`
	Fee           string    `json:"fee"`
	Status        string    `json:"status"`
	TxHash        string    `json:"tx_hash"`
	Confirmations int       `json:"confirmations"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Human tasks:
// TODO: Add validation methods for the Transaction struct fields
// TODO: Implement a method to update the transaction status
// TODO: Add a method to check if the transaction is confirmed
// TODO: Implement a method to calculate the total transaction cost (amount + fee)
// TODO: Add custom JSON marshaling/unmarshaling methods if needed
// TODO: Implement a method to retrieve the associated vault details
// TODO: Add a method to generate a transaction receipt or summary
// TODO: Implement audit logging for transaction-related operations
// TODO: Add support for attaching metadata or tags to transactions
// TODO: Implement a method to estimate transaction fees based on current network conditions