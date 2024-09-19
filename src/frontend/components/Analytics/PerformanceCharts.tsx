import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line, Bar } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchPerformanceData } from '../../store/actions/analyticsActions';
import { formatDate, formatNumber } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const PerformanceCharts: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get performance data from Redux store
  const performanceData = useSelector((state: RootState) => state.analytics.performanceData);

  // Create state for time range selection
  const [timeRange, setTimeRange] = useState('7d');

  // Implement useEffect to fetch performance data on component mount
  useEffect(() => {
    dispatch(fetchPerformanceData(timeRange));
  }, [dispatch, timeRange]);

  // Implement handleTimeRangeChange function
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  // Prepare data for Transaction Volume chart
  const transactionVolumeData = {
    labels: performanceData.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'Transaction Volume',
        data: performanceData.map((data) => data.transactionVolume),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  // Prepare data for Success Rate chart
  const successRateData = {
    labels: performanceData.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'Success Rate',
        data: performanceData.map((data) => data.successRate * 100),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  // Prepare data for Average Processing Time chart
  const processingTimeData = {
    labels: performanceData.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'Average Processing Time (ms)',
        data: performanceData.map((data) => data.averageProcessingTime),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
    ],
  };

  // Configure chart options for proper display and formatting
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
        ticks: {
          callback: (value: number) => formatNumber(value),
        },
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Volume
            </Typography>
            <Line data={transactionVolumeData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Success Rate
            </Typography>
            <Bar data={successRateData} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, max: 100}}}} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Average Processing Time
            </Typography>
            <Line data={processingTimeData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PerformanceCharts;

// Human tasks:
// - Implement custom tooltips for the charts to show more detailed information
// - Add ability to export chart data as CSV or image
// - Implement comparison feature to show data against previous time periods
// - Add option to switch between different chart types (e.g., line, bar, area)
// - Implement drill-down functionality to view more granular data
// - Add unit tests for the PerformanceCharts component
// - Implement error handling for performance data fetching
// - Add loading state while performance data is being fetched
// - Optimize chart rendering performance for large datasets
// - Implement accessibility features for charts (keyboard navigation, screen reader support)
// - Add internationalization support for date and number formatting in charts
// - Implement responsive design for better mobile viewing experience of charts
// - Add color theme consistency with the rest of the application
// - Implement a caching mechanism to store and reuse recently fetched performance data