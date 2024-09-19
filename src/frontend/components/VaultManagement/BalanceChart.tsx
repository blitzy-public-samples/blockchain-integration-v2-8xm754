import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchBalanceHistory } from '../../store/actions/vaultActions';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  chart: {
    marginTop: theme.spacing(2),
  },
}));

interface BalanceChartProps {
  vaultId: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ vaultId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get balance history data from Redux store
  const balanceHistory = useSelector((state: RootState) => state.vault.balanceHistory);

  // Create state for time range selection
  const [timeRange, setTimeRange] = useState('1M');

  // Implement useEffect to fetch balance history on component mount or vaultId change
  useEffect(() => {
    dispatch(fetchBalanceHistory(vaultId, timeRange));
  }, [dispatch, vaultId, timeRange]);

  // Implement handleTimeRangeChange function
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  // Prepare data for Line chart using balance history data
  const chartData = {
    labels: balanceHistory.map((entry) => formatDate(entry.date)),
    datasets: [
      {
        label: 'Balance',
        data: balanceHistory.map((entry) => entry.balance),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
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
        title: {
          display: true,
          text: 'Balance',
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `Balance: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vault Balance History
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="1W">1 Week</MenuItem>
            <MenuItem value="1M">1 Month</MenuItem>
            <MenuItem value="3M">3 Months</MenuItem>
            <MenuItem value="6M">6 Months</MenuItem>
            <MenuItem value="1Y">1 Year</MenuItem>
            <MenuItem value="ALL">All Time</MenuItem>
          </Select>
        </FormControl>
        <div className={classes.chart}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceChart;

// Human tasks:
// TODO: Add unit tests for the BalanceChart component
// TODO: Implement error handling for balance history data fetching
// TODO: Add loading state while balance history is being fetched
// TODO: Optimize performance for rendering large datasets
// TODO: Implement accessibility features for the chart (keyboard navigation, screen reader support)
// TODO: Add internationalization support for currency and date formatting in the chart
// TODO: Implement responsive design for better mobile viewing experience of the chart
// TODO: Add color theme consistency with the rest of the application
// TODO: Implement custom tooltips for the chart to show more detailed information
// TODO: Add ability to zoom in on specific time periods in the chart
// TODO: Implement comparison feature to show balance against a benchmark or another time period
// TODO: Add option to switch between linear and logarithmic scales
// TODO: Implement ability to export chart data or image