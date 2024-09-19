import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckCircle, Error, Sync } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { subscribeToTransactionUpdates } from '../../services/websocket';
import { formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  noUpdates: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

// Create RealTimeStatusUpdates functional component
const RealTimeStatusUpdates: React.FC = () => {
  // Use useSelector to get monitored transactions from Redux store
  const monitoredTransactions = useSelector((state: RootState) => state.transactions.monitored);

  // Create state for status updates
  const [statusUpdates, setStatusUpdates] = useState<Array<{
    id: string;
    status: string;
    timestamp: number;
  }>>([]);

  // Implement useEffect to subscribe to transaction updates
  useEffect(() => {
    const unsubscribe = subscribeToTransactionUpdates(handleStatusUpdate);
    return () => {
      unsubscribe();
    };
  }, []);

  // Implement handleStatusUpdate function to process incoming updates
  const handleStatusUpdate = (update: { id: string; status: string; timestamp: number }) => {
    setStatusUpdates((prevUpdates) => [update, ...prevUpdates].slice(0, 50)); // Keep last 50 updates
  };

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Return JSX with Paper and List layout
  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Real-Time Status Updates
      </Typography>
      {statusUpdates.length > 0 ? (
        <List>
          {/* Map through status updates and render each as a ListItem */}
          {statusUpdates.map((update) => (
            <ListItem key={`${update.id}-${update.timestamp}`} className={classes.listItem}>
              {/* Render appropriate icon based on transaction status */}
              <ListItemIcon className={classes.icon}>
                {update.status === 'completed' && <CheckCircle color="primary" />}
                {update.status === 'failed' && <Error color="error" />}
                {update.status === 'pending' && <Sync color="action" />}
              </ListItemIcon>
              {/* Display transaction ID, status, and timestamp for each update */}
              <ListItemText
                primary={`Transaction ${update.id}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {update.status}
                    </Typography>
                    {` - ${formatDate(update.timestamp)}`}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        // Implement conditional rendering for when there are no updates
        <Typography variant="body2" className={classes.noUpdates}>
          No status updates available.
        </Typography>
      )}
    </Paper>
  );
};

export default RealTimeStatusUpdates;

// Human tasks:
// TODO: Implement sound notifications for important status changes
// TODO: Add ability to filter updates by transaction status or ID
// TODO: Implement a 'clear all' or 'mark as read' functionality
// TODO: Add pagination or virtual scrolling for large numbers of updates
// TODO: Implement click handler to navigate to detailed transaction view
// TODO: Add unit tests for the RealTimeStatusUpdates component
// TODO: Implement error handling for WebSocket connection failures
// TODO: Add reconnection logic for WebSocket disconnections
// TODO: Optimize performance for handling large volumes of real-time updates
// TODO: Implement accessibility features (ARIA live regions for screen readers)
// TODO: Add internationalization support for status messages and timestamps
// TODO: Implement responsive design for better mobile viewing experience
// TODO: Add ability to customize notification preferences (e.g., which status changes to show)