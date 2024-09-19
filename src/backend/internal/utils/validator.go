package utils

import (
	"regexp"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
)

var (
	ethereumAddressRegex = regexp.MustCompile("^0x[a-fA-F0-9]{40}$")
	xrpAddressRegex      = regexp.MustCompile("^r[1-9A-HJ-NP-Za-km-z]{25,34}$")
)

// ValidateEthereumAddress checks if the given address is a valid Ethereum address
func ValidateEthereumAddress(address string) (bool, error) {
	// Check if the address matches the Ethereum address regex
	if !ethereumAddressRegex.MatchString(address) {
		return false, errors.NewInvalidAddressError("Invalid Ethereum address format")
	}

	// Use go-ethereum's IsHexAddress function to further validate the address
	if !common.IsHexAddress(address) {
		return false, errors.NewInvalidAddressError("Invalid Ethereum hex address")
	}

	// If all checks pass, return true and nil error
	return true, nil
}

// ValidateXRPAddress checks if the given address is a valid XRP address
func ValidateXRPAddress(address string) (bool, error) {
	// Check if the address matches the XRP address regex
	if !xrpAddressRegex.MatchString(address) {
		return false, errors.NewInvalidAddressError("Invalid XRP address format")
	}

	// If it matches, return true and nil error
	return true, nil
}

// ValidateAmount checks if the given amount is a valid positive number
func ValidateAmount(amount string) (bool, error) {
	// Check if the amount is a valid positive number
	if _, err := regexp.MatchString("^[+]?([0-9]*[.])?[0-9]+$", amount); err != nil || amount == "0" {
		return false, errors.NewInvalidAmountError("Invalid amount: must be a positive number")
	}

	// If it's valid, return true and nil error
	return true, nil
}

// ValidateBlockchainType checks if the given blockchain type is supported
func ValidateBlockchainType(blockchainType string) (bool, error) {
	// Convert the blockchain type to lowercase
	blockchainType = strings.ToLower(blockchainType)

	// Check if the blockchain type is either 'ethereum' or 'xrp'
	if blockchainType != "ethereum" && blockchainType != "xrp" {
		return false, errors.NewInvalidBlockchainTypeError("Invalid blockchain type: must be 'ethereum' or 'xrp'")
	}

	// If it's valid, return true and nil error
	return true, nil
}

// Human tasks:
// - Implement unit tests for each validation function
// - Add more comprehensive validation for Ethereum and XRP addresses (e.g., checksum validation)
// - Implement validation for other blockchain types that may be supported in the future
// - Add validation for transaction-specific fields (e.g., gas price for Ethereum)
// - Implement a generic validation function that can be used across different parts of the application
// - Add support for custom validation rules that can be configured externally
// - Implement validation for API request payloads
// - Add localization support for error messages
// - Implement a mechanism to cache regex compilations for better performance
// - Add support for validating blockchain-specific data structures (e.g., Ethereum contract ABIs)