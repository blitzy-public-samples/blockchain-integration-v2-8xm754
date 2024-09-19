import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { requestSignature } from '../../store/actions/signatureActions';
import { validateAddress, validateAmount } from '../../utils/validators';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorText: {
    color: theme.palette.error.main,
  },
  successText: {
    color: theme.palette.success.main,
  },
}));

interface SignatureRequestFormProps {
  vaultId: string;
}

const SignatureRequestForm: React.FC<SignatureRequestFormProps> = ({ vaultId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const blockchainType = useSelector((state: RootState) => state.vaults.vaults[vaultId]?.blockchainType);

  // Create state for form fields
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Create state for form validation errors
  const [errors, setErrors] = useState({
    recipientAddress: '',
    amount: '',
  });

  // Create state for form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Implement handleInputChange function for form fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'recipientAddress') {
      setRecipientAddress(value);
    } else if (name === 'amount') {
      setAmount(value);
    }
  };

  // Implement validateForm function
  const validateForm = () => {
    const newErrors = {
      recipientAddress: validateAddress(recipientAddress, blockchainType) ? '' : 'Invalid address',
      amount: validateAmount(amount) ? '' : 'Invalid amount',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Implement handleSubmit function
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      try {
        await dispatch(requestSignature(vaultId, recipientAddress, amount));
        setSubmitStatus('success');
        // Reset form fields
        setRecipientAddress('');
        setAmount('');
      } catch (error) {
        setSubmitStatus('error');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="recipientAddress"
            variant="outlined"
            required
            fullWidth
            id="recipientAddress"
            label="Recipient Address"
            value={recipientAddress}
            onChange={handleInputChange}
            error={!!errors.recipientAddress}
            helperText={errors.recipientAddress}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="amount"
            variant="outlined"
            required
            fullWidth
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={handleInputChange}
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Request Signature'}
      </Button>
      {submitStatus === 'success' && (
        <Typography className={classes.successText}>
          Signature request submitted successfully!
        </Typography>
      )}
      {submitStatus === 'error' && (
        <Typography className={classes.errorText}>
          Error submitting signature request. Please try again.
        </Typography>
      )}
    </form>
  );
};

export default SignatureRequestForm;

// Human tasks:
// - Add unit tests for the SignatureRequestForm component
// - Implement error handling for signature request submission failures
// - Add support for multiple signature requests in a single form
// - Implement accessibility features (ARIA labels, keyboard navigation)
// - Add internationalization support for form labels and error messages
// - Implement responsive design for better mobile experience
// - Add tooltips to explain form fields and requirements
// - Implement a feature to suggest recipient addresses from transaction history
// - Implement more robust form validation (e.g., check balance sufficiency)
// - Add support for additional transaction fields based on blockchain type
// - Implement a confirmation step before submitting the signature request
// - Add ability to save and load draft signature requests
// - Implement a fee estimation feature based on the transaction details