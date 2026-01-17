/**
 * Hotel PMS - Store Index
 * Central export file for all Zustand stores
 */

export { useAuthStore } from './authStore';
export { default as useCartStore } from './cartStore';
export { useBookingStore } from './bookingStore';

// Export types
export type { BookingStep } from './bookingStore';
