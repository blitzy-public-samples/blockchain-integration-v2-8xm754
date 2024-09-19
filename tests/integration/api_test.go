package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/your-repo/blockchain-integration-service/internal/api"
	"github.com/your-repo/blockchain-integration-service/internal/models"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/database"
)

var (
	testServer *httptest.Server
	testClient *http.Client
	testDB     *database.Database
)

func TestMain(m *testing.M) {
	// Load test configuration
	cfg, err := config.Load("../../config/test.yaml")
	if err != nil {
		panic(err)
	}

	// Set up test database connection
	testDB, err = database.Connect(cfg.Database)
	if err != nil {
		panic(err)
	}

	// Initialize API router
	router := api.NewRouter(testDB)

	// Create test HTTP server
	testServer = httptest.NewServer(router)
	testClient = testServer.Client()

	// Run tests
	code := m.Run()

	// Tear down test server and database connection
	testServer.Close()
	testDB.Close()

	// Exit with test result code
	os.Exit(code)
}

func TestCreateVault(t *testing.T) {
	// Create a sample vault request
	vaultReq := models.VaultRequest{
		Name:        "Test Vault",
		Description: "A test vault for integration testing",
		Network:     "ethereum",
	}

	// Marshal the request to JSON
	reqBody, err := json.Marshal(vaultReq)
	assert.NoError(t, err)

	// Create a new HTTP POST request to the create vault endpoint
	req, err := http.NewRequest("POST", testServer.URL+"/api/v1/vaults", bytes.NewBuffer(reqBody))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Send the request using the test client
	resp, err := testClient.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Assert that the response status code is 201 (Created)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	// Unmarshal the response body into a vault object
	var createdVault models.Vault
	err = json.NewDecoder(resp.Body).Decode(&createdVault)
	assert.NoError(t, err)

	// Assert that the returned vault matches the request data
	assert.Equal(t, vaultReq.Name, createdVault.Name)
	assert.Equal(t, vaultReq.Description, createdVault.Description)
	assert.Equal(t, vaultReq.Network, createdVault.Network)

	// Verify that the vault was actually created in the database
	dbVault, err := testDB.GetVault(createdVault.ID)
	assert.NoError(t, err)
	assert.Equal(t, createdVault, dbVault)
}

func TestGetVault(t *testing.T) {
	// Create a sample vault in the test database
	sampleVault := models.Vault{
		Name:        "Sample Vault",
		Description: "A sample vault for testing",
		Network:     "bitcoin",
	}
	err := testDB.CreateVault(&sampleVault)
	assert.NoError(t, err)

	// Create a new HTTP GET request to the get vault endpoint
	req, err := http.NewRequest("GET", testServer.URL+"/api/v1/vaults/"+sampleVault.ID, nil)
	assert.NoError(t, err)

	// Send the request using the test client
	resp, err := testClient.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Assert that the response status code is 200 (OK)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Unmarshal the response body into a vault object
	var retrievedVault models.Vault
	err = json.NewDecoder(resp.Body).Decode(&retrievedVault)
	assert.NoError(t, err)

	// Assert that the returned vault matches the sample vault data
	assert.Equal(t, sampleVault.ID, retrievedVault.ID)
	assert.Equal(t, sampleVault.Name, retrievedVault.Name)
	assert.Equal(t, sampleVault.Description, retrievedVault.Description)
	assert.Equal(t, sampleVault.Network, retrievedVault.Network)
}

func TestCreateTransaction(t *testing.T) {
	// Create a sample transaction request
	txReq := models.TransactionRequest{
		VaultID:     "sample-vault-id",
		FromAddress: "0x1234567890123456789012345678901234567890",
		ToAddress:   "0x0987654321098765432109876543210987654321",
		Amount:      "1.5",
		Asset:       "ETH",
	}

	// Marshal the request to JSON
	reqBody, err := json.Marshal(txReq)
	assert.NoError(t, err)

	// Create a new HTTP POST request to the create transaction endpoint
	req, err := http.NewRequest("POST", testServer.URL+"/api/v1/transactions", bytes.NewBuffer(reqBody))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Send the request using the test client
	resp, err := testClient.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Assert that the response status code is 201 (Created)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	// Unmarshal the response body into a transaction object
	var createdTx models.Transaction
	err = json.NewDecoder(resp.Body).Decode(&createdTx)
	assert.NoError(t, err)

	// Assert that the returned transaction matches the request data
	assert.Equal(t, txReq.VaultID, createdTx.VaultID)
	assert.Equal(t, txReq.FromAddress, createdTx.FromAddress)
	assert.Equal(t, txReq.ToAddress, createdTx.ToAddress)
	assert.Equal(t, txReq.Amount, createdTx.Amount)
	assert.Equal(t, txReq.Asset, createdTx.Asset)

	// Verify that the transaction was actually created in the database
	dbTx, err := testDB.GetTransaction(createdTx.ID)
	assert.NoError(t, err)
	assert.Equal(t, createdTx, dbTx)
}

// Human tasks:
// - Implement more comprehensive test cases covering all API endpoints
// - Add test cases for error scenarios (e.g., invalid input, unauthorized access)
// - Implement test cases for pagination and filtering in list endpoints
// - Add test cases for real-time updates using WebSocket connections
// - Implement test cases for concurrent API requests to ensure thread safety
// - Add test cases for rate limiting and API key authentication
// - Implement test cases for different blockchain networks (e.g., testnet vs mainnet)
// - Add performance tests to ensure API responsiveness under load
// - Implement test cases for data consistency across different API calls
// - Add test cases for API versioning if implemented