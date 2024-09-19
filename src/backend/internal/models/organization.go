package models

import (
	"time"

	"github.com/google/uuid"
)

// Organization represents an organization entity in the blockchain integration service
type Organization struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	APIKey    string    `json:"api_key"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Human tasks:
// TODO: Add validation methods for the Organization struct fields
// TODO: Implement a method to generate a new API key for the organization
// TODO: Add a method to check if the organization is active or suspended
// TODO: Implement a method to hash and verify the API key for security
// TODO: Add custom JSON marshaling/unmarshaling methods if needed
// TODO: Implement a method to associate users with the organization
// TODO: Add a method to retrieve all vaults associated with the organization
// TODO: Implement audit logging for organization-related operations
// TODO: Add support for organization-specific settings or configurations
// TODO: Implement a method to calculate usage metrics for the organization