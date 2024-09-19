import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../../src/frontend/pages/Dashboard';
import rootReducer from '../../src/frontend/store/reducers';

// Function to set up a mock Redux store for testing
const setupStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};

// Function to render a component with Redux provider for testing
const renderWithRedux = (component: React.ReactElement, initialState = {}) => {
  const store = setupStore(initialState);
  const rendered = render(
    <Provider store={store}>
      {component}
    </Provider>
  );
  return { ...rendered, store };
};

describe('Dashboard Component', () => {
  test('Dashboard component renders correctly', () => {
    // Set up initial state with user data
    const initialState = {
      user: { name: 'John Doe' },
      dashboard: {
        loading: false,
        error: null,
      },
    };

    // Render the Dashboard component with Redux
    renderWithRedux(<Dashboard />, initialState);

    // Check if the welcome message with the user's name is displayed
    expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();

    // Check if the DashboardOverview component is rendered
    expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();

    // Check if the VaultSummary component is rendered
    expect(screen.getByTestId('vault-summary')).toBeInTheDocument();

    // Check if the RecentTransactions component is rendered
    expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();

    // Check if the PerformanceMetrics component is rendered
    expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();

    // Check if the AlertsNotifications component is rendered
    expect(screen.getByTestId('alerts-notifications')).toBeInTheDocument();
  });

  test('Dashboard displays loading state', () => {
    // Set up initial state with loading set to true
    const initialState = {
      dashboard: {
        loading: true,
        error: null,
      },
    };

    // Render the Dashboard component with Redux
    renderWithRedux(<Dashboard />, initialState);

    // Check if a loading indicator or skeleton is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('Dashboard handles error state', () => {
    // Set up initial state with an error message
    const initialState = {
      dashboard: {
        loading: false,
        error: 'Failed to load dashboard data',
      },
    };

    // Render the Dashboard component with Redux
    renderWithRedux(<Dashboard />, initialState);

    // Check if the error message is displayed
    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
  });

  test('Dashboard updates when Redux state changes', () => {
    // Set up initial state
    const initialState = {
      user: { name: 'John Doe' },
      dashboard: {
        loading: false,
        error: null,
        data: { balance: 1000 },
      },
    };

    // Render the Dashboard component with Redux
    const { store } = renderWithRedux(<Dashboard />, initialState);

    // Check initial balance
    expect(screen.getByText('Balance: $1000')).toBeInTheDocument();

    // Dispatch an action to update the state
    store.dispatch({ type: 'UPDATE_BALANCE', payload: 1500 });

    // Check if the Dashboard component reflects the updated state
    expect(screen.getByText('Balance: $1500')).toBeInTheDocument();
  });
});

// Human tasks:
// TODO: Implement more detailed tests for each subcomponent rendered in the Dashboard
// TODO: Add tests for user interactions (e.g., clicking on elements, navigating)
// TODO: Implement tests for different screen sizes to ensure responsive design
// TODO: Add tests for accessibility compliance
// TODO: Implement tests for different user roles and permissions
// TODO: Add tests for real-time data updates (e.g., WebSocket connections)
// TODO: Implement tests for error boundaries and fallback UI
// TODO: Add performance tests (e.g., rendering time, memory usage)
// TODO: Implement tests for internationalization and localization
// TODO: Add tests for different themes or color schemes if applicable