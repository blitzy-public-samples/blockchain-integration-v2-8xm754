// Import all action creators from their respective modules
import * as authActions from './authActions';
import * as vaultActions from './vaultActions';
import * as transactionActions from './transactionActions';
import * as analyticsActions from './analyticsActions';
import * as notificationActions from './notificationActions';

// Export all action creators as named exports
export {
  authActions,
  vaultActions,
  transactionActions,
  analyticsActions,
  notificationActions
};

// Human tasks:
// TODO: Ensure all exported actions are properly typed for TypeScript support
// TODO: Add unit tests for each group of actions to ensure they're correctly exported
// TODO: Implement a naming convention for actions to avoid conflicts
// TODO: Consider grouping related actions into namespaces for better organization
// TODO: Add documentation for each group of actions explaining their purpose and usage
// TODO: Implement a system for deprecating and removing old actions
// TODO: Ensure all action creators are pure functions for predictability
// TODO: Add performance monitoring for frequently dispatched actions
// TODO: Implement action normalization for consistent payload structures