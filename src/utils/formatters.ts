/**
 * Hotel PMS - Formatters
 * Utility functions for formatting data for display
 */

import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import { DATE_DISPLAY_FORMAT, DATETIME_DISPLAY_FORMAT, DEFAULT_CURRENCY, CURRENCY_SYMBOL } from './constants';

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: NPR)
 * @param showSymbol - Whether to show currency symbol
 */
export const formatCurrency = (
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  showSymbol: boolean = true
): string => {
  const formatter = new Intl.NumberFormat('en-NP', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  
  if (showSymbol) {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${formatted}`;
  }
  
  return formatted;
};

/**
 * Get currency symbol from code
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    NPR: 'Rs.',
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£',
  };
  
  return symbols[currency] || currency;
};

/**
 * Format a date string
 * @param date - Date string or Date object
 * @param formatStr - Format pattern (default: DATE_DISPLAY_FORMAT)
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatStr: string = DATE_DISPLAY_FORMAT
): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '-';
    
    return format(dateObj, formatStr);
  } catch {
    return '-';
  }
};

/**
 * Format a datetime string
 * @param datetime - Datetime string or Date object
 */
export const formatDateTime = (
  datetime: string | Date | null | undefined
): string => {
  return formatDate(datetime, DATETIME_DISPLAY_FORMAT);
};

/**
 * Format time only
 * @param time - Time string (HH:mm) or Date object
 */
export const formatTime = (time: string | Date | null | undefined): string => {
  if (!time) return '-';
  
  if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
    // Already in HH:mm format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  return formatDate(time, 'h:mm a');
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '-';
    
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch {
    return '-';
  }
};

/**
 * Format a phone number
 * @param phone - Phone number string
 */
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '-';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Nepal numbers (10 digits)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format with country code
  if (cleaned.length === 13 && cleaned.startsWith('977')) {
    return `+977 ${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  return phone;
};

/**
 * Format a percentage
 * @param value - The value (0-100 or 0-1)
 * @param isDecimal - Whether value is already a decimal (0-1)
 */
export const formatPercentage = (
  value: number,
  isDecimal: boolean = false,
  decimals: number = 1
): string => {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param bytes - File size in bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format duration in minutes to human readable
 * @param minutes - Duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
};

/**
 * Format number of nights
 * @param nights - Number of nights
 */
export const formatNights = (nights: number): string => {
  return nights === 1 ? '1 night' : `${nights} nights`;
};

/**
 * Format guest count
 * @param adults - Number of adults
 * @param children - Number of children
 */
export const formatGuestCount = (adults: number, children: number = 0): string => {
  const parts: string[] = [];
  
  if (adults > 0) {
    parts.push(adults === 1 ? '1 adult' : `${adults} adults`);
  }
  
  if (children > 0) {
    parts.push(children === 1 ? '1 child' : `${children} children`);
  }
  
  return parts.join(', ') || '0 guests';
};

/**
 * Format room count
 * @param count - Number of rooms
 */
export const formatRoomCount = (count: number): string => {
  return count === 1 ? '1 room' : `${count} rooms`;
};

/**
 * Format booking number with prefix
 * @param number - Booking number
 */
export const formatBookingNumber = (number: string): string => {
  return `#${number}`;
};

/**
 * Format order number with prefix
 * @param number - Order number
 */
export const formatOrderNumber = (number: string): string => {
  return `#${number}`;
};

/**
 * Format rating (e.g., 4.5 out of 5)
 * @param rating - Rating value
 * @param maxRating - Maximum rating (default: 5)
 */
export const formatRating = (rating: number, maxRating: number = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`;
};

/**
 * Format name (capitalize first letter of each word)
 * @param name - Name string
 */
export const formatName = (name: string | null | undefined): string => {
  if (!name) return '-';
  
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format address to single line
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
} | null | undefined): string => {
  if (!address) return '-';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ') || '-';
};

/**
 * Format status for display (convert kebab-case to Title Case)
 */
export const formatStatus = (status: string): string => {
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
