import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchNetworkDistribution } from '../../store/actions/analyticsActions';
import { formatPercentage } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  chartContainer: {
    height: 300,
    position: 'relative',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0.5),
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: theme.spacing(0.5),
  },
}));

const NetworkDistribution: React.FC = () => {
  const classes = useStyles();

  // Use useSelector to get network distribution data from Redux store
  const networkDistribution = useSelector((state: RootState) => state.analytics.networkDistribution);

  // Implement useEffect to fetch network distribution data on component mount
  useEffect(() => {
    fetchNetworkDistribution();
  }, []);

  // Prepare data for Pie chart using network distribution data
  const chartData = {
    labels: networkDistribution.map((item) => item.network),
    datasets: [
      {
        data: networkDistribution.map((item) => item.percentage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  // Configure chart options for proper display and formatting
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const value = dataset.data[tooltipItem.index];
          return ` ${data.labels[tooltipItem.index]}: ${formatPercentage(value)}`;
        },
      },
    },
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Distribution
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Distribution of transactions across different blockchain networks
        </Typography>
        <div className={classes.chartContainer}>
          <Pie data={chartData} options={chartOptions} />
        </div>
        <div className={classes.legend}>
          {networkDistribution.map((item, index) => (
            <div key={item.network} className={classes.legendItem}>
              <div
                className={classes.legendColor}
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <Typography variant="body2">
                {item.network}: {formatPercentage(item.percentage)}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkDistribution;

// Human tasks:
// - Add unit tests for the NetworkDistribution component
// - Implement error handling for network distribution data fetching
// - Add loading state while network distribution data is being fetched
// - Implement accessibility features for the chart (keyboard navigation, screen reader support)
// - Add internationalization support for network names and percentage formatting
// - Implement responsive design for better mobile viewing experience
// - Add option to export the network distribution data as CSV or image
// - Implement a time range selector to view network distribution over different periods
// - Implement interactive tooltips for the pie chart slices
// - Add ability to click on a slice to view more details about that network
// - Implement a toggle to switch between transaction count and transaction volume
// - Add animation to the pie chart for a more engaging visualization
// - Implement color customization for different blockchain networks