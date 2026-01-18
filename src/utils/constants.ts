/**
 * Hotel PMS - Constants
 * Application-wide constants and configuration values
 */

// Application info
export const APP_NAME = 'Hotel PMS';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Comprehensive Hotel Property Management System';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_DISPLAY_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
export const DATETIME_DISPLAY_FORMAT = 'MMM dd, yyyy HH:mm';

// Currency
export const DEFAULT_CURRENCY = 'NPR';
export const CURRENCY_SYMBOL = 'Rs.';
export const CURRENCIES = [
  { code: 'NPR', symbol: 'Rs.', name: 'Nepalese Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

// Tax and charges
export const TAX_RATE = 0.13; // 13% VAT
export const SERVICE_CHARGE_RATE = 0.10; // 10% service charge

// Booking constraints
export const MAX_GUESTS_PER_ROOM = 4;
export const MAX_ROOMS_PER_BOOKING = 10;
export const MIN_ADVANCE_BOOKING_DAYS = 0;
export const MAX_ADVANCE_BOOKING_DAYS = 365;
export const DEFAULT_CHECK_IN_TIME = '14:00';
export const DEFAULT_CHECK_OUT_TIME = '11:00';

// Room status colors
export const ROOM_STATUS_COLORS = {
  available: '#10b981', // green
  occupied: '#ef4444', // red
  reserved: '#002366', // brand navy blue
  maintenance: '#D4AF37', // brand gold
  cleaning: '#8b5cf6', // purple
};

// Order status colors
export const ORDER_STATUS_COLORS = {
  pending: '#D4AF37', // brand gold
  confirmed: '#002366', // brand navy blue
  preparing: '#8b5cf6',
  ready: '#10b981',
  delivered: '#6b7280',
  cancelled: '#ef4444',
};

// Booking status colors
export const BOOKING_STATUS_COLORS = {
  pending: '#D4AF37', // brand gold
  confirmed: '#002366', // brand navy blue
  'checked-in': '#10b981',
  'checked-out': '#6b7280',
  cancelled: '#ef4444',
  'no-show': '#dc2626',
};

// Star ratings
export const STAR_RATINGS = [1, 2, 3, 4, 5];

// Amenity icons mapping
export const AMENITY_ICONS: Record<string, string> = {
  wifi: 'Wifi',
  parking: 'Car',
  pool: 'Waves',
  gym: 'Dumbbell',
  spa: 'Sparkles',
  restaurant: 'UtensilsCrossed',
  bar: 'Wine',
  'room-service': 'BellRing',
  laundry: 'Shirt',
  ac: 'Snowflake',
  tv: 'Tv',
  minibar: 'Beer',
  safe: 'Lock',
  balcony: 'Mountain',
  'sea-view': 'Anchor',
  'mountain-view': 'Mountain',
};

// Trip types
export const TRIP_TYPES = [
  { value: 'business', label: 'Business' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'family', label: 'Family' },
  { value: 'couple', label: 'Couple' },
  { value: 'solo', label: 'Solo' },
  { value: 'group', label: 'Group' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: 'Banknote' },
  { value: 'card', label: 'Card', icon: 'CreditCard' },
  { value: 'esewa', label: 'eSewa', icon: 'Wallet' },
  { value: 'khalti', label: 'Khalti', icon: 'Wallet' },
  { value: 'ime-pay', label: 'IME Pay', icon: 'Wallet' },
  { value: 'bank-transfer', label: 'Bank Transfer', icon: 'Building' },
];

// Order types
export const ORDER_TYPES = [
  { value: 'room-service', label: 'Room Service' },
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway' },
];

// Departments
export const DEPARTMENTS = [
  { value: 'management', label: 'Management' },
  { value: 'front-office', label: 'Front Office' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
];

// Staff roles
export const STAFF_ROLES = [
  { value: 'general-manager', label: 'General Manager' },
  { value: 'front-desk-manager', label: 'Front Desk Manager' },
  { value: 'front-desk-agent', label: 'Front Desk Agent' },
  { value: 'housekeeping-manager', label: 'Housekeeping Manager' },
  { value: 'housekeeper', label: 'Housekeeper' },
  { value: 'restaurant-manager', label: 'Restaurant Manager' },
  { value: 'chef', label: 'Chef' },
  { value: 'kitchen-staff', label: 'Kitchen Staff' },
  { value: 'waiter', label: 'Waiter/Waitress' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
];

// Allergens
export const ALLERGENS = [
  { value: 'milk', label: 'Milk', icon: '🥛' },
  { value: 'eggs', label: 'Eggs', icon: '🥚' },
  { value: 'fish', label: 'Fish', icon: '🐟' },
  { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { value: 'tree-nuts', label: 'Tree Nuts', icon: '🥜' },
  { value: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { value: 'wheat', label: 'Wheat', icon: '🌾' },
  { value: 'soybeans', label: 'Soybeans', icon: '🫘' },
  { value: 'sesame', label: 'Sesame', icon: '🌰' },
];

// Spice levels
export const SPICE_LEVELS = [
  { value: 1, label: 'Mild', icon: '🌶️' },
  { value: 2, label: 'Medium', icon: '🌶️🌶️' },
  { value: 3, label: 'Hot', icon: '🌶️🌶️🌶️' },
];

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_BOOKING: 'new-booking',
  BOOKING_CANCELLED: 'booking-cancelled',
  CHECK_IN: 'check-in',
  CHECK_OUT: 'check-out',
  NEW_ORDER: 'new-order',
  ORDER_READY: 'order-ready',
  NEW_REVIEW: 'new-review',
  PAYMENT_RECEIVED: 'payment-received',
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'hotel-pms-theme',
  LANGUAGE: 'language',
  CART: 'hotel-pms-cart',
  BOOKING: 'hotel-pms-booking',
};

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  SEARCH: '/search',
  HOTEL_DETAIL: '/hotel/:hotelId',
  BOOKING: '/booking/:hotelId/:roomId',
  PAYMENT: '/payment/:bookingId',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Guest
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  
  // Menu
  MENU: '/menu/:hotelId',
  CART: '/menu/:hotelId/cart',
  ORDER_TRACKING: '/menu/:hotelId/order/:orderId/tracking',
  
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ROOMS: '/admin/rooms',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_GUESTS: '/admin/guests',
  ADMIN_MENU: '/admin/menu',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_KITCHEN: '/admin/kitchen',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Super Admin
  SUPERADMIN_DASHBOARD: '/superadmin',
  SUPERADMIN_HOTELS: '/superadmin/hotels',
  SUPERADMIN_USERS: '/superadmin/users',
  SUPERADMIN_CONFIG: '/superadmin/config',
};
