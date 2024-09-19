import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import { formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  dateField: {
    marginRight: theme.spacing(2),
  },
  quickSelectButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// Create DateRangeSelector functional component
const DateRangeSelector = ({ initialStartDate, initialEndDate, onDateRangeChange }) => {
  // Create state for startDate and endDate
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Implement handleStartDateChange function
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // Implement handleEndDateChange function
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Implement handleApply function to call onDateRangeChange with selected dates
  const handleApply = () => {
    onDateRangeChange(startDate, endDate);
  };

  // Implement handleQuickSelect function for predefined date ranges
  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  // Use useStyles to get CSS classes
  const classes = useStyles();

  // Return JSX with Grid layout for date range controls
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Select Date Range</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {/* Render DatePicker component for start date */}
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(props) => <TextField {...props} className={classes.dateField} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {/* Render DatePicker component for end date */}
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(props) => <TextField {...props} className={classes.dateField} />}
        />
      </Grid>
      <Grid item xs={12}>
        {/* Render quick select buttons for predefined date ranges */}
        <Button
          variant="outlined"
          className={classes.quickSelectButton}
          onClick={() => handleQuickSelect(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outlined"
          className={classes.quickSelectButton}
          onClick={() => handleQuickSelect(30)}
        >
          Last 30 Days
        </Button>
      </Grid>
      <Grid item xs={12}>
        {/* Render Apply button to confirm date range selection */}
        <Button variant="contained" color="primary" onClick={handleApply}>
          Apply
        </Button>
      </Grid>
    </Grid>
  );
};

export default DateRangeSelector;

// Human tasks:
// TODO: Implement date range validation (ensure start date is before end date)
// TODO: Add ability to type in dates manually in addition to using the date picker
// TODO: Implement more quick select options (e.g., this month, last month, year to date)
// TODO: Add a clear button to reset the date range
// TODO: Implement a custom date range input for more flexibility
// TODO: Add unit tests for the DateRangeSelector component
// TODO: Implement accessibility features (ARIA labels, keyboard navigation for date pickers)
// TODO: Add internationalization support for date formatting and labels
// TODO: Implement responsive design for better mobile experience
// TODO: Add tooltips to explain date range options
// TODO: Optimize performance for handling frequent date changes
// TODO: Implement visual feedback for invalid date ranges
// TODO: Add support for different date formats based on user preferences or locale