package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
)

// GenerateRandomBytes generates a slice of random bytes
func GenerateRandomBytes(n int) ([]byte, error) {
	// Create a byte slice of length n
	b := make([]byte, n)
	
	// Read random data into the slice using crypto/rand
	_, err := io.ReadFull(rand.Reader, b)
	if err != nil {
		// If an error occurs, return the error
		return nil, err
	}
	
	// If successful, return the random bytes
	return b, nil
}

// GenerateAESKey generates a 256-bit AES key
func GenerateAESKey() ([]byte, error) {
	// Call GenerateRandomBytes to generate 32 random bytes (256 bits)
	return GenerateRandomBytes(32)
}

// EncryptAES encrypts data using AES-GCM
func EncryptAES(plaintext []byte, key []byte) ([]byte, error) {
	// Create a new AES cipher block using the provided key
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Create a new GCM (Galois/Counter Mode) instance
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Generate a random nonce using GenerateRandomBytes
	nonce, err := GenerateRandomBytes(gcm.NonceSize())
	if err != nil {
		return nil, err
	}

	// Encrypt the plaintext using GCM
	ciphertext := gcm.Seal(nil, nonce, plaintext, nil)

	// Prepend the nonce to the ciphertext
	return append(nonce, ciphertext...), nil
}

// DecryptAES decrypts AES-GCM encrypted data
func DecryptAES(ciphertext []byte, key []byte) ([]byte, error) {
	// Create a new AES cipher block using the provided key
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Create a new GCM (Galois/Counter Mode) instance
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Extract the nonce from the first 12 bytes of the ciphertext
	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, errors.New("ciphertext too short")
	}
	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]

	// Decrypt the ciphertext using GCM and the extracted nonce
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	// Return the decrypted plaintext
	return plaintext, nil
}

// HashSHA256 computes the SHA256 hash of data
func HashSHA256(data []byte) string {
	// Compute the SHA256 hash of the input data
	hash := sha256.Sum256(data)
	
	// Encode the resulting hash as a hexadecimal string
	return hex.EncodeToString(hash[:])
}

// Human tasks:
// - Implement unit tests for each cryptographic function
// - Add input validation to ensure key lengths and data formats are correct
// - Implement additional encryption algorithms (e.g., RSA for asymmetric encryption)
// - Add support for digital signatures and verification
// - Implement secure key derivation functions (e.g., PBKDF2, scrypt)
// - Add support for secure random number generation for non-cryptographic purposes
// - Implement constant-time comparison functions to prevent timing attacks
// - Add support for encrypting and decrypting files
// - Implement functions for secure password hashing and verification
// - Add support for key rotation and versioning in encryption functions