package utxo

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// UTXOClient represents a client for the UTXO custodian service
type UTXOClient struct {
	client  *http.Client
	baseURL string
	apiKey  string
	log     *logger.Logger
}

// UTXO represents an unspent transaction output
type UTXO struct {
	TxID   string `json:"txid"`
	Vout   int    `json:"vout"`
	Amount int64  `json:"amount"`
}

// TransactionRequest represents a request to create a new transaction
type TransactionRequest struct {
	Inputs  []UTXO `json:"inputs"`
	Outputs []struct {
		Address string `json:"address"`
		Amount  int64  `json:"amount"`
	} `json:"outputs"`
}

// Transaction represents a created transaction
type Transaction struct {
	TxID string `json:"txid"`
	Hex  string `json:"hex"`
}

// TransactionStatus represents the status of a transaction
type TransactionStatus struct {
	TxID   string `json:"txid"`
	Status string `json:"status"`
}

// NewUTXOClient creates a new UTXOClient instance
func NewUTXOClient(cfg *config.Config, log *logger.Logger) (*UTXOClient, error) {
	// Create a new HTTP client with appropriate timeout
	client := &http.Client{
		Timeout: time.Second * 30,
	}

	// Create and return a new UTXOClient instance with the HTTP client, base URL, API key, and logger
	return &UTXOClient{
		client:  client,
		baseURL: cfg.UTXOCustodianBaseURL,
		apiKey:  cfg.UTXOCustodianAPIKey,
		log:     log,
	}, nil
}

// GetUTXOs retrieves UTXOs for a given address
func (c *UTXOClient) GetUTXOs(ctx context.Context, address string) ([]UTXO, error) {
	// Construct the API endpoint URL
	url := fmt.Sprintf("%s/utxos?address=%s", c.baseURL, address)

	// Create a new HTTP request
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set the API key in the request header
	req.Header.Set("X-API-Key", c.apiKey)

	// Send the HTTP request
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check for HTTP errors
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Decode the JSON response into a slice of UTXOs
	var utxos []UTXO
	if err := json.NewDecoder(resp.Body).Decode(&utxos); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Return the UTXOs
	return utxos, nil
}

// CreateTransaction creates a new transaction using UTXOs
func (c *UTXOClient) CreateTransaction(ctx context.Context, req *TransactionRequest) (*Transaction, error) {
	// Construct the API endpoint URL
	url := fmt.Sprintf("%s/transactions", c.baseURL)

	// Marshal the transaction request into JSON
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create a new HTTP request with the JSON payload
	req, err := http.NewRequestWithContext(ctx, "POST", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set the API key in the request header
	req.Header.Set("X-API-Key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the HTTP request
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check for HTTP errors
	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Decode the JSON response into a Transaction struct
	var transaction Transaction
	if err := json.NewDecoder(resp.Body).Decode(&transaction); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Return the created transaction
	return &transaction, nil
}

// GetTransactionStatus checks the status of a transaction
func (c *UTXOClient) GetTransactionStatus(ctx context.Context, txID string) (*TransactionStatus, error) {
	// Construct the API endpoint URL
	url := fmt.Sprintf("%s/transactions/%s/status", c.baseURL, txID)

	// Create a new HTTP request
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set the API key in the request header
	req.Header.Set("X-API-Key", c.apiKey)

	// Send the HTTP request
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check for HTTP errors
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Decode the JSON response into a TransactionStatus struct
	var status TransactionStatus
	if err := json.NewDecoder(resp.Body).Decode(&status); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Return the transaction status
	return &status, nil
}

// Human tasks:
// - Implement unit tests for the UTXOClient struct and its methods
// - Add support for pagination in the GetUTXOs method
// - Implement error handling and retries for HTTP requests
// - Add support for cancellation and timeouts using context
// - Implement rate limiting to comply with UTXO custodian service limits
// - Add support for batch operations (e.g., creating multiple transactions)
// - Implement logging for all API calls and responses
// - Add support for different UTXO types (e.g., Bitcoin, Litecoin)
// - Implement a method to estimate transaction fees
// - Add support for webhook notifications for transaction status changes