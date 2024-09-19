import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatNumber, formatPercentage } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  chartContainer: {
    height: 300,
  },
  statistic: {
    textAlign: 'center',
  },
}));

// Create PerformanceMetrics functional component
const PerformanceMetrics: React.FC = () => {
  // Use useSelector to get performance data from Redux store
  const performanceData = useSelector((state: RootState) => state.performance);

  // Prepare data for Line charts (transaction volume, success rate, processing time)
  const transactionVolumeData = {
    labels: performanceData.dates,
    datasets: [
      {
        label: 'Transaction Volume',
        data: performanceData.transactionVolume,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const successRateData = {
    labels: performanceData.dates,
    datasets: [
      {
        label: 'Success Rate',
        data: performanceData.successRate,
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };

  const processingTimeData = {
    labels: performanceData.dates,
    datasets: [
      {
        label: 'Average Processing Time (ms)',
        data: performanceData.averageProcessingTime,
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
    ],
  };

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Return JSX with Card and Grid layout
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          {/* Render transaction volume chart */}
          <Grid item xs={12} md={4}>
            <div className={classes.chartContainer}>
              <Line data={transactionVolumeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Grid>
          {/* Render success rate chart */}
          <Grid item xs={12} md={4}>
            <div className={classes.chartContainer}>
              <Line data={successRateData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Grid>
          {/* Render average processing time chart */}
          <Grid item xs={12} md={4}>
            <div className={classes.chartContainer}>
              <Line data={processingTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Grid>
          {/* Display key statistics */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={classes.statistic}>
              Total Transactions
            </Typography>
            <Typography variant="h4" className={classes.statistic}>
              {formatNumber(performanceData.totalTransactions)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={classes.statistic}>
              Overall Success Rate
            </Typography>
            <Typography variant="h4" className={classes.statistic}>
              {formatPercentage(performanceData.overallSuccessRate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={classes.statistic}>
              Average Processing Time
            </Typography>
            <Typography variant="h4" className={classes.statistic}>
              {formatNumber(performanceData.overallAverageProcessingTime)} ms
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;

// Human tasks:
// - Add unit tests for the PerformanceMetrics component
// - Implement error handling for data fetching and chart rendering
// - Add loading state while performance data is being fetched
// - Optimize chart rendering performance for large datasets
// - Implement accessibility features for charts (keyboard navigation, screen reader support)
// - Add internationalization support for number and date formatting in charts
// - Implement color theme consistency with the rest of the application
// - Add responsive design for better mobile viewing experience of charts
// - Implement date range selector for customizable time periods
// - Add tooltips to charts for detailed information on hover
// - Implement comparison feature to show metrics against previous periods
// - Add export functionality for chart data (CSV, PNG)
// - Implement real-time updates for live performance tracking