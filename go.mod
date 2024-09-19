module github.com/your-repo/blockchain-integration-service

go 1.16

require (
	github.com/gin-gonic/gin v1.7.4
	github.com/go-redis/redis/v8 v8.11.3
	github.com/golang-migrate/migrate/v4 v4.15.1
	github.com/jackc/pgx/v4 v4.13.0
	github.com/segmentio/kafka-go v0.4.20
	github.com/spf13/viper v1.9.0
	github.com/stretchr/testify v1.7.0
	go.uber.org/zap v1.19.1
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519
)

// Human tasks:
// TODO: Review and update dependencies to their latest stable versions
// TODO: Ensure all required dependencies are listed
// TODO: Remove any unused dependencies
// TODO: Consider adding indirect dependencies explicitly if they're critical
// TODO: Verify compatibility between different dependency versions
// TODO: Add comments for dependencies that require specific versions
// TODO: Consider using go mod tidy to clean up the module file
// TODO: Evaluate the need for any vendor-specific replace directives
// TODO: Ensure the go version is appropriate for the project requirements
// TODO: Consider adding a go.sum file to the version control if not present