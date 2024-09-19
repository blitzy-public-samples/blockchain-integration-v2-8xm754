// Constants for the blockchain integration service frontend application

// Base URL for API requests
export const API_BASE_URL: string = 'https://api.blockchain-integration.com/v2';

// Base URL for WebSocket connections
export const WS_BASE_URL: string = 'wss://ws.blockchain-integration.com/v2';

// Supported blockchain networks
export const SUPPORTED_NETWORKS: { [key: string]: { name: string, chainId: number } } = {
  ethereum: { name: 'Ethereum', chainId: 1 },
  binance: { name: 'Binance Smart Chain', chainId: 56 },
  polygon: { name: 'Polygon', chainId: 137 },
};

// Transaction status enums
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
};

// Vault status enums
export const VAULT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
};

// Default pagination limit for API requests
export const PAGINATION_LIMIT: number = 20;

// Date format for displaying dates in the UI
export const DATE_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

// Number of decimal places to display for currency values
export const CURRENCY_DECIMALS: number = 8;

// Interval (in milliseconds) for refreshing data
export const REFRESH_INTERVAL: number = 30000; // 30 seconds

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  LAST_SELECTED_NETWORK: 'last_selected_network',
};

// Human tasks:
// TODO: Ensure all constants are properly typed for TypeScript support
// TODO: Add comments explaining the purpose and usage of each constant
// TODO: Consider grouping related constants into objects or enums for better organization
// TODO: Implement a system for loading environment-specific constants (e.g., different API URLs for dev/prod)
// TODO: Add unit tests to ensure constants are not accidentally modified
// TODO: Consider using a configuration management system for dynamic constants
// TODO: Implement a naming convention for constants (e.g., all uppercase with underscores)
// TODO: Ensure sensitive information (like API keys) are not hardcoded in this file
// TODO: Add validation for complex constants (e.g., ensure SUPPORTED_NETWORKS contains valid network objects)