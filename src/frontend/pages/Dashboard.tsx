import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import VaultSummary from '../components/Dashboard/VaultSummary';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import PerformanceMetrics from '../components/Dashboard/PerformanceMetrics';
import AlertsNotifications from '../components/Dashboard/AlertsNotifications';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  gridItem: {
    marginBottom: theme.spacing(3),
  },
}));

// Create Dashboard functional component
const Dashboard: React.FC = () => {
  // Use useSelector to get user data from Redux store
  const user = useSelector((state: RootState) => state.user);

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Return JSX with Grid layout for dashboard components
  return (
    <div className={classes.root}>
      {/* Render welcome message with user's name */}
      <Typography variant="h4" className={classes.title}>
        Welcome, {user.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Render DashboardOverview component */}
        <Grid item xs={12} className={classes.gridItem}>
          <DashboardOverview />
        </Grid>

        {/* Render VaultSummary component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <VaultSummary />
        </Grid>

        {/* Render RecentTransactions component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <RecentTransactions />
        </Grid>

        {/* Render PerformanceMetrics component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <PerformanceMetrics />
        </Grid>

        {/* Render AlertsNotifications component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <AlertsNotifications />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

// Human tasks:
// TODO: Add unit tests for the Dashboard component
// TODO: Implement accessibility features (ARIA labels, keyboard navigation)
// TODO: Add internationalization support for dashboard text and data formatting
// TODO: Optimize performance for initial dashboard load and data updates
// TODO: Implement analytics tracking for dashboard usage and interactions
// TODO: Add tooltips or help icons to explain dashboard components and metrics
// TODO: Implement a tour or onboarding flow for new users
// TODO: Add support for dark mode or theme customization
// TODO: Implement error boundaries for each dashboard component
// TODO: Add loading states for components that fetch data
// TODO: Implement refresh functionality for dashboard data
// TODO: Add ability to customize dashboard layout or component visibility
// TODO: Implement responsive design for different screen sizes