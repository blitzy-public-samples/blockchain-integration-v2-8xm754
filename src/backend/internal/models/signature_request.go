package models

import (
	"time"

	"github.com/google/uuid"
)

// SignatureRequest represents a request for a cryptographic signature in the blockchain integration service.
type SignatureRequest struct {
	ID            uuid.UUID `json:"id"`
	VaultID       uuid.UUID `json:"vault_id"`
	Status        string    `json:"status"`
	DataToSign    string    `json:"data_to_sign"`
	Signature     string    `json:"signature"`
	SignatureType string    `json:"signature_type"`
	ExpiresAt     time.Time `json:"expires_at"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Human tasks:
// TODO: Add validation methods for the SignatureRequest struct fields
// TODO: Implement a method to update the signature request status
// TODO: Add a method to check if the signature request has expired
// TODO: Implement a method to verify the generated signature
// TODO: Add custom JSON marshaling/unmarshaling methods if needed
// TODO: Implement a method to retrieve the associated vault details
// TODO: Add a method to extend the expiration time of the signature request
// TODO: Implement audit logging for signature request operations
// TODO: Add support for different signature algorithms (e.g., ECDSA, EdDSA)
// TODO: Implement a method to cancel an ongoing signature request