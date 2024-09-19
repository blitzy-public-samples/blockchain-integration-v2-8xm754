package aws

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/secretsmanager"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// SecretsManager represents an AWS Secrets Manager client
type SecretsManager struct {
	client *secretsmanager.SecretsManager
	log    *logger.Logger
}

// NewSecretsManager creates a new SecretsManager instance
func NewSecretsManager(cfg *config.Config, log *logger.Logger) (*SecretsManager, error) {
	// Create a new AWS session using the provided configuration
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(cfg.AWSRegion),
	})
	if err != nil {
		return nil, err
	}

	// Create a new Secrets Manager client using the session
	client := secretsmanager.New(sess)

	// Create and return a new SecretsManager instance with the client and logger
	return &SecretsManager{
		client: client,
		log:    log,
	}, nil
}

// GetSecret retrieves a secret from AWS Secrets Manager
func (sm *SecretsManager) GetSecret(secretName string) (string, error) {
	// Create a new GetSecretValueInput with the provided secret name
	input := &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(secretName),
	}

	// Call the GetSecretValue method of the Secrets Manager client
	result, err := sm.client.GetSecretValue(input)
	if err != nil {
		// If an error occurs, log it and return the error
		sm.log.Error("Failed to get secret value", "error", err)
		return "", err
	}

	// Extract the secret string from the response
	secretString := *result.SecretString

	// Return the secret string
	return secretString, nil
}

// GetJSONSecret retrieves and parses a JSON secret from AWS Secrets Manager
func (sm *SecretsManager) GetJSONSecret(secretName string, result interface{}) error {
	// Call the GetSecret method to retrieve the secret string
	secretString, err := sm.GetSecret(secretName)
	if err != nil {
		return err
	}

	// Unmarshal the secret string into the provided result interface
	err = json.Unmarshal([]byte(secretString), result)
	if err != nil {
		// If an error occurs during unmarshaling, log it and return the error
		sm.log.Error("Failed to unmarshal JSON secret", "error", err)
		return err
	}

	// Return nil if successful
	return nil
}

// Human tasks:
// TODO: Implement unit tests for the SecretsManager struct and its methods
// TODO: Add support for caching secrets to reduce API calls to AWS
// TODO: Implement a method to update secrets in AWS Secrets Manager
// TODO: Add support for rotating secrets automatically
// TODO: Implement error handling and retries for AWS API calls
// TODO: Add support for versioned secrets
// TODO: Implement a method to list all secrets in a specific AWS region
// TODO: Add support for encrypting/decrypting secrets using AWS KMS
// TODO: Implement a method to delete secrets from AWS Secrets Manager
// TODO: Add support for tagging secrets for better organization