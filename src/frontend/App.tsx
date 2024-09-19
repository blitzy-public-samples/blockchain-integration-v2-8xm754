import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import theme from './theme';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import VaultManagement from './pages/VaultManagement';
import TransactionMonitoring from './pages/TransactionMonitoring';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    // Wrap the entire application with Redux Provider
    <Provider store={store}>
      {/* Wrap the app with PersistGate for Redux persistence */}
      <PersistGate loading={null} persistor={persistor}>
        {/* Apply Material-UI ThemeProvider with custom theme */}
        <ThemeProvider theme={theme}>
          {/* Apply default Material-UI styles */}
          <CssBaseline />
          {/* Set up React Router for navigation */}
          <Router>
            <div className="app-container">
              {/* Render Header and Sidebar components */}
              <Header />
              <Sidebar />
              <main className="main-content">
                {/* Define routes for different pages */}
                <Switch>
                  {/* Use PrivateRoute for authenticated routes */}
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute path="/vault" component={VaultManagement} />
                  <PrivateRoute path="/transactions" component={TransactionMonitoring} />
                  <PrivateRoute path="/analytics" component={Analytics} />
                  {/* Render Login page for unauthenticated users */}
                  <Route path="/login" component={Login} />
                </Switch>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

// Human tasks:
// TODO: Implement error boundaries to catch and handle runtime errors
// TODO: Add loading indicator for PersistGate while rehydrating state
// TODO: Implement lazy loading for route components to improve initial load time
// TODO: Add global error handling for API requests
// TODO: Implement a notification system for displaying alerts to users
// TODO: Add accessibility features (e.g., skip to content link)
// TODO: Implement proper SEO meta tags for each route
// TODO: Add analytics tracking for page views and user interactions
// TODO: Implement a service worker for offline support and faster loading