import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactionDetails } from '../../store/actions/transactionActions';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionStatus from '../common/TransactionStatus';
import BlockchainExplorerLink from '../common/BlockchainExplorerLink';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  refreshButton: {
    marginTop: theme.spacing(2),
  },
}));

interface TransactionDetailsProps {
  transactionId: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactionId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get transaction details from Redux store
  const transactionDetails = useSelector((state: RootState) => state.transactions.currentTransaction);

  // Implement useEffect to fetch transaction details on component mount or transactionId change
  useEffect(() => {
    dispatch(fetchTransactionDetails(transactionId));
  }, [dispatch, transactionId]);

  // Function to refresh transaction details
  const handleRefresh = () => {
    dispatch(fetchTransactionDetails(transactionId));
  };

  if (!transactionDetails) {
    return <Typography>Loading transaction details...</Typography>;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transaction Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Transaction ID:</Typography>
            <Typography>{transactionDetails.id}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Status:</Typography>
            <TransactionStatus status={transactionDetails.status} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Amount:</Typography>
            <Typography>{formatCurrency(transactionDetails.amount, transactionDetails.currency)}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Sender:</Typography>
            <Typography>{transactionDetails.sender}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Recipient:</Typography>
            <Typography>{transactionDetails.recipient}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Date:</Typography>
            <Typography>{formatDate(transactionDetails.timestamp)}</Typography>
          </Grid>

          <Divider className={classes.divider} />

          {/* Render blockchain-specific details */}
          {transactionDetails.blockchainType === 'ethereum' && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Block Number:</Typography>
                <Typography>{transactionDetails.blockNumber}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">Gas Fee:</Typography>
                <Typography>{formatCurrency(transactionDetails.gasFee, 'ETH')}</Typography>
              </Grid>
            </>
          )}

          {/* Add conditional rendering for other blockchain types here */}

          <Grid item xs={12}>
            <BlockchainExplorerLink
              transactionId={transactionDetails.id}
              blockchainType={transactionDetails.blockchainType}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          className={classes.refreshButton}
        >
          Refresh Transaction Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;

// Human tasks:
// - Add unit tests for the TransactionDetails component
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for date, time, and currency formatting
// - Implement responsive design for better mobile viewing experience
// - Add tooltips to explain technical blockchain terms
// - Implement a feature to share transaction details (e.g., via email or messaging)
// - Add support for displaying transaction history or status changes over time
// - Implement a way to initiate follow-up actions based on transaction status (e.g., retry failed transactions)