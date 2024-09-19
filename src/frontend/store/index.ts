// Import necessary dependencies from Redux and related libraries
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers
import authReducer from './reducers/authReducer';
import vaultReducer from './reducers/vaultReducer';
import transactionReducer from './reducers/transactionReducer';
import analyticsReducer from './reducers/analyticsReducer';
import notificationReducer from './reducers/notificationReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  vault: vaultReducer,
  transaction: transactionReducer,
  analytics: analyticsReducer,
  notification: notificationReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  // Add any blacklist or whitelist configurations here
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware and dev tools
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// Create persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };

// Export RootState type for use in components and other parts of the app
export type RootState = ReturnType<typeof rootReducer>;

// Human tasks (commented):
// TODO: Implement proper type checking for the entire Redux store
// TODO: Add middleware for logging in development environment
// TODO: Implement middleware for handling API calls
// TODO: Add support for code splitting and dynamic reducer injection
// TODO: Implement performance optimizations for large state trees
// TODO: Add support for state rehydration for offline-first functionality
// TODO: Implement state sanitization to remove sensitive data before persistence
// TODO: Add support for state migration between different app versions
// TODO: Implement error boundary for Redux to catch and report errors in reducers