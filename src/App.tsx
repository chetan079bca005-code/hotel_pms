/**
 * Hotel PMS - Main Application Component
 * Handles routing, theme, and global providers
 */

import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Layouts - from layouts folder
import AppLayout from '@/layouts/AppLayout';
import SuperAdminLayout from '@/layouts/SuperAdminLayout';
import MobileMenuLayout from '@/layouts/MobileMenuLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Restaurant/Menu Module Pages
import PublicMenuPage from '@/pages/menu/PublicMenuPage';
import CartPage from '@/pages/menu/CartPage';
import MenuOrdersPage from '@/pages/menu/OrdersPage';
import OrderTrackingPage from '@/pages/menu/OrderTrackingPage';

// Hotel Admin Panel Pages
import AdminDashboardPage from '@/pages/dashboards/DashboardPage';
import AdminBookingsPage from '@/pages/bookings/BookingsPage';
import AdminRoomsPage from '@/pages/rooms/RoomsPage';
import AdminMenuPage from '@/pages/menu/AdminMenuPage';
import AdminOrdersPage from '@/pages/orders/OrdersPage';
import AdminGuestsPage from '@/pages/guests/GuestsPage';
import AdminHousekeepingPage from '@/pages/housekeeping/HousekeepingPage';
import AdminReportsPage from '@/pages/reports/ReportsPage';
import AdminReviewsPage from '@/pages/reviews/ReviewsPage';
import AdminSettingsPage from '@/pages/settings/SettingsPage';
import AdminPaymentsPage from '@/pages/payments/PaymentsPage';

// Super Admin Pages
import SuperAdminOverviewPage from '@/pages/superadmin/OverviewPage';
import SuperAdminHotelsPage from '@/pages/superadmin/HotelsPage';
import SuperAdminAdminsPage from '@/pages/superadmin/AdminsPage';
import SuperAdminSubscriptionsPage from '@/pages/superadmin/SubscriptionsPage';
import SuperAdminAnalyticsPage from '@/pages/superadmin/AnalyticsPage';
import SuperAdminSystemPage from '@/pages/superadmin/SystemPage';
import SuperAdminLogsPage from '@/pages/superadmin/LogsPage';

// Error Pages
import NotFoundPage from '@/pages/NotFoundPage';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="hotel-pms-theme">
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes>
          {/* ==================== Auth Routes ==================== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ==================== Mobile Menu/Restaurant Routes ==================== */}
          <Route element={<MobileMenuLayout />}>
            {/* QR Code Menu Access */}
            <Route path="/menu" element={<PublicMenuPage />} />
            <Route path="/menu/:hotelId" element={<PublicMenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MenuOrdersPage />} />
            <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
          </Route>

          {/* ==================== Hotel Admin Routes ==================== */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="rooms" element={<AdminRoomsPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="guests" element={<AdminGuestsPage />} />
            <Route path="housekeeping" element={<AdminHousekeepingPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* ==================== Super Admin Routes ==================== */}
          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SuperAdminOverviewPage />} />
            <Route path="overview" element={<SuperAdminOverviewPage />} />
            <Route path="hotels" element={<SuperAdminHotelsPage />} />
            <Route path="admins" element={<SuperAdminAdminsPage />} />
            <Route path="subscriptions" element={<SuperAdminSubscriptionsPage />} />
            <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
            <Route path="system" element={<SuperAdminSystemPage />} />
            <Route path="logs" element={<SuperAdminLogsPage />} />
          </Route>

          {/* ==================== Error Routes ==================== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Global Toast Notifications */}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
