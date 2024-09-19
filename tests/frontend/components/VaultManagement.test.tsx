import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VaultManagement from '../../src/frontend/pages/VaultManagement';
import rootReducer from '../../src/frontend/store/reducers';
import { fetchVaults, createVault } from '../../src/frontend/store/actions/vaultActions';

// Mock the vaultActions
jest.mock('../../src/frontend/store/actions/vaultActions', () => ({
  fetchVaults: jest.fn(),
  createVault: jest.fn(),
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

describe('VaultManagement', () => {
  test('VaultManagement component renders correctly', () => {
    const initialState = {
      vaults: {
        items: [{ id: '1', name: 'Test Vault' }],
        loading: false,
        error: null,
      },
    };
    renderWithRedux(<VaultManagement />, initialState);

    // Check if the page title is displayed
    expect(screen.getByText('Vault Management')).toBeInTheDocument();

    // Check if the VaultList component is rendered
    expect(screen.getByText('Test Vault')).toBeInTheDocument();

    // Check if the 'Create Vault' button is present
    expect(screen.getByText('Create Vault')).toBeInTheDocument();
  });

  test('VaultManagement displays loading state', () => {
    const initialState = {
      vaults: {
        items: [],
        loading: true,
        error: null,
      },
    };
    renderWithRedux(<VaultManagement />, initialState);

    // Check if a loading indicator or skeleton is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('VaultManagement handles error state', () => {
    const initialState = {
      vaults: {
        items: [],
        loading: false,
        error: 'Failed to fetch vaults',
      },
    };
    renderWithRedux(<VaultManagement />, initialState);

    // Check if the error message is displayed
    expect(screen.getByText('Failed to fetch vaults')).toBeInTheDocument();
  });

  test('Create Vault button opens the create vault dialog', () => {
    renderWithRedux(<VaultManagement />);

    // Find and click the 'Create Vault' button
    fireEvent.click(screen.getByText('Create Vault'));

    // Check if the create vault dialog is displayed
    expect(screen.getByTestId('create-vault-dialog')).toBeInTheDocument();
  });

  test('VaultManagement fetches vaults on mount', () => {
    renderWithRedux(<VaultManagement />);

    // Check if the fetchVaults action was dispatched
    expect(fetchVaults).toHaveBeenCalled();
  });

  test('VaultManagement can create a new vault', async () => {
    renderWithRedux(<VaultManagement />);

    // Open the create vault dialog
    fireEvent.click(screen.getByText('Create Vault'));

    // Fill in the vault creation form
    fireEvent.change(screen.getByLabelText('Vault Name'), { target: { value: 'New Vault' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Check if the createVault action was dispatched with correct data
    await waitFor(() => {
      expect(createVault).toHaveBeenCalledWith({
        name: 'New Vault',
        description: 'Test Description',
      });
    });

    // Check if the create vault dialog is closed after submission
    expect(screen.queryByTestId('create-vault-dialog')).not.toBeInTheDocument();
  });
});

// Human tasks:
// - Implement more detailed tests for the VaultList component within VaultManagement
// - Add tests for pagination or infinite scrolling if implemented
// - Implement tests for filtering and sorting vaults
// - Add tests for selecting and viewing details of a specific vault
// - Implement tests for editing and deleting vaults
// - Add tests for different user permissions (e.g., read-only vs. admin)
// - Implement tests for form validation in the create vault dialog
// - Add tests for error handling during vault creation or fetching
// - Implement tests for responsive design and mobile view
// - Add accessibility tests for the VaultManagement component and its subcomponents