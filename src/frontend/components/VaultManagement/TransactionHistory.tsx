import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import { FilterList } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactionHistory } from '../../store/actions/transactionActions';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionStatus from '../common/TransactionStatus';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  filterField: {
    marginRight: theme.spacing(2),
  },
  sortableHeader: {
    cursor: 'pointer',
  },
}));

interface TransactionHistoryProps {
  vaultId: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ vaultId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get transaction history from Redux store
  const transactions = useSelector((state: RootState) => state.transactions.history);

  // Create state for pagination, filters, and sort order
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Implement useEffect to fetch transaction history on component mount or vaultId change
  useEffect(() => {
    dispatch(fetchTransactionHistory(vaultId));
  }, [dispatch, vaultId]);

  // Implement handlePageChange function
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Implement handleFilterChange function
  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(event.target.value as string);
    setPage(1);
  };

  // Implement handleSortChange function
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => filter === 'all' || transaction.type === filter)
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate pagination
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.filterContainer}>
          <TextField
            select
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            className={classes.filterField}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="deposit">Deposit</MenuItem>
            <MenuItem value="withdrawal">Withdrawal</MenuItem>
            <MenuItem value="transfer">Transfer</MenuItem>
          </TextField>
          <IconButton>
            <FilterList />
          </IconButton>
        </div>
        <TableContainer>
          <Table className={classes.table} aria-label="transaction history table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.sortableHeader} onClick={() => handleSortChange('date')}>
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell className={classes.sortableHeader} onClick={() => handleSortChange('type')}>
                  Type {sortBy === 'type' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell className={classes.sortableHeader} onClick={() => handleSortChange('amount')}>
                  Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
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
        <Pagination
          count={Math.ceil(filteredTransactions.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Paper>
    </div>
  );
};

export default TransactionHistory;

// Human tasks:
// - Add unit tests for the TransactionHistory component
// - Implement error handling for transaction history fetching
// - Add loading state while transaction history is being fetched
// - Optimize performance for rendering large transaction lists
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for currency, date, and transaction type formatting
// - Implement responsive design for better mobile viewing experience
// - Add tooltips to explain transaction types and statuses
// - Implement advanced filtering options (e.g., date range, amount range)
// - Add ability to export transaction history to CSV or PDF
// - Implement click handler to view detailed transaction information
// - Add real-time updates for transaction status changes
// - Implement infinite scrolling as an alternative to pagination