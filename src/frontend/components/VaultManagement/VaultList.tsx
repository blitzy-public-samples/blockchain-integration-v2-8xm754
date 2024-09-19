import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchVaults, selectVault } from '../../store/actions/vaultActions';
import { formatCurrency, truncateAddress } from '../../utils/helpers';
import VaultStatus from '../common/VaultStatus';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  filterInput: {
    marginBottom: theme.spacing(2),
  },
  truncate: {
    maxWidth: 150,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const VaultList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const vaults = useSelector((state: RootState) => state.vaults.list);
  const [filter, setFilter] = useState('');

  // Fetch vaults on component mount
  useEffect(() => {
    dispatch(fetchVaults());
  }, [dispatch]);

  // Handle filter input change
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  // Handle vault selection
  const handleVaultSelect = (vaultId: string) => {
    dispatch(selectVault(vaultId));
  };

  // Filter vaults based on input
  const filteredVaults = vaults.filter((vault) =>
    vault.name.toLowerCase().includes(filter.toLowerCase()) ||
    vault.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <TextField
        className={classes.filterInput}
        label="Filter vaults"
        variant="outlined"
        fullWidth
        value={filter}
        onChange={handleFilterChange}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="vault list">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Blockchain</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVaults.map((vault) => (
              <TableRow key={vault.id}>
                <TableCell>{vault.name}</TableCell>
                <TableCell className={classes.truncate}>{truncateAddress(vault.address)}</TableCell>
                <TableCell>{formatCurrency(vault.balance, vault.currency)}</TableCell>
                <TableCell>{vault.blockchainType}</TableCell>
                <TableCell>
                  <VaultStatus status={vault.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleVaultSelect(vault.id)}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VaultList;

// Human tasks:
// - Add unit tests for the VaultList component
// - Implement error handling for vault data fetching
// - Add loading state while vaults are being fetched
// - Optimize performance for rendering large lists of vaults
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for currency and address formatting
// - Implement responsive design for better mobile viewing experience
// - Add tooltips or info icons to explain vault statuses and other details
// - Implement pagination or infinite scrolling for large numbers of vaults
// - Add sorting functionality for each column
// - Implement more advanced filtering options (e.g., by blockchain type, balance range)
// - Add ability to create new vaults directly from this list
// - Implement bulk actions for managing multiple vaults at once