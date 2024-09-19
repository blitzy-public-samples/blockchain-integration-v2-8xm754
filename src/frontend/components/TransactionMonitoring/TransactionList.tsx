import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import { FilterList, Sort } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactions } from '../../store/actions/transactionActions';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionStatus from '../common/TransactionStatus';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
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
  sortButton: {
    marginLeft: theme.spacing(1),
  },
}));

const TransactionList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.list);

  // State for pagination, filters, and sort order
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch transactions on component mount and filter/sort changes
  useEffect(() => {
    dispatch(fetchTransactions({ page, rowsPerPage, filter, sortBy, sortOrder }));
  }, [dispatch, page, rowsPerPage, filter, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Handle filter change
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setPage(1);
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.filterContainer}>
        <TextField
          className={classes.filterField}
          label="Filter transactions"
          variant="outlined"
          size="small"
          value={filter}
          onChange={handleFilterChange}
        />
        <IconButton>
          <FilterList />
        </IconButton>
      </div>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                ID
                <IconButton className={classes.sortButton} onClick={() => handleSortChange('id')}>
                  <Sort />
                </IconButton>
              </TableCell>
              <TableCell>
                Date
                <IconButton className={classes.sortButton} onClick={() => handleSortChange('date')}>
                  <Sort />
                </IconButton>
              </TableCell>
              <TableCell>
                Amount
                <IconButton className={classes.sortButton} onClick={() => handleSortChange('amount')}>
                  <Sort />
                </IconButton>
              </TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{transaction.sender}</TableCell>
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
        count={Math.ceil(transactions.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      />
    </Paper>
  );
};

export default TransactionList;

// Human tasks:
// - Add unit tests for the TransactionList component
// - Implement error handling for transaction data fetching
// - Add loading state while transactions are being fetched
// - Optimize performance for rendering large transaction lists
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for currency, date, and transaction type formatting
// - Implement responsive design for better mobile viewing experience
// - Add tooltips to explain transaction types and statuses
// - Implement a feature to highlight or pin important transactions