/**
 * Hotel PMS - Services Index
 * Central export file for all API services
 */

export { default as api } from './api';
export { default as authService } from './authService';
export { default as hotelService } from './hotelService';
export { default as bookingService } from './bookingService';
export { default as menuService } from './menuService';
export { default as orderService } from './orderService';
export { default as paymentService } from './paymentService';
export { default as dataService } from './dataService';

// Re-export data service components for convenience
export * from './dataService';

// Re-export individual methods for convenience
export * from './api';
