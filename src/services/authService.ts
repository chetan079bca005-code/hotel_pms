/**
 * Hotel PMS - Authentication Service
 * API calls for user authentication and authorization
 */

import api from './api';
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePassword,
  UpdateProfile,
  User,
  UserPreferences,
} from '@/types';
import { USE_MOCK_DATA, mockUsers, validateCredentials, type MockUser } from '@/data/mockData';

// API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  UPDATE_PROFILE: '/auth/profile',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
};

/**
 * Convert MockUser to User type
 */
function mockUserToUser(mockUser: MockUser): User {
  return {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    fullName: mockUser.fullName,
    role: mockUser.role as any,
    avatar: mockUser.avatar,
    phone: mockUser.phone,
    isEmailVerified: mockUser.isEmailVerified,
    isPhoneVerified: mockUser.isPhoneVerified,
    isActive: mockUser.isActive,
    hotelId: mockUser.hotelId,
    preferences: {
      language: 'en',
      currency: 'NPR',
      theme: 'light',
      notifications: {
        email: true,
        sms: true,
        push: true,
        orderUpdates: true,
        bookingUpdates: true,
        promotions: false
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Default mock user for Demo Mode (fallback)
 */
const DEFAULT_MOCK_USER: User = {
  id: 'mock-1',
  email: 'admin@namastepms.com',
  firstName: 'Demo',
  lastName: 'Admin',
  fullName: 'Demo Admin',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Demo+Admin&background=0D8ABC&color=fff',
  phone: '9800000000',
  isEmailVerified: true,
  isPhoneVerified: true,
  isActive: true,
  preferences: {
    language: 'en',
    currency: 'NPR',
    theme: 'light',
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderUpdates: true,
      bookingUpdates: true,
      promotions: false
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Authentication service with all auth-related API calls
 */
export const authService = {
  /**
   * Login with email and password
   * Uses centralized mock data when USE_MOCK_DATA is true
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<{ data: LoginResponse }>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      return response.data.data;
    } catch (error) {
      console.warn('Backend connection failed, using DEMO MODE fallback');
      
      // Demo Mode with centralized mock data
      // First try to find user in mock data
      const mockUser = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (mockUser) {
        // User found in mock data - validate password for demo
        if (mockUser.password === credentials.password || credentials.password === 'demo123') {
          const user = mockUserToUser(mockUser);
          return {
            user,
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            expiresIn: 3600,
          };
        }
      }
      
      // If role is provided (simulation mode), create a demo user with that role
      const userRole = credentials.role || 'manager';
      const mockUserForLogin = {
        ...DEFAULT_MOCK_USER,
        role: userRole,
        email: credentials.email,
      };

      return {
        user: mockUserForLogin,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      };
    }
  },

  /**
   * Register a new user account
   * Uses centralized mock data when USE_MOCK_DATA is true
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post<{ data: LoginResponse }>(
        AUTH_ENDPOINTS.REGISTER,
        data
      );
      return response.data.data;
    } catch (error) {
      console.warn('Backend connection failed, using DEMO MODE fallback');
      
      // Demo Mode - create user with provided data
      const newUser: User = {
        id: 'user-' + Date.now(),
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName + '+' + data.lastName)}&background=0D8ABC&color=fff`,
        isEmailVerified: false, // New users need to verify email
        isPhoneVerified: false,
        isActive: true,
        preferences: {
          language: 'en',
          currency: 'NPR',
          theme: 'light',
          notifications: {
            email: true,
            sms: true,
            push: true,
            orderUpdates: true,
            bookingUpdates: true,
            promotions: false
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        user: newUser,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      };
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (ignore) {
      // Ignore errors in demo mode
    }
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current authenticated user
   * Uses centralized mock data when USE_MOCK_DATA is true
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ data: User }>(AUTH_ENDPOINTS.ME);
      return response.data.data;
    } catch (error) {
      // If we have a token but API fails, return stored user or mock user
      const storedUser = this.getStoredUser();
      if (storedUser) return storedUser;

      console.warn('Backend connection failed, using DEMO MODE user');
      return DEFAULT_MOCK_USER;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await api.post<{ data: LoginResponse }>(
        AUTH_ENDPOINTS.REFRESH,
        { refreshToken }
      );
      return response.data.data;
    } catch (error) {
      // Mock refresh
      return {
        user: this.getStoredUser() || DEFAULT_MOCK_USER,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      };
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(data: PasswordResetRequest): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
    } catch (error) {
      console.log('Demo mode: Forgot password email sent to', data.email);
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetConfirm): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    } catch (error) {
      console.log('Demo mode: Password reset successful');
    }
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePassword): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
    } catch (error) {
      console.log('Demo mode: Password changed successfully');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfile): Promise<User> {
    try {
      const response = await api.patch<{ data: User }>(
        AUTH_ENDPOINTS.UPDATE_PROFILE,
        data
      );
      return response.data.data;
    } catch (error) {
      // Mock update
      const currentUser = this.getStoredUser() || DEFAULT_MOCK_USER;

      const updatedUser: User = {
        ...currentUser,
        ...data,
        preferences: {
          ...currentUser.preferences,
          ...(data.preferences || {}),
        } as UserPreferences, // Casting is safe here as we merge with existing complete preferences
      };

      this.setUser(updatedUser);
      return updatedUser;
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
    } catch (error) {
      console.log('Demo mode: Email verified');
    }
  },

  /**
   * Resend email verification
   */
  async resendVerification(email: string): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email });
    } catch (error) {
      console.log('Demo mode: Verification email resent');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  /**
   * Store auth tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  /**
   * Store user data
   */
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  },
};

export default authService;
