/**
 * Hotel PMS - useAuth Hook
 * Authentication hook with React Query integration
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { toastSuccess, toastError } from '@/hooks/use-toast';
import type { LoginCredentials, RegisterData, UpdateProfile, ChangePassword, PasswordResetRequest, PasswordResetConfirm } from '@/types';

/**
 * useAuth hook provides authentication functionality
 */
export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get auth state from store
  const {
    user,
    accessToken,
    status,
    error,
    setUser,
    logout: storeLogout,
    clearError,
  } = useAuthStore();

  // Derived state
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  /**
   * Fetch current user profile
   */
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Update user in store when fetched
  React.useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => useAuthStore.getState().login(credentials),
    onSuccess: () => {
      // Get the updated user from store
      const user = useAuthStore.getState().user;
      toastSuccess('Welcome back!', `Logged in as ${user?.fullName || 'User'}`);

      // Redirect based on role
      if (user) {
        switch (user.role) {
          case 'superadmin':
            navigate('/superadmin');
            break;
          case 'admin':
          case 'manager':
          case 'receptionist':
          case 'housekeeping':
          case 'kitchen':
          case 'revenue':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }
    },
    onError: (error: Error) => {
      toastError('Login failed', error.message || 'Invalid credentials');
    },
  });

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => useAuthStore.getState().register(data),
    onSuccess: () => {
      // Get the updated user from store
      const user = useAuthStore.getState().user;
      toastSuccess('Account created!', 'Welcome to Namaste PMS');

      // Redirect based on role - SAME AS LOGIN because we auto-login on register
      if (user) {
        switch (user.role) {
          case 'superadmin':
            navigate('/superadmin');
            break;
          case 'admin':
          case 'manager':
          case 'receptionist':
          case 'housekeeping':
          case 'kitchen':
          case 'revenue':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }
    },
    onError: (error: Error) => {
      toastError('Registration failed', error.message || 'Please try again');
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await useAuthStore.getState().logout();
    },
    onSettled: () => {
      queryClient.clear();
      navigate('/login');
      toastSuccess('Logged out', 'See you next time!');
    },
  });

  /**
   * Forgot password mutation
   */
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: PasswordResetRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toastSuccess('Email sent', 'Check your inbox for reset instructions');
    },
    onError: (error: Error) => {
      toastError('Failed to send email', error.message || 'Please try again');
    },
  });

  /**
   * Reset password mutation
   */
  const resetPasswordMutation = useMutation({
    mutationFn: (data: PasswordResetConfirm) =>
      authService.resetPassword(data),
    onSuccess: () => {
      toastSuccess('Password reset', 'You can now login with your new password');
      navigate('/login');
    },
    onError: (error: Error) => {
      toastError('Reset failed', error.message || 'Please try again');
    },
  });

  /**
   * Change password mutation
   */
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePassword) =>
      authService.changePassword(data),
    onSuccess: () => {
      toastSuccess('Password changed', 'Your password has been updated');
    },
    onError: (error: Error) => {
      toastError('Failed to change password', error.message || 'Please try again');
    },
  });

  /**
   * Update profile mutation
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfile) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['currentUser'], updatedUser);
      toastSuccess('Profile updated', 'Your changes have been saved');
    },
    onError: (error: Error) => {
      toastError('Update failed', error.message || 'Please try again');
    },
  });

  return {
    // State
    user: currentUser || user,
    isAuthenticated,
    isLoading: isLoading || isLoadingUser,
    error,
    clearError,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    refetchUser,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}

/**
 * Hook to check if user has required role
 */
export function useRequireRole(allowedRoles: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      navigate('/unauthorized');
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, navigate]);

  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    isLoading,
  };
}
