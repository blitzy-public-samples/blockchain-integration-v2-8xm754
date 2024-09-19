// Import the combineReducers function from Redux
import { combineReducers } from 'redux';

// Import individual reducers
import authReducer from './authReducer';
import vaultReducer from './vaultReducer';
import transactionReducer from './transactionReducer';
import analyticsReducer from './analyticsReducer';
import notificationReducer from './notificationReducer';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  vault: vaultReducer,
  transaction: transactionReducer,
  analytics: analyticsReducer,
  notification: notificationReducer,
});

// Export the root reducer
export default rootReducer;

// Human tasks:
// TODO: Ensure all reducers are properly typed for TypeScript support
// TODO: Add unit tests for the combined root reducer
// TODO: Implement error handling within each reducer to prevent state corruption
// TODO: Consider implementing reducer composition for complex state updates
// TODO: Add performance monitoring for frequently updated state slices
// TODO: Implement state normalization for consistent data structures
// TODO: Add support for dynamic reducer injection for code splitting
// TODO: Ensure immutability in all reducer functions
// TODO: Implement state validation to catch inconsistencies early