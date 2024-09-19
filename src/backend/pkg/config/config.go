package config

import (
	"github.com/spf13/viper"
	"github.com/your-repo/blockchain-integration-service/pkg/errors"
)

// Config represents the application configuration
type Config struct {
	Server     ServerConfig
	Database   DatabaseConfig
	Redis      RedisConfig
	Blockchain BlockchainConfig
	Logger     LoggerConfig
}

// ServerConfig represents server-specific configuration
type ServerConfig struct {
	Host string
	Port int
	Mode string
}

// DatabaseConfig represents database-specific configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

// RedisConfig represents Redis-specific configuration
type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

// BlockchainConfig represents blockchain-specific configuration
type BlockchainConfig struct {
	EthereumRPC string
	XRPRPC      string
}

// LoggerConfig represents logger-specific configuration
type LoggerConfig struct {
	Level      string
	FilePath   string
	MaxSize    int
	MaxBackups int
	MaxAge     int
}

// LoadConfig loads the configuration from file and environment variables
func LoadConfig(configPath string) (*Config, error) {
	// Set the config file path in Viper
	viper.SetConfigFile(configPath)

	// Set the config type to YAML
	viper.SetConfigType("yaml")

	// Enable Viper to read from environment variables
	viper.AutomaticEnv()

	// Read the config file
	if err := viper.ReadInConfig(); err != nil {
		return nil, errors.Wrap(err, "failed to read config file")
	}

	// Unmarshal the config into the Config struct
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal config")
	}

	// Return the loaded config
	return &config, nil
}

// Human tasks (to be implemented):
// TODO: Implement validation for each configuration field
// TODO: Add support for multiple environments (development, staging, production)
// TODO: Implement secure handling of sensitive configuration data (e.g., database passwords)
// TODO: Add support for dynamic configuration reloading
// TODO: Implement configuration versioning
// TODO: Add support for configuration inheritance or overrides
// TODO: Implement a method to generate a default configuration file
// TODO: Add support for command-line flags to override configuration
// TODO: Implement configuration documentation generation
// TODO: Add unit tests for configuration loading and validation