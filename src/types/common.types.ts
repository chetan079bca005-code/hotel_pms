/**
 * Hotel PMS - Common Types
 * Shared types used across the application
 */

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Date range for filters
export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

// Address type
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

// Contact info
export interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone?: string;
}

// Image type
export interface Image {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// Language options
export type Language = 'en' | 'ne';

// Currency
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

// Base entity with timestamps
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Select option type
export interface SelectOption {
  value: string;
  label: string;
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// Filter state
export interface FilterState {
  search: string;
  status?: Status;
  dateRange?: DateRange;
  sortBy?: string;
  sortDirection?: SortDirection;
}

// Notification type
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// WebSocket event types
export type WebSocketEventType = 
  | 'order:new'
  | 'order:updated'
  | 'order:cancelled'
  | 'booking:new'
  | 'booking:updated'
  | 'booking:cancelled'
  | 'notification:new';

export interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
}
