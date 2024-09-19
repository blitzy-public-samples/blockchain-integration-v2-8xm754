import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import { generateCustomReport } from '../../store/actions/reportActions';
import { formatDate } from '../../utils/helpers';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
  datePickerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  generateButton: {
    marginTop: theme.spacing(2),
  },
  chartContainer: {
    marginTop: theme.spacing(4),
  },
}));

const CustomReportGenerator: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Create state for report configuration
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [chartType, setChartType] = useState<string>('line');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Implement handleMetricChange function
  const handleMetricChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const metric = event.target.name;
    setSelectedMetrics(prev =>
      event.target.checked
        ? [...prev, metric]
        : prev.filter(m => m !== metric)
    );
  };

  // Implement handleDateRangeChange function
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // Implement handleChartTypeChange function
  const handleChartTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChartType(event.target.value as string);
  };

  // Implement handleGenerateReport function
  const handleGenerateReport = async () => {
    if (selectedMetrics.length === 0) {
      setError('Please select at least one metric');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reportData = await dispatch(generateCustomReport({
        metrics: selectedMetrics,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        chartType
      }));
      setGeneratedReport(reportData);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the chart based on the selected type
  const renderChart = () => {
    if (!generatedReport) return null;

    const chartProps = {
      data: generatedReport.data,
      options: generatedReport.options,
    };

    switch (chartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Custom Report Generator
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <Typography variant="subtitle1">Select Metrics:</Typography>
              <FormControlLabel
                control={<Checkbox checked={selectedMetrics.includes('transactions')} onChange={handleMetricChange} name="transactions" />}
                label="Transactions"
              />
              <FormControlLabel
                control={<Checkbox checked={selectedMetrics.includes('gasUsed')} onChange={handleMetricChange} name="gasUsed" />}
                label="Gas Used"
              />
              <FormControlLabel
                control={<Checkbox checked={selectedMetrics.includes('blockTime')} onChange={handleMetricChange} name="blockTime" />}
                label="Block Time"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} className={classes.datePickerWrapper}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(props) => <TextField {...props} />}
              className={classes.formControl}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(props) => <TextField {...props} />}
              className={classes.formControl}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel>Chart Type</InputLabel>
              <Select value={chartType} onChange={handleChartTypeChange}>
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={isLoading}
              className={classes.generateButton}
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}
        {generatedReport && (
          <div className={classes.chartContainer}>
            <Typography variant="h6" gutterBottom>
              Generated Report
            </Typography>
            {renderChart()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomReportGenerator;

// Human tasks:
// - Implement form validation to ensure at least one metric is selected
// - Add preview functionality to show a sample of the report before generation
// - Implement ability to save report configurations for future use
// - Add option to schedule recurring report generation
// - Implement export functionality for generated reports (PDF, CSV)
// - Add unit tests for the CustomReportGenerator component
// - Implement error handling for report generation failures
// - Add loading state while the report is being generated
// - Optimize performance for handling large datasets in generated reports
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for date formatting and metric names
// - Implement responsive design for better mobile experience
// - Add tooltips to explain each metric and chart type
// - Implement a feature to compare multiple metrics in a single chart
// - Add support for more advanced chart types (e.g., stacked bar, scatter plot)