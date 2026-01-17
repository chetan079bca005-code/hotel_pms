/**
 * Hotel PMS - Data Service
 * Abstraction layer for data fetching
 * Automatically uses mock data when USE_MOCK_DATA is true
 *
 * INSTRUCTIONS FOR SWITCHING TO REAL API:
 * 1. Set USE_MOCK_DATA to false in mockData.ts
 * 2. Implement the real API calls in each method
 * 3. The service will automatically use real API calls
 */

import {
  USE_MOCK_DATA,
  mockHotels,
  mockHotelPerformance,
  mockAdmins,
  mockUsers,
  mockPropertyPerformance,
  mockMonthlyTrends,
  mockRevenueByCategory,
  mockGuestDemographics,
  mockTopSegments,
  mockRecentActivities,
  mockAuditLogs,
  mockSubscriptions,
  mockSystemMetrics,
  mockServiceStatus,
  availableHotels,
  calculatePortfolioStats,
  getHotelById,
  getAdminById,
  getUserByEmail,
  validateCredentials,
  type Hotel,
  type HotelPerformance,
  type Admin,
  type MockUser,
  type PropertyPerformance,
  type MonthlyTrend,
  type RevenueCategory,
  type GuestDemographic,
  type TopSegment,
  type RecentActivity,
  type AuditLog,
  type Subscription,
  type SystemMetrics,
  type ServiceStatus,
  type HotelStatus,
  type SubscriptionTier,
  type AdminRole,
  type AdminStatus,
} from '@/data/mockData';
import api from './api';

// ============================================================================
// HOTEL SERVICE
// ============================================================================

export const hotelDataService = {
  /**
   * Get all hotels
   */
  async getHotels(): Promise<Hotel[]> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await delay(300);
      return mockHotels;
    }
    // Real API call
    const response = await api.get<{ data: Hotel[] }>('/hotels');
    return response.data.data;
  },

  /**
   * Get hotel by ID
   */
  async getHotelById(id: string): Promise<Hotel | null> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return getHotelById(id) || null;
    }
    const response = await api.get<{ data: Hotel }>(`/hotels/${id}`);
    return response.data.data;
  },

  /**
   * Get hotel performance data
   */
  async getHotelPerformance(): Promise<HotelPerformance[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockHotelPerformance;
    }
    const response = await api.get<{ data: HotelPerformance[] }>('/hotels/performance');
    return response.data.data;
  },

  /**
   * Get portfolio statistics
   */
  async getPortfolioStats() {
    if (USE_MOCK_DATA) {
      await delay(200);
      return calculatePortfolioStats();
    }
    const response = await api.get<{ data: ReturnType<typeof calculatePortfolioStats> }>('/hotels/stats');
    return response.data.data;
  },

  /**
   * Create new hotel
   */
  async createHotel(data: Partial<Hotel>): Promise<Hotel> {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newHotel: Hotel = {
        id: `hotel-${Date.now()}`,
        name: data.name || 'New Hotel',
        slug: data.slug || 'new-hotel',
        description: data.description || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || 'Nepal',
        phone: data.phone || '',
        email: data.email || '',
        status: 'pending',
        subscription: 'basic',
        roomCount: 0,
        staffCount: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      };
      return newHotel;
    }
    const response = await api.post<{ data: Hotel }>('/hotels', data);
    return response.data.data;
  },

  /**
   * Update hotel
   */
  async updateHotel(id: string, data: Partial<Hotel>): Promise<Hotel> {
    if (USE_MOCK_DATA) {
      await delay(400);
      const hotel = getHotelById(id);
      if (!hotel) throw new Error('Hotel not found');
      return { ...hotel, ...data };
    }
    const response = await api.put<{ data: Hotel }>(`/hotels/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete hotel
   */
  async deleteHotel(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return;
    }
    await api.delete(`/hotels/${id}`);
  },
};

// ============================================================================
// ADMIN SERVICE
// ============================================================================

export const adminDataService = {
  /**
   * Get all admins
   */
  async getAdmins(): Promise<Admin[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockAdmins;
    }
    const response = await api.get<{ data: Admin[] }>('/admins');
    return response.data.data;
  },

  /**
   * Get admin by ID
   */
  async getAdminById(id: string): Promise<Admin | null> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return getAdminById(id) || null;
    }
    const response = await api.get<{ data: Admin }>(`/admins/${id}`);
    return response.data.data;
  },

  /**
   * Get available hotels for admin assignment
   */
  async getAvailableHotels(): Promise<string[]> {
    if (USE_MOCK_DATA) {
      await delay(100);
      return availableHotels;
    }
    const response = await api.get<{ data: string[] }>('/admins/available-hotels');
    return response.data.data;
  },

  /**
   * Create new admin
   */
  async createAdmin(data: Partial<Admin>): Promise<Admin> {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newAdmin: Admin = {
        id: `admin-${Date.now()}`,
        name: data.name || 'New Admin',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'staff',
        status: 'pending',
        hotels: data.hotels || [],
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      };
      return newAdmin;
    }
    const response = await api.post<{ data: Admin }>('/admins', data);
    return response.data.data;
  },

  /**
   * Update admin
   */
  async updateAdmin(id: string, data: Partial<Admin>): Promise<Admin> {
    if (USE_MOCK_DATA) {
      await delay(400);
      const admin = getAdminById(id);
      if (!admin) throw new Error('Admin not found');
      return { ...admin, ...data };
    }
    const response = await api.put<{ data: Admin }>(`/admins/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete admin
   */
  async deleteAdmin(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return;
    }
    await api.delete(`/admins/${id}`);
  },

  /**
   * Suspend admin
   */
  async suspendAdmin(id: string): Promise<Admin> {
    if (USE_MOCK_DATA) {
      await delay(300);
      const admin = getAdminById(id);
      if (!admin) throw new Error('Admin not found');
      return { ...admin, status: 'suspended' };
    }
    const response = await api.post<{ data: Admin }>(`/admins/${id}/suspend`);
    return response.data.data;
  },

  /**
   * Activate admin
   */
  async activateAdmin(id: string): Promise<Admin> {
    if (USE_MOCK_DATA) {
      await delay(300);
      const admin = getAdminById(id);
      if (!admin) throw new Error('Admin not found');
      return { ...admin, status: 'active' };
    }
    const response = await api.post<{ data: Admin }>(`/admins/${id}/activate`);
    return response.data.data;
  },

  /**
   * Reset admin password
   */
  async resetPassword(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.post(`/admins/${id}/reset-password`);
  },
};

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export const analyticsDataService = {
  /**
   * Get property performance
   */
  async getPropertyPerformance(): Promise<PropertyPerformance[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockPropertyPerformance;
    }
    const response = await api.get<{ data: PropertyPerformance[] }>('/analytics/performance');
    return response.data.data;
  },

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockMonthlyTrends;
    }
    const response = await api.get<{ data: MonthlyTrend[] }>('/analytics/trends');
    return response.data.data;
  },

  /**
   * Get revenue by category
   */
  async getRevenueByCategory(): Promise<RevenueCategory[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockRevenueByCategory;
    }
    const response = await api.get<{ data: RevenueCategory[] }>('/analytics/revenue');
    return response.data.data;
  },

  /**
   * Get guest demographics
   */
  async getGuestDemographics(): Promise<GuestDemographic[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockGuestDemographics;
    }
    const response = await api.get<{ data: GuestDemographic[] }>('/analytics/demographics');
    return response.data.data;
  },

  /**
   * Get top segments
   */
  async getTopSegments(): Promise<TopSegment[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockTopSegments;
    }
    const response = await api.get<{ data: TopSegment[] }>('/analytics/segments');
    return response.data.data;
  },
};

// ============================================================================
// ACTIVITY SERVICE
// ============================================================================

export const activityDataService = {
  /**
   * Get recent activities
   */
  async getRecentActivities(): Promise<RecentActivity[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockRecentActivities;
    }
    const response = await api.get<{ data: RecentActivity[] }>('/activities/recent');
    return response.data.data;
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(): Promise<AuditLog[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockAuditLogs;
    }
    const response = await api.get<{ data: AuditLog[] }>('/activities/logs');
    return response.data.data;
  },
};

// ============================================================================
// SUBSCRIPTION SERVICE
// ============================================================================

export const subscriptionDataService = {
  /**
   * Get all subscriptions
   */
  async getSubscriptions(): Promise<Subscription[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockSubscriptions;
    }
    const response = await api.get<{ data: Subscription[] }>('/subscriptions');
    return response.data.data;
  },

  /**
   * Alias for getSubscriptions (for easier use)
   */
  async getAll(): Promise<Subscription[]> {
    return this.getSubscriptions();
  },

  /**
   * Get subscription by hotel ID
   */
  async getSubscriptionByHotel(hotelId: string): Promise<Subscription | null> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockSubscriptions.find(s => s.hotelId === hotelId) || null;
    }
    const response = await api.get<{ data: Subscription }>(`/subscriptions/hotel/${hotelId}`);
    return response.data.data;
  },

  /**
   * Update subscription
   */
  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    if (USE_MOCK_DATA) {
      await delay(400);
      const subscription = mockSubscriptions.find(s => s.id === id);
      if (!subscription) throw new Error('Subscription not found');
      return { ...subscription, ...data };
    }
    const response = await api.put<{ data: Subscription }>(`/subscriptions/${id}`, data);
    return response.data.data;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return;
    }
    await api.post(`/subscriptions/${id}/cancel`);
  },
};

// ============================================================================
// SYSTEM SERVICE
// ============================================================================

export const systemDataService = {
  /**
   * Get system metrics
   */
  async getMetrics(): Promise<SystemMetrics> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockSystemMetrics;
    }
    const response = await api.get<{ data: SystemMetrics }>('/system/metrics');
    return response.data.data;
  },

  /**
   * Get service status
   */
  async getServiceStatus(): Promise<ServiceStatus[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockServiceStatus;
    }
    const response = await api.get<{ data: ServiceStatus[] }>('/system/services');
    return response.data.data;
  },
};

// ============================================================================
// AUTH DATA SERVICE (for mock login)
// ============================================================================

export const authDataService = {
  /**
   * Get user by email
   */
  getUserByEmail(email: string): MockUser | undefined {
    return getUserByEmail(email);
  },

  /**
   * Validate credentials
   */
  validateCredentials(email: string, password: string): MockUser | null {
    return validateCredentials(email, password);
  },

  /**
   * Get all mock users
   */
  getMockUsers(): MockUser[] {
    return mockUsers;
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORT ALL SERVICES
// ============================================================================

export const dataService = {
  hotels: hotelDataService,
  admins: adminDataService,
  analytics: analyticsDataService,
  activities: activityDataService,
  subscriptions: subscriptionDataService,
  system: systemDataService,
  auth: authDataService,
};

export default dataService;
