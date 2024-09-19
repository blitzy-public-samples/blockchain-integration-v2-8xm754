package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/models"
	"github.com/your-repo/blockchain-integration-service/internal/services/transaction"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
)

// TransactionHandler struct holds dependencies for transaction handlers
type TransactionHandler struct {
	transactionService *transactionService.Service
}

// NewTransactionHandler creates a new TransactionHandler instance
func NewTransactionHandler(ts *transactionService.Service) *TransactionHandler {
	return &TransactionHandler{
		transactionService: ts,
	}
}

// CreateTransaction handles the creation of a new transaction
func (h *TransactionHandler) CreateTransaction(c *gin.Context) {
	// Parse and validate the transaction request from the request body
	var txRequest models.TransactionRequest
	if err := c.ShouldBindJSON(&txRequest); err != nil {
		logger.Error("Failed to parse transaction request", "error", err)
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Invalid request body", err))
		return
	}

	// Call the transaction service to create a new transaction
	tx, err := h.transactionService.CreateTransaction(c.Request.Context(), txRequest)
	if err != nil {
		logger.Error("Failed to create transaction", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to create transaction", err))
		return
	}

	// Return the created transaction details in the response
	c.JSON(http.StatusCreated, tx)
}

// GetTransaction handles retrieving a specific transaction
func (h *TransactionHandler) GetTransaction(c *gin.Context) {
	// Extract transaction ID from the request parameters
	txID := c.Param("id")

	// Call the transaction service to retrieve the transaction
	tx, err := h.transactionService.GetTransaction(c.Request.Context(), txID)
	if err != nil {
		logger.Error("Failed to get transaction", "error", err, "txID", txID)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to get transaction", err))
		return
	}

	// Return the transaction details in the response
	c.JSON(http.StatusOK, tx)
}

// ListTransactions handles listing transactions
func (h *TransactionHandler) ListTransactions(c *gin.Context) {
	// Extract pagination and filtering parameters from the request
	limit := c.DefaultQuery("limit", "10")
	offset := c.DefaultQuery("offset", "0")
	status := c.Query("status")

	// Call the transaction service to list transactions
	txs, err := h.transactionService.ListTransactions(c.Request.Context(), limit, offset, status)
	if err != nil {
		logger.Error("Failed to list transactions", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to list transactions", err))
		return
	}

	// Return the list of transactions in the response
	c.JSON(http.StatusOK, txs)
}

// UpdateTransactionStatus handles updating the status of a transaction
func (h *TransactionHandler) UpdateTransactionStatus(c *gin.Context) {
	// Extract transaction ID from the request parameters
	txID := c.Param("id")

	// Parse and validate the new status from the request body
	var statusUpdate models.StatusUpdate
	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		logger.Error("Failed to parse status update request", "error", err)
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Invalid request body", err))
		return
	}

	// Call the transaction service to update the transaction status
	tx, err := h.transactionService.UpdateTransactionStatus(c.Request.Context(), txID, statusUpdate.Status)
	if err != nil {
		logger.Error("Failed to update transaction status", "error", err, "txID", txID)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to update transaction status", err))
		return
	}

	// Return the updated transaction details in the response
	c.JSON(http.StatusOK, tx)
}

// Human tasks:
// TODO: Implement input validation for all handler functions
// TODO: Add proper error handling and logging for each handler
// TODO: Implement pagination for the ListTransactions handler
// TODO: Add authentication and authorization checks
// TODO: Implement rate limiting for API endpoints
// TODO: Add unit tests for each handler function
// TODO: Implement request body size limits to prevent abuse
// TODO: Add support for bulk transaction operations
// TODO: Implement webhook notifications for transaction status changes
// TODO: Add support for transaction fee estimation