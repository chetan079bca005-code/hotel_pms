/**
 * Hotel PMS - Admin Dashboard Page Structure
 * Conditionally renders the dashboard based on user role
 * 
 * NOTE: Superadmin users should use /superadmin routes, not /admin routes.
 * If a superadmin navigates here, redirect them to the proper dashboard.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ManagerDashboard from './ManagerDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import HousekeepingDashboard from './HousekeepingDashboard';
import RevenueDashboard from './RevenueDashboard';
import KitchenDashboard from './KitchenDashboard';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  // If user is not ready yet, return a simple loading or empty state
  // ideally ProtectedRoute handles this, but for extra safety:
  if (!user) return null;

  const role = user.role;

  switch (role) {
    // Superadmin should use /superadmin routes - redirect them
    case 'superadmin':
      return <Navigate to="/superadmin" replace />;
    
    // Admin and Manager see the Manager Dashboard
    case 'admin':
    case 'manager':
      return <ManagerDashboard />;
    
    // Role-specific dashboards
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'housekeeping':
      return <HousekeepingDashboard />;
    case 'revenue':
      return <RevenueDashboard />;
    case 'kitchen':
      return <KitchenDashboard />;
    
    // Default fallback for staff or unknown roles
    case 'staff':
    default:
      return <ManagerDashboard />;
  }
}
