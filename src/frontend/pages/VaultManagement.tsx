import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchVaults, createVault } from '../store/actions/vaultActions';
import VaultList from '../components/VaultManagement/VaultList';
import VaultDetails from '../components/VaultManagement/VaultDetails';
import CreateVaultForm from '../components/VaultManagement/CreateVaultForm';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  createButton: {
    marginBottom: theme.spacing(2),
  },
}));

const VaultManagement: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Use useSelector to get vaults data from Redux store
  const vaults = useSelector((state: RootState) => state.vaults.vaults);
  
  // Create state for selected vault and create vault dialog open status
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch vaults on component mount
  useEffect(() => {
    dispatch(fetchVaults());
  }, [dispatch]);

  // Handle vault selection
  const handleVaultSelect = (vaultId: string) => {
    setSelectedVault(vaultId);
  };

  // Handle opening and closing of create vault dialog
  const handleCreateVaultOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateVaultClose = () => {
    setCreateDialogOpen(false);
  };

  // Handle create vault action
  const handleCreateVault = (vaultData: any) => {
    dispatch(createVault(vaultData));
    handleCreateVaultClose();
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Vault Management
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleCreateVaultOpen}
        className={classes.createButton}
      >
        Create New Vault
      </Button>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <VaultList vaults={vaults} onVaultSelect={handleVaultSelect} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedVault && (
            <VaultDetails vaultId={selectedVault} />
          )}
        </Grid>
      </Grid>
      
      <Dialog open={createDialogOpen} onClose={handleCreateVaultClose}>
        <DialogTitle>Create New Vault</DialogTitle>
        <DialogContent>
          <CreateVaultForm onSubmit={handleCreateVault} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateVaultClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VaultManagement;

// Human tasks:
// - Add unit tests for the VaultManagement component
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for text and data formatting
// - Optimize performance for handling large numbers of vaults
// - Implement analytics tracking for vault management actions
// - Add tooltips or help text to explain vault management features
// - Implement a tour or onboarding flow for new users
// - Add support for bulk actions on multiple vaults
// - Implement responsive design for better mobile experience
// - Implement error handling for vault fetching and creation
// - Add loading states for vault list and details
// - Implement pagination or infinite scrolling for large numbers of vaults
// - Add search and filter functionality for vaults
// - Implement vault deletion with confirmation dialog