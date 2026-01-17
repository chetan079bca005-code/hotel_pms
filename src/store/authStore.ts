/**
 * Hotel PMS - Auth Store
 * Zustand store for authentication state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services';
import {
  User,
  AuthStatus,
  LoginCredentials,
  RegisterData,
  UpdateProfile,
} from '@/types';

// Auth store state interface
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;
  isInitialized: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: UpdateProfile) => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

/**
 * Auth store with persistence
 * Manages user authentication state across the application
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      error: null,
      isInitialized: false,

      /**
       * Initialize auth state on app load
       * Checks for existing session and validates token
       */
      initialize: async () => {
        const { accessToken, refreshToken } = get();

        if (!accessToken) {
          set({ status: 'unauthenticated', isInitialized: true });
          return;
        }

        try {
          set({ status: 'loading' });

          // Try to get current user with existing token
          const user = await authService.getCurrentUser();

          set({
            user,
            status: 'authenticated',
            isInitialized: true,
          });
        } catch (error) {
          // Token might be expired, try refresh
          if (refreshToken) {
            try {
              const response = await authService.refreshToken(refreshToken);

              set({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                status: 'authenticated',
                isInitialized: true,
              });
            } catch {
              // Refresh failed, clear session
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                status: 'unauthenticated',
                isInitialized: true,
              });
            }
          } else {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              status: 'unauthenticated',
              isInitialized: true,
            });
          }
        }
      },

      /**
       * Login with email and password
       */
      login: async (credentials: LoginCredentials) => {
        try {
          set({ status: 'loading', error: null });

          const response = await authService.login(credentials);

          // Store tokens & User
          authService.setTokens(response.accessToken, response.refreshToken);
          authService.setUser(response.user);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            status: 'authenticated',
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : 'Login failed. Please check your credentials.';

          set({
            status: 'unauthenticated',
            error: errorMessage,
          });

          throw error;
        }
      },

      /**
       * Register a new user account
       */
      register: async (data: RegisterData) => {
        try {
          set({ status: 'loading', error: null });

          const response = await authService.register(data);

          // Store tokens & User
          authService.setTokens(response.accessToken, response.refreshToken);
          authService.setUser(response.user);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            status: 'authenticated',
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.';

          set({
            status: 'unauthenticated',
            error: errorMessage,
          });

          throw error;
        }
      },

      /**
       * Logout current user
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Ignore logout API errors
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: 'unauthenticated',
            error: null,
          });
        }
      },

      /**
       * Refresh authentication session
       */
      refreshSession: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(refreshToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // Refresh failed, logout user
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: 'unauthenticated',
          });

          throw error;
        }
      },

      /**
       * Update user profile
       */
      updateProfile: async (data: UpdateProfile) => {
        try {
          const updatedUser = await authService.updateProfile(data);

          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },

      /**
       * Set user directly (for external updates)
       */
      setUser: (user: User | null) => {
        set({ user });
      },

      /**
       * Clear any auth errors
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Check if user has a specific permission
       */
      hasPermission: (permission: string): boolean => {
        const { user } = get();

        if (!user) return false;

        // Super admin has all permissions
        if (user.role === 'superadmin') return true;

        // Check role-based permissions
        const rolePermissions: Record<string, string[]> = {
          admin: [
            'rooms:read', 'rooms:write',
            'bookings:read', 'bookings:write',
            'guests:read', 'guests:write',
            'menu:read', 'menu:write',
            'orders:read', 'orders:write',
            'staff:read', 'staff:write',
            'reports:read',
            'settings:read', 'settings:write',
          ],
          manager: [
            'rooms:read', 'rooms:write',
            'bookings:read', 'bookings:write',
            'guests:read', 'guests:write',
            'menu:read', 'menu:write',
            'orders:read', 'orders:write',
            'staff:read',
            'reports:read',
          ],
          staff: [
            'rooms:read',
            'bookings:read',
            'guests:read',
            'menu:read',
            'orders:read', 'orders:write',
          ],
          receptionist: [
            'rooms:read', 'rooms:write',
            'bookings:read', 'bookings:write',
            'guests:read', 'guests:write',
            'orders:read',
            'reports:read',
            'payments:read',
          ],
          housekeeping: [
            'rooms:read', 'rooms:write',
            'tasks:read', 'tasks:write',
          ],
          kitchen: [
            'menu:read',
            'orders:read', 'orders:write',
          ],
          revenue: [
            'bookings:read',
            'payments:read', 'payments:write',
            'reports:read', 'reports:write',
          ],
          guest: [],
        };

        const permissions = rolePermissions[user.role] || [];
        return permissions.includes(permission);
      },
    }),
    {
      name: 'hotel-pms-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
