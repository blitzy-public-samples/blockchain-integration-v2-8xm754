package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/models"
	"github.com/your-repo/blockchain-integration-service/internal/services/signature"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
)

// SignatureHandler struct holds dependencies for signature handlers
type SignatureHandler struct {
	signatureService *signature.Service
}

// NewSignatureHandler creates a new SignatureHandler instance
func NewSignatureHandler(ss *signature.Service) *SignatureHandler {
	return &SignatureHandler{
		signatureService: ss,
	}
}

// RequestSignature handles HTTP requests for requesting a new signature
func (sh *SignatureHandler) RequestSignature(c *gin.Context) {
	// Parse and validate the signature request from the request body
	var req models.SignatureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Error("Failed to parse signature request", "error", err)
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Invalid request body", err))
		return
	}

	// Call the signature service to initiate a signature request
	result, err := sh.signatureService.RequestSignature(c.Request.Context(), req)
	if err != nil {
		logger.Error("Failed to request signature", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to request signature", err))
		return
	}

	// Return the signature request details in the response
	c.JSON(http.StatusCreated, result)
}

// GetSignatureStatus handles HTTP requests for retrieving the status of a signature request
func (sh *SignatureHandler) GetSignatureStatus(c *gin.Context) {
	// Extract signature request ID from the request parameters
	requestID := c.Param("id")
	if requestID == "" {
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Missing request ID", nil))
		return
	}

	// Call the signature service to get the status of the signature request
	status, err := sh.signatureService.GetSignatureStatus(c.Request.Context(), requestID)
	if err != nil {
		logger.Error("Failed to get signature status", "error", err, "requestID", requestID)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to get signature status", err))
		return
	}

	// Return the signature request status in the response
	c.JSON(http.StatusOK, status)
}

// ListSignatureRequests handles HTTP requests for listing signature requests
func (sh *SignatureHandler) ListSignatureRequests(c *gin.Context) {
	// Extract pagination and filtering parameters from the request
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	status := c.Query("status")

	// Call the signature service to list signature requests
	requests, err := sh.signatureService.ListSignatureRequests(c.Request.Context(), page, limit, status)
	if err != nil {
		logger.Error("Failed to list signature requests", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to list signature requests", err))
		return
	}

	// Return the list of signature requests in the response
	c.JSON(http.StatusOK, requests)
}

// Human tasks:
// - Implement input validation for all handler functions
// - Add proper error handling and logging for each handler
// - Implement pagination for the ListSignatureRequests handler
// - Add authentication and authorization checks
// - Implement rate limiting for API endpoints
// - Add unit tests for each handler function
// - Implement request body size limits to prevent abuse
// - Add support for cancelling or revoking signature requests
// - Implement webhook notifications for signature request status changes