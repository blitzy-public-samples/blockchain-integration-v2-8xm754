import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchAnalyticsData } from '../store/actions/analyticsActions';
import PerformanceCharts from '../components/Analytics/PerformanceCharts';
import TransactionVolume from '../components/Analytics/TransactionVolume';
import CustomReportGenerator from '../components/Analytics/CustomReportGenerator';
import NetworkDistribution from '../components/Analytics/NetworkDistribution';
import DateRangeSelector from '../components/common/DateRangeSelector';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
}));

const Analytics: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const analyticsData = useSelector((state: RootState) => state.analytics.data);
  const loading = useSelector((state: RootState) => state.analytics.loading);
  const error = useSelector((state: RootState) => state.analytics.error);

  const [selectedTab, setSelectedTab] = useState(0);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Fetch analytics data on component mount and date range changes
  useEffect(() => {
    dispatch(fetchAnalyticsData(dateRange.start, dateRange.end));
  }, [dispatch, dateRange]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  if (loading) {
    return <Typography>Loading analytics data...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading analytics data: {error}</Typography>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Analytics Dashboard
      </Typography>
      <DateRangeSelector onChange={handleDateRangeChange} />
      <Paper className={classes.paper}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          className={classes.tabs}
        >
          <Tab label="Overview" />
          <Tab label="Performance" />
          <Tab label="Custom Reports" />
        </Tabs>
        <Grid container spacing={3}>
          {selectedTab === 0 && (
            <>
              <Grid item xs={12} md={6}>
                <TransactionVolume data={analyticsData.transactionVolume} />
              </Grid>
              <Grid item xs={12} md={6}>
                <NetworkDistribution data={analyticsData.networkDistribution} />
              </Grid>
            </>
          )}
          {selectedTab === 1 && (
            <Grid item xs={12}>
              <PerformanceCharts data={analyticsData.performance} />
            </Grid>
          )}
          {selectedTab === 2 && (
            <Grid item xs={12}>
              <CustomReportGenerator />
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
};

export default Analytics;

// Human tasks:
// - Add unit tests for the Analytics component
// - Implement accessibility features (ARIA labels, keyboard navigation for charts)
// - Add internationalization support for text, numbers, and date formatting
// - Optimize performance for rendering multiple complex charts
// - Implement analytics tracking for user interactions with the analytics page
// - Add tooltips or help text to explain complex metrics and chart data
// - Implement a tour or onboarding flow for new users to understand the analytics features
// - Add support for saving and sharing custom analytics views
// - Implement responsive design for better mobile experience of charts and data
// - Add real-time updates for certain metrics, where applicable