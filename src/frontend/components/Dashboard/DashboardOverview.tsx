import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VaultSummary from '../VaultManagement/VaultSummary';
import RecentTransactions from './RecentTransactions';
import PerformanceMetrics from './PerformanceMetrics';
import AlertsNotifications from './AlertsNotifications';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  gridItem: {
    marginBottom: theme.spacing(3),
  },
}));

// Main functional component for the Dashboard Overview
const DashboardOverview: React.FC = () => {
  // Use useSelector to get dashboard data from Redux store
  const dashboardData = useSelector((state: RootState) => state.dashboard);

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Return JSX with Grid layout
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Render VaultSummary component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <VaultSummary vaultData={dashboardData.vaultData} />
        </Grid>

        {/* Render RecentTransactions component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <RecentTransactions transactions={dashboardData.recentTransactions} />
        </Grid>

        {/* Render PerformanceMetrics component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <PerformanceMetrics metrics={dashboardData.performanceMetrics} />
        </Grid>

        {/* Render AlertsNotifications component */}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <AlertsNotifications alerts={dashboardData.alerts} />
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardOverview;

// Human tasks:
// TODO: Implement error handling for data fetching
// TODO: Add loading states for each dashboard component
// TODO: Implement responsive design for mobile devices
// TODO: Add unit tests for the DashboardOverview component
// TODO: Implement accessibility features (ARIA labels, keyboard navigation)