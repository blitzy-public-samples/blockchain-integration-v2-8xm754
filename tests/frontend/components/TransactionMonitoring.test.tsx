import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TransactionMonitoring from '../../src/frontend/pages/TransactionMonitoring';
import rootReducer from '../../src/frontend/store/reducers';
import { fetchTransactions } from '../../src/frontend/store/actions/transactionActions';

// Mock the fetchTransactions action
jest.mock('../../src/frontend/store/actions/transactionActions', () => ({
  fetchTransactions: jest.fn(),
}));

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
  const utils = render(
    <Provider store={store}>
      {component}
    </Provider>
  );
  return { ...utils, store };
};

describe('TransactionMonitoring', () => {
  test('TransactionMonitoring component renders correctly', () => {
    const initialState = {
      transactions: {
        items: [{ id: '1', status: 'completed' }],
        loading: false,
        error: null,
      },
    };

    renderWithRedux(<TransactionMonitoring />, initialState);

    // Check if the page title is displayed
    expect(screen.getByText('Transaction Monitoring')).toBeInTheDocument();

    // Check if the TransactionList component is rendered
    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();

    // Check if the RealTimeStatusUpdates component is rendered
    expect(screen.getByTestId('real-time-updates')).toBeInTheDocument();

    // Check if the FilterSort component is rendered
    expect(screen.getByTestId('filter-sort')).toBeInTheDocument();
  });

  test('TransactionMonitoring displays loading state', () => {
    const initialState = {
      transactions: {
        items: [],
        loading: true,
        error: null,
      },
    };

    renderWithRedux(<TransactionMonitoring />, initialState);

    // Check if a loading indicator or skeleton is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('TransactionMonitoring handles error state', () => {
    const errorMessage = 'Failed to fetch transactions';
    const initialState = {
      transactions: {
        items: [],
        loading: false,
        error: errorMessage,
      },
    };

    renderWithRedux(<TransactionMonitoring />, initialState);

    // Check if the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('TransactionMonitoring fetches transactions on mount', async () => {
    renderWithRedux(<TransactionMonitoring />);

    // Check if the fetchTransactions action was dispatched
    await waitFor(() => {
      expect(fetchTransactions).toHaveBeenCalled();
    });
  });

  test('TransactionMonitoring can switch between All Transactions and Real-Time Updates tabs', () => {
    renderWithRedux(<TransactionMonitoring />);

    // Find and click the 'Real-Time Updates' tab
    fireEvent.click(screen.getByText('Real-Time Updates'));

    // Check if the RealTimeStatusUpdates component is displayed
    expect(screen.getByTestId('real-time-updates')).toBeVisible();

    // Find and click the 'All Transactions' tab
    fireEvent.click(screen.getByText('All Transactions'));

    // Check if the TransactionList component is displayed
    expect(screen.getByTestId('transaction-list')).toBeVisible();
  });

  test('FilterSort component in TransactionMonitoring works correctly', async () => {
    renderWithRedux(<TransactionMonitoring />);

    // Find the FilterSort component
    const filterSort = screen.getByTestId('filter-sort');

    // Interact with filter inputs
    const dateFromInput = screen.getByLabelText('From Date');
    const dateToInput = screen.getByLabelText('To Date');
    const statusSelect = screen.getByLabelText('Transaction Status');

    fireEvent.change(dateFromInput, { target: { value: '2023-01-01' } });
    fireEvent.change(dateToInput, { target: { value: '2023-12-31' } });
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    // Find and click the apply filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    // Check if the fetchTransactions action is dispatched with correct filter parameters
    await waitFor(() => {
      expect(fetchTransactions).toHaveBeenCalledWith({
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
        status: 'completed',
      });
    });
  });
});

// Human tasks:
// - Implement more detailed tests for the TransactionList component within TransactionMonitoring
// - Add tests for pagination or infinite scrolling if implemented
// - Implement tests for sorting transactions by different fields
// - Add tests for selecting and viewing details of a specific transaction
// - Implement tests for real-time updates functionality
// - Add tests for different user permissions (e.g., read-only vs. admin)
// - Implement tests for exporting transaction data if such functionality exists
// - Add tests for error handling during transaction fetching or real-time updates
// - Implement tests for responsive design and mobile view
// - Add accessibility tests for the TransactionMonitoring component and its subcomponents