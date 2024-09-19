import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, IconButton, Popover, FormControl, InputLabel, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FilterList, Sort } from '@material-ui/icons';
import { debounce } from 'lodash';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
    marginRight: theme.spacing(2),
  },
  popover: {
    padding: theme.spacing(2),
  },
}));

// Create FilterSort functional component
const FilterSort = ({ filterOptions, sortOptions, onFilterChange, onSortChange }) => {
  // Destructure props to get filterOptions, sortOptions, onFilterChange, and onSortChange
  const classes = useStyles();

  // Create state for filter values, sort field, sort order, and popover anchor
  const [filterValues, setFilterValues] = useState({});
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);

  // Implement useEffect to call onFilterChange and onSortChange when values change
  useEffect(() => {
    onFilterChange(filterValues);
  }, [filterValues, onFilterChange]);

  useEffect(() => {
    onSortChange({ field: sortField, order: sortOrder });
  }, [sortField, sortOrder, onSortChange]);

  // Implement handleFilterChange function with debounce
  const handleFilterChange = debounce((field, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [field]: value }));
  }, 300);

  // Implement handleSortChange function
  const handleSortChange = (event, type) => {
    if (type === 'field') {
      setSortField(event.target.value);
    } else if (type === 'order') {
      setSortOrder(event.target.value);
    }
  };

  // Implement handlePopoverOpen and handlePopoverClose functions
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Return JSX with Grid layout for filter and sort controls
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} sm={6}>
        {/* Render TextField for search/filter input */}
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={1} alignItems="center">
          {/* Render IconButton to open filter popover */}
          <Grid item>
            <IconButton onClick={handlePopoverOpen}>
              <FilterList />
            </IconButton>
          </Grid>
          {/* Render Select components for sort field and sort order */}
          <Grid item>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => handleSortChange(e, 'field')}
                label="Sort By"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => handleSortChange(e, 'order')}
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      {/* Render Popover with additional filter options */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={classes.popover}>
          {filterOptions.map((option) => (
            <TextField
              key={option.field}
              label={option.label}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => handleFilterChange(option.field, e.target.value)}
            />
          ))}
        </div>
      </Popover>
    </Grid>
  );
};

export default FilterSort;

// Human tasks:
// - Add unit tests for the FilterSort component
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for filter and sort labels
// - Implement responsive design for better mobile experience
// - Add tooltips to explain filter and sort options
// - Optimize performance for handling large numbers of filter and sort options
// - Implement visual indicators for active filters and sorts
// - Add support for custom filter types (e.g., dropdown, checkbox, radio button)