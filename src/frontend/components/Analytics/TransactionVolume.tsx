import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactionVolumeData } from '../../store/actions/analyticsActions';
import { formatNumber, formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
  chartContainer: {
    height: 400,
  },
  statItem: {
    textAlign: 'center',
  },
}));

const TransactionVolume: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get transaction volume data from Redux store
  const transactionVolumeData = useSelector((state: RootState) => state.analytics.transactionVolume);

  // Create state for time range selection
  const [timeRange, setTimeRange] = useState('7d');

  // Implement useEffect to fetch transaction volume data on component mount
  useEffect(() => {
    dispatch(fetchTransactionVolumeData(timeRange));
  }, [dispatch, timeRange]);

  // Implement handleTimeRangeChange function
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  // Prepare data for Transaction Volume Bar chart
  const chartData = {
    labels: transactionVolumeData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Transaction Volume',
        data: transactionVolumeData.map((item) => item.volume),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate total transaction volume and growth rate
  const totalVolume = transactionVolumeData.reduce((sum, item) => sum + item.volume, 0);
  const growthRate = transactionVolumeData.length > 1
    ? ((transactionVolumeData[transactionVolumeData.length - 1].volume - transactionVolumeData[0].volume) / transactionVolumeData[0].volume) * 100
    : 0;

  // Configure chart options for proper display and formatting
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatNumber(value),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `Volume: ${formatNumber(context.parsed.y)}`,
        },
      },
    },
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transaction Volume
        </Typography>

        {/* Render time range selection dropdown */}
        <FormControl className={classes.formControl}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={handleTimeRangeChange}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>

        {/* Render Transaction Volume Bar chart */}
        <div className={classes.chartContainer}>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Display total transaction volume and growth rate statistics */}
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={6} className={classes.statItem}>
            <Typography variant="h6">Total Volume</Typography>
            <Typography variant="h4">{formatNumber(totalVolume)}</Typography>
          </Grid>
          <Grid item xs={6} className={classes.statItem}>
            <Typography variant="h6">Growth Rate</Typography>
            <Typography variant="h4" style={{ color: growthRate >= 0 ? 'green' : 'red' }}>
              {growthRate.toFixed(2)}%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TransactionVolume;

// Human tasks:
// - Add unit tests for the TransactionVolume component
// - Implement error handling for transaction volume data fetching
// - Add loading state while transaction volume data is being fetched
// - Optimize chart rendering performance for large datasets
// - Implement accessibility features for the chart (keyboard navigation, screen reader support)
// - Add internationalization support for number and date formatting
// - Implement responsive design for better mobile viewing experience
// - Add color theme consistency with the rest of the application
// - Implement a caching mechanism to store and reuse recently fetched transaction volume data