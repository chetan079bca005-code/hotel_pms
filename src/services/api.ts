/**
 * Hotel PMS - API Configuration
 * Axios instance setup with interceptors for authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API base URL - will be configured from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header for i18n
    const language = localStorage.getItem('language') || 'en';
    if (config.headers) {
      config.headers['Accept-Language'] = language;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Redirect to login page
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = getErrorMessage(error);

    // You can add toast notifications here
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

/**
 * Extract error message from axios error
 */
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as { message?: string; errors?: Record<string, string[]> };

    if (data.message) {
      return data.message;
    }

    if (data.errors) {
      // Return first validation error
      const firstError = Object.values(data.errors)[0];
      if (firstError && firstError.length > 0) {
        return firstError[0];
      }
    }

    // Default status-based messages
    switch (error.response.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection. Is the backend server running on port 8000?';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
}

export default api;

// Export helper methods for common HTTP methods
export const apiGet = <T>(url: string, params?: Record<string, unknown>) =>
  api.get<T>(url, { params });

export const apiPost = <T>(url: string, data?: unknown) =>
  api.post<T>(url, data);

export const apiPut = <T>(url: string, data?: unknown) =>
  api.put<T>(url, data);

export const apiPatch = <T>(url: string, data?: unknown) =>
  api.patch<T>(url, data);

export const apiDelete = <T>(url: string) =>
  api.delete<T>(url);

// File upload helper
export const apiUpload = <T>(url: string, formData: FormData, onProgress?: (progress: number) => void) =>
  api.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
