package ethereum

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// EthereumClient represents the Ethereum client
type EthereumClient struct {
	client *ethclient.Client
	log    *logger.Logger
}

// NewEthereumClient creates a new Ethereum client
func NewEthereumClient(cfg *config.Config, log *logger.Logger) (*EthereumClient, error) {
	// Create a new Ethereum client using the provided RPC URL from the configuration
	client, err := ethclient.Dial(cfg.EthereumRPCURL)
	if err != nil {
		log.Error("Failed to create Ethereum client", "error", err)
		return nil, err
	}

	// If successful, create and return a new EthereumClient instance
	return &EthereumClient{
		client: client,
		log:    log,
	}, nil
}

// GetBalance gets the balance of an Ethereum address
func (c *EthereumClient) GetBalance(ctx context.Context, address string) (*big.Int, error) {
	// Convert the address string to an Ethereum address
	ethAddress := common.HexToAddress(address)

	// Call the client's BalanceAt method to get the balance
	balance, err := c.client.BalanceAt(ctx, ethAddress, nil)
	if err != nil {
		c.log.Error("Failed to get balance", "address", address, "error", err)
		return nil, err
	}

	// If successful, return the balance
	return balance, nil
}

// SendTransaction sends an Ethereum transaction
func (c *EthereumClient) SendTransaction(ctx context.Context, tx *types.Transaction) error {
	// Call the client's SendTransaction method to send the transaction
	err := c.client.SendTransaction(ctx, tx)
	if err != nil {
		c.log.Error("Failed to send transaction", "error", err)
		return err
	}

	// If successful, return nil
	return nil
}

// GetTransactionReceipt gets a transaction receipt
func (c *EthereumClient) GetTransactionReceipt(ctx context.Context, txHash string) (*types.Receipt, error) {
	// Convert the transaction hash string to an Ethereum hash
	hash := common.HexToHash(txHash)

	// Call the client's TransactionReceipt method to get the receipt
	receipt, err := c.client.TransactionReceipt(ctx, hash)
	if err != nil {
		c.log.Error("Failed to get transaction receipt", "txHash", txHash, "error", err)
		return nil, err
	}

	// If successful, return the receipt
	return receipt, nil
}

// Human tasks:
// TODO: Implement error handling and retries for network failures
// TODO: Add support for estimating gas prices
// TODO: Implement a method to deploy smart contracts
// TODO: Add support for interacting with ERC20 tokens
// TODO: Implement a method to listen for new blocks and transactions
// TODO: Add support for signing transactions offline
// TODO: Implement a method to get historical transaction data
// TODO: Add support for multiple Ethereum networks (mainnet, testnets)
// TODO: Implement a method to validate Ethereum addresses
// TODO: Add support for ENS (Ethereum Name Service) resolution