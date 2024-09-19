import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PieChart } from 'react-minimal-pie-chart';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  pieChart: {
    height: 200,
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
  },
}));

// VaultSummary functional component
const VaultSummary: React.FC = () => {
  const classes = useStyles();

  // Use useSelector to get vault data from Redux store
  const vaults = useSelector((state: RootState) => state.vaults.vaults);

  // Calculate total balance and vault count
  const totalBalance = vaults.reduce((sum, vault) => sum + vault.balance, 0);
  const vaultCount = vaults.length;

  // Prepare data for PieChart
  const blockchainTypes = vaults.reduce((acc, vault) => {
    acc[vault.blockchainType] = (acc[vault.blockchainType] || 0) + vault.balance;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(blockchainTypes).map(([label, value], index) => ({
    title: label,
    value,
    color: [`#FF6384`, `#36A2EB`, `#FFCE56`, `#4BC0C0`, `#9966FF`][index % 5],
  }));

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Vault Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{formatCurrency(totalBalance)}</Typography>
            <Typography variant="subtitle1">Total Balance</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{vaultCount}</Typography>
            <Typography variant="subtitle1">Total Vaults</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PieChart
              data={pieChartData}
              lineWidth={20}
              paddingAngle={2}
              rounded
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                fontSize: '5px',
                fontFamily: 'sans-serif',
              }}
              labelPosition={60}
              className={classes.pieChart}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.legend}>
              {pieChartData.map((item) => (
                <div key={item.title} className={classes.legendItem}>
                  <div
                    className={classes.legendColor}
                    style={{ backgroundColor: item.color }}
                  />
                  <Typography variant="body2">
                    {item.title}: {formatCurrency(item.value)} ({((item.value / totalBalance) * 100).toFixed(2)}%)
                  </Typography>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VaultSummary;

// Human tasks:
// TODO: Review and optimize the performance of the PieChart rendering
// TODO: Implement a refresh mechanism to update vault data periodically
// TODO: Add tooltips to provide more detailed information on hover
// TODO: Implement internationalization for currency formatting
// TODO: Add animation to the PieChart for a more engaging user experience
// TODO: Implement error handling for data fetching
// TODO: Add loading state while data is being fetched
// TODO: Implement responsive design for mobile devices
// TODO: Add unit tests for the VaultSummary component
// TODO: Implement accessibility features (ARIA labels, color contrast)