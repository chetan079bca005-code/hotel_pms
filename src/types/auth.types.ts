/**
 * Hotel PMS - Authentication Types
 * Types for user authentication and authorization
 */

import { BaseEntity } from './common.types';

// User roles in the system
export type UserRole = 'guest' | 'staff' | 'manager' | 'admin' | 'superadmin' | 'receptionist' | 'housekeeping' | 'kitchen' | 'revenue';

// Authentication status
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

// User entity
export interface User extends BaseEntity {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
  hotelId?: string; // For admin/staff users
}

// User preferences
export interface UserPreferences {
  language: 'en' | 'ne';
  currency: string;
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  bookingUpdates: boolean;
  promotions: boolean;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: UserRole; // For demo/simulation purposes
}

// Registration data
export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  acceptTerms: boolean;
}

// Login response
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirmation
export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

// Change password
export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Update profile
export interface UpdateProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

// Auth state for Zustand store
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateProfile: (data: UpdateProfile) => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// Permission types
export type Permission =
  | 'rooms:read'
  | 'rooms:write'
  | 'bookings:read'
  | 'bookings:write'
  | 'guests:read'
  | 'guests:write'
  | 'menu:read'
  | 'menu:write'
  | 'orders:read'
  | 'orders:write'
  | 'staff:read'
  | 'staff:write'
  | 'reports:read'
  | 'settings:read'
  | 'settings:write';

// Role permissions mapping
export const RolePermissions: Record<UserRole, Permission[]> = {
  guest: [],
  staff: ['rooms:read', 'bookings:read', 'guests:read', 'menu:read', 'orders:read', 'orders:write'],
  manager: ['rooms:read', 'rooms:write', 'bookings:read', 'bookings:write', 'guests:read', 'guests:write', 'menu:read', 'menu:write', 'orders:read', 'orders:write', 'staff:read', 'reports:read'],
  admin: ['rooms:read', 'rooms:write', 'bookings:read', 'bookings:write', 'guests:read', 'guests:write', 'menu:read', 'menu:write', 'orders:read', 'orders:write', 'staff:read', 'staff:write', 'reports:read', 'settings:read', 'settings:write'],
  superadmin: ['rooms:read', 'rooms:write', 'bookings:read', 'bookings:write', 'guests:read', 'guests:write', 'menu:read', 'menu:write', 'orders:read', 'orders:write', 'staff:read', 'staff:write', 'reports:read', 'settings:read', 'settings:write'],
  receptionist: ['rooms:read', 'bookings:read', 'bookings:write', 'guests:read', 'guests:write'],
  housekeeping: ['rooms:read', 'rooms:write'],
  kitchen: ['orders:read', 'orders:write', 'menu:read'],
  revenue: ['reports:read', 'bookings:read', 'rooms:read'],
};
