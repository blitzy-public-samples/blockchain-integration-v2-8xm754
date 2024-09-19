import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionStatus from '../../components/common/TransactionStatus';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
}));

const RecentTransactions: React.FC = () => {
  // Use useSelector to get recent transactions data from Redux store
  const recentTransactions = useSelector((state: RootState) => state.transactions.recent);

  // Use useStyles to get CSS classes
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="recent transactions table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Date</TableCell>
                <TableCell className={classes.tableHeader}>Amount</TableCell>
                <TableCell className={classes.tableHeader}>Recipient</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{transaction.recipient}</TableCell>
                  <TableCell>
                    <TransactionStatus status={transaction.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

// Human tasks:
// TODO: Add unit tests for the RecentTransactions component
// TODO: Implement error handling for data fetching
// TODO: Add loading state while transactions are being fetched
// TODO: Optimize performance for rendering large lists of transactions
// TODO: Implement accessibility features (ARIA labels, keyboard navigation)
// TODO: Add internationalization support for date and currency formatting
// TODO: Implement pagination or infinite scrolling for large transaction lists
// TODO: Add sorting functionality for each column
// TODO: Implement filtering options (e.g., by date range, status, or amount)
// TODO: Add click handler to navigate to detailed transaction view
// TODO: Implement real-time updates for transaction status changes