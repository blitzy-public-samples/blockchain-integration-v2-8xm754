package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/internal/models"
	"github.com/your-repo/blockchain-integration-service/internal/services/vault"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
)

// VaultHandler struct holds dependencies for vault handlers
type VaultHandler struct {
	vaultService *vaultService.Service
}

// NewVaultHandler creates a new VaultHandler instance
func NewVaultHandler(vs *vaultService.Service) *VaultHandler {
	return &VaultHandler{
		vaultService: vs,
	}
}

// CreateVault handles the creation of a new vault
func (vh *VaultHandler) CreateVault(c *gin.Context) {
	// Parse and validate the request body
	var newVault models.Vault
	if err := c.ShouldBindJSON(&newVault); err != nil {
		logger.Error("Failed to parse request body", "error", err)
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Invalid request body", err))
		return
	}

	// Call the vault service to create a new vault
	createdVault, err := vh.vaultService.CreateVault(c.Request.Context(), newVault)
	if err != nil {
		logger.Error("Failed to create vault", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to create vault", err))
		return
	}

	// Return the created vault details in the response
	c.JSON(http.StatusCreated, createdVault)
}

// GetVault handles retrieving a specific vault
func (vh *VaultHandler) GetVault(c *gin.Context) {
	// Extract vault ID from the request parameters
	vaultID := c.Param("id")

	// Call the vault service to retrieve the vault
	vault, err := vh.vaultService.GetVault(c.Request.Context(), vaultID)
	if err != nil {
		logger.Error("Failed to get vault", "error", err, "vaultID", vaultID)
		c.JSON(http.StatusNotFound, errors.NewAPIError("Vault not found", err))
		return
	}

	// Return the vault details in the response
	c.JSON(http.StatusOK, vault)
}

// ListVaults handles listing all vaults
func (vh *VaultHandler) ListVaults(c *gin.Context) {
	// Extract pagination parameters from the request
	page := c.DefaultQuery("page", "1")
	pageSize := c.DefaultQuery("pageSize", "10")

	// Call the vault service to list vaults
	vaults, err := vh.vaultService.ListVaults(c.Request.Context(), page, pageSize)
	if err != nil {
		logger.Error("Failed to list vaults", "error", err)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to list vaults", err))
		return
	}

	// Return the list of vaults in the response
	c.JSON(http.StatusOK, vaults)
}

// UpdateVault handles updating a vault
func (vh *VaultHandler) UpdateVault(c *gin.Context) {
	// Extract vault ID from the request parameters
	vaultID := c.Param("id")

	// Parse and validate the request body
	var updatedVault models.Vault
	if err := c.ShouldBindJSON(&updatedVault); err != nil {
		logger.Error("Failed to parse request body", "error", err)
		c.JSON(http.StatusBadRequest, errors.NewAPIError("Invalid request body", err))
		return
	}

	// Call the vault service to update the vault
	vault, err := vh.vaultService.UpdateVault(c.Request.Context(), vaultID, updatedVault)
	if err != nil {
		logger.Error("Failed to update vault", "error", err, "vaultID", vaultID)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to update vault", err))
		return
	}

	// Return the updated vault details in the response
	c.JSON(http.StatusOK, vault)
}

// DeleteVault handles deleting a vault
func (vh *VaultHandler) DeleteVault(c *gin.Context) {
	// Extract vault ID from the request parameters
	vaultID := c.Param("id")

	// Call the vault service to delete the vault
	err := vh.vaultService.DeleteVault(c.Request.Context(), vaultID)
	if err != nil {
		logger.Error("Failed to delete vault", "error", err, "vaultID", vaultID)
		c.JSON(http.StatusInternalServerError, errors.NewAPIError("Failed to delete vault", err))
		return
	}

	// Return a success message in the response
	c.JSON(http.StatusOK, gin.H{"message": "Vault deleted successfully"})
}

// Human tasks:
// - Implement input validation for all handler functions
// - Add proper error handling and logging for each handler
// - Implement pagination for the ListVaults handler
// - Add authentication and authorization checks
// - Implement rate limiting for API endpoints
// - Add unit tests for each handler function
// - Implement request body size limits to prevent abuse
// - Add support for bulk operations (e.g., create multiple vaults)
// - Implement proper HTTP status codes for different scenarios