import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Analytics from '../../src/frontend/pages/Analytics';
import rootReducer from '../../src/frontend/store/reducers';
import { fetchAnalyticsData } from '../../src/frontend/store/actions/analyticsActions';

// Mock the fetchAnalyticsData action
jest.mock('../../src/frontend/store/actions/analyticsActions', () => ({
  fetchAnalyticsData: jest.fn(),
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

describe('Analytics Component', () => {
  test('Analytics component renders correctly', () => {
    const initialState = {
      analytics: {
        data: {
          // Add some mock analytics data here
        },
        loading: false,
        error: null,
      },
    };

    renderWithRedux(<Analytics />, initialState);

    // Check if the page title is displayed
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();

    // Check if the main components are rendered
    expect(screen.getByTestId('performance-charts')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-volume')).toBeInTheDocument();
    expect(screen.getByTestId('network-distribution')).toBeInTheDocument();
    expect(screen.getByTestId('custom-report-generator')).toBeInTheDocument();
  });

  test('Analytics displays loading state', () => {
    const initialState = {
      analytics: {
        data: null,
        loading: true,
        error: null,
      },
    };

    renderWithRedux(<Analytics />, initialState);

    // Check if a loading indicator is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('Analytics handles error state', () => {
    const errorMessage = 'Failed to fetch analytics data';
    const initialState = {
      analytics: {
        data: null,
        loading: false,
        error: errorMessage,
      },
    };

    renderWithRedux(<Analytics />, initialState);

    // Check if the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('Analytics fetches data on mount', () => {
    renderWithRedux(<Analytics />);

    // Check if the fetchAnalyticsData action was dispatched
    expect(fetchAnalyticsData).toHaveBeenCalled();
  });

  test('DateRangeSelector in Analytics works correctly', async () => {
    const { store } = renderWithRedux(<Analytics />);

    // Find the DateRangeSelector component
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    // Change the date range
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-12-31' } });

    // Check if the fetchAnalyticsData action is dispatched with new date range
    await waitFor(() => {
      expect(fetchAnalyticsData).toHaveBeenCalledWith({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      });
    });
  });

  test('CustomReportGenerator can generate a report', async () => {
    const { store } = renderWithRedux(<Analytics />);

    // Find the CustomReportGenerator component
    const metricSelect = screen.getByLabelText('Select Metric');
    const dimensionSelect = screen.getByLabelText('Select Dimension');
    const generateButton = screen.getByText('Generate Report');

    // Fill in the report parameters
    fireEvent.change(metricSelect, { target: { value: 'transactions' } });
    fireEvent.change(dimensionSelect, { target: { value: 'daily' } });

    // Click the 'Generate Report' button
    fireEvent.click(generateButton);

    // Check if the appropriate action is dispatched to generate the report
    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'GENERATE_CUSTOM_REPORT',
          payload: {
            metric: 'transactions',
            dimension: 'daily',
          },
        })
      );
    });

    // Verify that the generated report is displayed or downloaded
    // This part depends on how your application handles report generation
    // You might need to mock the report generation service and check for a specific element or download trigger
  });
});

// Human tasks:
// - Implement more detailed tests for each chart component (PerformanceCharts, TransactionVolume, NetworkDistribution)
// - Add tests for different time ranges and their effect on displayed data
// - Implement tests for data export functionality if available
// - Add tests for different user permissions and their impact on available analytics
// - Implement tests for custom metrics or dimensions in the CustomReportGenerator
// - Add tests for responsive design and mobile view of charts and reports
// - Implement tests for real-time data updates if applicable
// - Add accessibility tests for charts and interactive elements
// - Implement tests for caching mechanisms if used for performance optimization
// - Add tests for handling large datasets and performance under load