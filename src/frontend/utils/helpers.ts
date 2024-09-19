import { format } from 'date-fns';
import BigNumber from 'bignumber.js';

// Format a number as a currency string
export function formatCurrency(amount: number, currency: string): string {
  // Create a new Intl.NumberFormat instance with the specified currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });

  // Format the amount using the NumberFormat instance
  return formatter.format(amount);
}

// Format a date string or timestamp into a human-readable format
export function formatDate(date: Date | number | string, formatString: string): string {
  // Convert input to a Date object if it's not already
  const dateObject = date instanceof Date ? date : new Date(date);

  // Use date-fns format function to format the date
  return format(dateObject, formatString);
}

// Truncate a blockchain address for display purposes
export function truncateAddress(address: string, startLength: number, endLength: number): string {
  // Check if the address is shorter than the combined start and end lengths
  if (address.length <= startLength + endLength) {
    return address;
  }

  // Truncate the middle part of the address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Format a number with thousands separators and specified decimal places
export function formatNumber(value: number, decimalPlaces: number): string {
  // Create a new Intl.NumberFormat instance with specified decimal places
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Format the number using the NumberFormat instance
  return formatter.format(value);
}

// Format a number as a percentage string
export function formatPercentage(value: number, decimalPlaces: number): string {
  // Create a new Intl.NumberFormat instance with percentage style and specified decimal places
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Format the number using the NumberFormat instance
  return formatter.format(value);
}

// Convert a Wei value to Ether
export function convertWeiToEther(weiValue: string | number): string {
  // Create a BigNumber instance from the Wei value
  const wei = new BigNumber(weiValue);

  // Divide the Wei value by 1e18 (Wei to Ether conversion factor)
  const ether = wei.dividedBy(new BigNumber(10).pow(18));

  // Return the result as a string
  return ether.toString();
}

// Human tasks:
// TODO: Add unit tests for each utility function
// TODO: Implement error handling for edge cases (e.g., invalid inputs)
// TODO: Add JSDoc comments for better documentation
// TODO: Consider adding more blockchain-specific utility functions
// TODO: Optimize performance for functions that might be called frequently
// TODO: Ensure all functions are pure for easier testing and predictability
// TODO: Add type definitions for better TypeScript support
// TODO: Consider implementing memoization for expensive operations
// TODO: Add support for different locales in formatting functions