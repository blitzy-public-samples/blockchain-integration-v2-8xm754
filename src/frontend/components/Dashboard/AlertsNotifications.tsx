import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorOutline, CheckCircleOutline, InfoOutlined } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  successIcon: {
    color: theme.palette.success.main,
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
}));

// Create AlertsNotifications functional component
const AlertsNotifications: React.FC = () => {
  // Use useSelector to get alerts and notifications data from Redux store
  const notifications = useSelector((state: RootState) => state.notifications.items);

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Determine appropriate icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorOutline className={classes.errorIcon} />;
      case 'success':
        return <CheckCircleOutline className={classes.successIcon} />;
      default:
        return <InfoOutlined className={classes.infoIcon} />;
    }
  };

  // Return JSX with Card and List layout
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Alerts & Notifications
        </Typography>
        {notifications.length > 0 ? (
          <List>
            {/* Map through alerts and notifications and render each as a ListItem */}
            {notifications.map((notification) => (
              <ListItem key={notification.id} className={classes.listItem}>
                <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={formatDate(notification.timestamp)}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          // Implement conditional rendering if there are no notifications
          <Typography variant="body2">No new notifications</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsNotifications;

// Human tasks:
// TODO: Implement click handler to mark notifications as read
// TODO: Add functionality to dismiss or delete notifications
// TODO: Implement real-time updates for new notifications
// TODO: Add pagination or 'load more' functionality for large numbers of notifications
// TODO: Implement filtering options (e.g., by type, date range)
// TODO: Add unit tests for the AlertsNotifications component
// TODO: Implement error handling for data fetching
// TODO: Add loading state while notifications are being fetched
// TODO: Implement accessibility features (ARIA labels, keyboard navigation)
// TODO: Add sound or visual indicators for new, high-priority notifications
// TODO: Implement a notification center with more detailed view and management options
// TODO: Add support for rich content in notifications (e.g., links, action buttons)
// TODO: Implement push notifications for critical alerts when the dashboard is not open