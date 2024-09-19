import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchVaultDetails, initiateTransaction } from '../../store/actions/vaultActions';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionHistory from '../TransactionMonitoring/TransactionHistory';
import VaultStatus from '../common/VaultStatus';
import InitiateTransactionModal from './InitiateTransactionModal';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  detailItem: {
    marginBottom: theme.spacing(1),
  },
  tabContent: {
    marginTop: theme.spacing(2),
  },
  initiateButton: {
    marginTop: theme.spacing(2),
  },
}));

interface VaultDetailsProps {
  vaultId: string;
}

const VaultDetails: React.FC<VaultDetailsProps> = ({ vaultId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Use useSelector to get vault details from Redux store
  const vaultDetails = useSelector((state: RootState) => state.vaults.vaultDetails);

  // Create state for active tab and modal open status
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Implement useEffect to fetch vault details on component mount or vaultId change
  useEffect(() => {
    dispatch(fetchVaultDetails(vaultId));
  }, [dispatch, vaultId]);

  // Implement handleTabChange function
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  // Implement handleOpenModal and handleCloseModal functions
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Implement handleInitiateTransaction function
  const handleInitiateTransaction = (transactionDetails: any) => {
    dispatch(initiateTransaction(vaultId, transactionDetails));
    handleCloseModal();
  };

  if (!vaultDetails) {
    return <Typography>Loading vault details...</Typography>;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" className={classes.title}>
          {vaultDetails.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.detailItem}>
              <strong>Address:</strong> {vaultDetails.address}
            </Typography>
            <Typography className={classes.detailItem}>
              <strong>Balance:</strong> {formatCurrency(vaultDetails.balance)}
            </Typography>
            <Typography className={classes.detailItem}>
              <strong>Last Updated:</strong> {formatDate(vaultDetails.lastUpdated)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <VaultStatus status={vaultDetails.status} />
          </Grid>
        </Grid>

        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="Settings" />
        </Tabs>

        <div className={classes.tabContent}>
          {activeTab === 0 && (
            <Typography>
              {/* Add more detailed overview information here */}
              Vault overview information goes here.
            </Typography>
          )}
          {activeTab === 1 && <TransactionHistory vaultId={vaultId} />}
          {activeTab === 2 && (
            <Typography>
              {/* Add vault settings management here */}
              Vault settings management goes here.
            </Typography>
          )}
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          className={classes.initiateButton}
        >
          Initiate New Transaction
        </Button>

        <InitiateTransactionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onInitiate={handleInitiateTransaction}
        />
      </CardContent>
    </Card>
  );
};

export default VaultDetails;

// Human tasks:
// - Implement error handling for vault details fetching
// - Add loading state while vault details are being fetched
// - Implement vault settings management in the Settings tab
// - Add ability to export transaction history
// - Implement real-time updates for vault balance and status
// - Add unit tests for the VaultDetails component
// - Implement accessibility features (ARIA labels, keyboard navigation for tabs)
// - Add internationalization support for currency and date formatting
// - Implement responsive design for better mobile viewing experience
// - Add tooltips or info icons to explain complex vault details
// - Implement a confirmation dialog for initiating transactions
// - Add support for viewing and managing vault permissions
// - Implement a feature to generate and display vault analytics or reports