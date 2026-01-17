/**
 * Hotel PMS - Centralized Mock Data
 * All mock data in one place for easy API integration later
 *
 * INSTRUCTIONS FOR SWITCHING TO REAL API:
 * 1. Set USE_MOCK_DATA to false
 * 2. Implement the actual API endpoints in services/
 * 3. The dataService will automatically use real API calls
 */

// ============================================================================
// CONFIGURATION FLAG - Set to false when connecting to real backend
// ============================================================================
export const USE_MOCK_DATA = true;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type HotelStatus = 'active' | 'maintenance' | 'inactive' | 'pending';
export type SubscriptionTier = 'basic' | 'professional' | 'enterprise';
export type AdminRole = 'superadmin' | 'hotel_admin' | 'manager' | 'staff';
export type AdminStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// ============================================================================
// HOTEL INTERFACES
// ============================================================================

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  status: HotelStatus;
  subscription: SubscriptionTier;
  roomCount: number;
  staffCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  logo?: string;
}

export interface HotelPerformance extends Hotel {
  revenue: number;
  occupancy: number;
  pendingCheckIns: number;
  pendingCheckOuts: number;
  alerts: number;
}

// ============================================================================
// ADMIN/USER INTERFACES
// ============================================================================

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: AdminStatus;
  hotels: string[];
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface MockUser {
  id: string;
  email: string;
  password: string; // For demo only - never store plain passwords in production!
  firstName: string;
  lastName: string;
  fullName: string;
  role: AdminRole | 'receptionist' | 'housekeeping' | 'kitchen' | 'revenue';
  avatar: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  hotelId?: string;
}

// ============================================================================
// ANALYTICS INTERFACES
// ============================================================================

export interface PropertyPerformance {
  name: string;
  revenue: number;
  occupancy: number;
  rating: number;
  bookings: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  bookings: number;
  occupancy: number;
}

export interface RevenueCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface GuestDemographic {
  country: string;
  guests: number;
  percentage: number;
}

export interface TopSegment {
  segment: string;
  bookings: number;
  revenue: number;
  growth: number;
}

// ============================================================================
// ACTIVITY & LOGS INTERFACES
// ============================================================================

export type LogLevel = 'info' | 'warning' | 'error' | 'success';
export type LogCategory = 'auth' | 'booking' | 'payment' | 'settings' | 'admin' | 'system';

export interface RecentActivity {
  id: string;
  type: 'booking' | 'revenue' | 'alert' | 'system';
  title: string;
  description: string;
  hotel: string;
  time: string;
  icon?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  action: string;
  description: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  hotel?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// SUBSCRIPTION INTERFACES
// ============================================================================

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
  id: string;
  hotelId: string;
  hotelName: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  amount: number;
  currency: string;
  autoRenew: boolean;
  roomLimit: number;
  roomsUsed: number;
  features: string[];
}

// ============================================================================
// SYSTEM HEALTH INTERFACES
// ============================================================================

export interface SystemMetrics {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: string;
  lastRestart: string;
  databaseSize: string;
  requestsPerMinute: number;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'degraded';
  cpu: number;
  memory: number;
}

// ============================================================================
// MOCK DATA - HOTELS
// ============================================================================

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Hotel Kathmandu',
    slug: 'grand-hotel-kathmandu',
    description: 'Premium 5-star hotel in the heart of Kathmandu offering world-class amenities.',
    address: 'Durbar Marg',
    city: 'Kathmandu',
    country: 'Nepal',
    phone: '+977-1-4411999',
    email: 'info@grandkathmandu.com',
    website: 'https://grandkathmandu.com',
    status: 'active',
    subscription: 'enterprise',
    roomCount: 45,
    staffCount: 68,
    rating: 4.7,
    reviewCount: 342,
    createdAt: '2023-01-15',
    logo: 'https://ui-avatars.com/api/?name=Grand+Hotel&background=0D8ABC&color=fff',
  },
  {
    id: '2',
    name: 'Lakeside Resort Pokhara',
    slug: 'lakeside-resort-pokhara',
    description: 'Beautiful lakeside resort with stunning views of the Annapurna range.',
    address: 'Lakeside',
    city: 'Pokhara',
    country: 'Nepal',
    phone: '+977-61-456789',
    email: 'info@lakesideresort.com',
    website: 'https://lakesideresort.com',
    status: 'active',
    subscription: 'professional',
    roomCount: 35,
    staffCount: 52,
    rating: 4.5,
    reviewCount: 218,
    createdAt: '2023-03-22',
    logo: 'https://ui-avatars.com/api/?name=Lakeside+Resort&background=2E86AB&color=fff',
  },
  {
    id: '3',
    name: 'Mountain View Hotel',
    slug: 'mountain-view-hotel',
    description: 'Cozy mountain retreat with panoramic views of the Himalayas.',
    address: 'Tower Road',
    city: 'Nagarkot',
    country: 'Nepal',
    phone: '+977-1-6680012',
    email: 'info@mountainview.com',
    status: 'active',
    subscription: 'basic',
    roomCount: 25,
    staffCount: 32,
    rating: 4.3,
    reviewCount: 156,
    createdAt: '2023-06-10',
    logo: 'https://ui-avatars.com/api/?name=Mountain+View&background=A23B72&color=fff',
  },
  {
    id: '4',
    name: 'Heritage Palace',
    slug: 'heritage-palace',
    description: 'Historic heritage hotel converted from a traditional Newari building.',
    address: 'Durbar Square',
    city: 'Bhaktapur',
    country: 'Nepal',
    phone: '+977-1-6612345',
    email: 'info@heritagepalace.com',
    status: 'maintenance',
    subscription: 'professional',
    roomCount: 20,
    staffCount: 28,
    rating: 4.6,
    reviewCount: 89,
    createdAt: '2023-08-05',
    logo: 'https://ui-avatars.com/api/?name=Heritage+Palace&background=F18F01&color=fff',
  },
  {
    id: '5',
    name: 'Chitwan Safari Lodge',
    slug: 'chitwan-safari-lodge',
    description: 'Eco-friendly lodge near Chitwan National Park for wildlife enthusiasts.',
    address: 'Sauraha',
    city: 'Chitwan',
    country: 'Nepal',
    phone: '+977-56-580123',
    email: 'booking@chitwansafari.com',
    status: 'pending',
    subscription: 'basic',
    roomCount: 15,
    staffCount: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: '2024-01-10',
    logo: 'https://ui-avatars.com/api/?name=Chitwan+Safari&background=C73E1D&color=fff',
  },
];

export const mockHotelPerformance: HotelPerformance[] = [
  {
    ...mockHotels[0],
    revenue: 2850000,
    occupancy: 85,
    pendingCheckIns: 8,
    pendingCheckOuts: 5,
    alerts: 2,
  },
  {
    ...mockHotels[1],
    revenue: 1950000,
    occupancy: 78,
    pendingCheckIns: 6,
    pendingCheckOuts: 4,
    alerts: 0,
  },
  {
    ...mockHotels[2],
    revenue: 980000,
    occupancy: 62,
    pendingCheckIns: 3,
    pendingCheckOuts: 2,
    alerts: 1,
  },
  {
    ...mockHotels[3],
    revenue: 0,
    occupancy: 0,
    pendingCheckIns: 0,
    pendingCheckOuts: 0,
    alerts: 3,
  },
];

// ============================================================================
// MOCK DATA - ADMINS & USERS
// ============================================================================

export const mockAdmins: Admin[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@namastepms.com',
    phone: '+977-9801234567',
    role: 'superadmin',
    status: 'active',
    hotels: [],
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0D8ABC&color=fff',
    lastLogin: '2024-01-20T10:30:00',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Anita Sharma',
    email: 'anita@grandhotel.com',
    phone: '+977-9802345678',
    role: 'hotel_admin',
    status: 'active',
    hotels: ['Grand Hotel Kathmandu'],
    avatar: 'https://ui-avatars.com/api/?name=Anita+Sharma&background=2E86AB&color=fff',
    lastLogin: '2024-01-20T09:15:00',
    createdAt: '2023-02-15',
  },
  {
    id: '3',
    name: 'Bikash Thapa',
    email: 'bikash@lakeside.com',
    phone: '+977-9803456789',
    role: 'hotel_admin',
    status: 'active',
    hotels: ['Lakeside Resort Pokhara'],
    avatar: 'https://ui-avatars.com/api/?name=Bikash+Thapa&background=A23B72&color=fff',
    lastLogin: '2024-01-19T14:45:00',
    createdAt: '2023-04-20',
  },
  {
    id: '4',
    name: 'Sita Rai',
    email: 'sita@grandhotel.com',
    phone: '+977-9804567890',
    role: 'manager',
    status: 'active',
    hotels: ['Grand Hotel Kathmandu'],
    avatar: 'https://ui-avatars.com/api/?name=Sita+Rai&background=F18F01&color=fff',
    lastLogin: '2024-01-18T08:00:00',
    createdAt: '2023-06-10',
  },
  {
    id: '5',
    name: 'Prakash Shrestha',
    email: 'prakash@mountainview.com',
    phone: '+977-9805678901',
    role: 'hotel_admin',
    status: 'inactive',
    hotels: ['Mountain View Hotel'],
    avatar: 'https://ui-avatars.com/api/?name=Prakash+Shrestha&background=C73E1D&color=fff',
    createdAt: '2023-08-05',
  },
  {
    id: '6',
    name: 'Maya Tamang',
    email: 'maya@heritage.com',
    phone: '+977-9806789012',
    role: 'staff',
    status: 'suspended',
    hotels: ['Heritage Palace'],
    avatar: 'https://ui-avatars.com/api/?name=Maya+Tamang&background=6B4C9A&color=fff',
    createdAt: '2023-10-01',
  },
];

// Demo users for login simulation
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'superadmin@namastepms.com',
    password: 'demo123',
    firstName: 'Super',
    lastName: 'Admin',
    fullName: 'Super Admin',
    role: 'superadmin',
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff',
    phone: '+977-9801234567',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'manager@namastepms.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'Manager',
    fullName: 'Demo Manager',
    role: 'manager',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Manager&background=2E86AB&color=fff',
    phone: '+977-9802345678',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    hotelId: '1',
  },
  {
    id: 'user-3',
    email: 'receptionist@namastepms.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'Receptionist',
    fullName: 'Demo Receptionist',
    role: 'receptionist',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Receptionist&background=A23B72&color=fff',
    phone: '+977-9803456789',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    hotelId: '1',
  },
  {
    id: 'user-4',
    email: 'housekeeping@namastepms.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'Housekeeping',
    fullName: 'Demo Housekeeping',
    role: 'housekeeping',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Housekeeping&background=F18F01&color=fff',
    phone: '+977-9804567890',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    hotelId: '1',
  },
  {
    id: 'user-5',
    email: 'kitchen@namastepms.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'Kitchen',
    fullName: 'Demo Kitchen Staff',
    role: 'kitchen',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Kitchen&background=C73E1D&color=fff',
    phone: '+977-9805678901',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    hotelId: '1',
  },
  {
    id: 'user-6',
    email: 'revenue@namastepms.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'Revenue',
    fullName: 'Demo Revenue Manager',
    role: 'revenue',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Revenue&background=6B4C9A&color=fff',
    phone: '+977-9806789012',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    hotelId: '1',
  },
];

// Available hotels for admin assignment
export const availableHotels: string[] = mockHotels.map(h => h.name);

// ============================================================================
// MOCK DATA - ANALYTICS
// ============================================================================

export const mockPropertyPerformance: PropertyPerformance[] = [
  { name: 'Grand Hotel Kathmandu', revenue: 2850000, occupancy: 85, rating: 4.7, bookings: 245 },
  { name: 'Lakeside Resort Pokhara', revenue: 1950000, occupancy: 78, rating: 4.5, bookings: 180 },
  { name: 'Mountain View Hotel', revenue: 980000, occupancy: 62, rating: 4.3, bookings: 95 },
  { name: 'Heritage Palace', revenue: 650000, occupancy: 55, rating: 4.6, bookings: 45 },
];

export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', revenue: 4500000, bookings: 420, occupancy: 68 },
  { month: 'Feb', revenue: 4800000, bookings: 445, occupancy: 72 },
  { month: 'Mar', revenue: 5200000, bookings: 485, occupancy: 75 },
  { month: 'Apr', revenue: 4900000, bookings: 460, occupancy: 73 },
  { month: 'May', revenue: 5600000, bookings: 520, occupancy: 78 },
  { month: 'Jun', revenue: 6100000, bookings: 565, occupancy: 82 },
];

export const mockRevenueByCategory: RevenueCategory[] = [
  { category: 'Room Bookings', amount: 4250000, percentage: 72 },
  { category: 'Restaurant', amount: 1150000, percentage: 20 },
  { category: 'Services', amount: 350000, percentage: 6 },
  { category: 'Other', amount: 120000, percentage: 2 },
];

export const mockGuestDemographics: GuestDemographic[] = [
  { country: 'Nepal', guests: 3200, percentage: 42 },
  { country: 'India', guests: 1850, percentage: 24 },
  { country: 'USA', guests: 950, percentage: 12 },
  { country: 'UK', guests: 680, percentage: 9 },
  { country: 'China', guests: 520, percentage: 7 },
  { country: 'Others', guests: 480, percentage: 6 },
];

export const mockTopSegments: TopSegment[] = [
  { segment: 'Business Travelers', bookings: 1250, revenue: 3500000, growth: 15 },
  { segment: 'Tourists', bookings: 980, revenue: 2200000, growth: 22 },
  { segment: 'Families', bookings: 650, revenue: 1800000, growth: 8 },
  { segment: 'Couples', bookings: 420, revenue: 950000, growth: 12 },
];

// ============================================================================
// MOCK DATA - RECENT ACTIVITIES
// ============================================================================

export const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking',
    description: 'John Doe booked Deluxe Room for 3 nights',
    hotel: 'Grand Hotel Kathmandu',
    time: '5 minutes ago',
  },
  {
    id: '2',
    type: 'revenue',
    title: 'Payment Received',
    description: 'NPR 45,000 payment for booking #1234',
    hotel: 'Lakeside Resort Pokhara',
    time: '15 minutes ago',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low Inventory Alert',
    description: 'Only 2 Standard Rooms available',
    hotel: 'Grand Hotel Kathmandu',
    time: '1 hour ago',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    hotel: 'All Properties',
    time: '2 hours ago',
  },
  {
    id: '5',
    type: 'booking',
    title: 'Booking Cancelled',
    description: 'Guest cancelled reservation #5678',
    hotel: 'Mountain View Hotel',
    time: '3 hours ago',
  },
  {
    id: '6',
    type: 'revenue',
    title: 'Refund Processed',
    description: 'NPR 12,000 refund for cancelled booking',
    hotel: 'Mountain View Hotel',
    time: '3 hours ago',
  },
];

// ============================================================================
// MOCK DATA - AUDIT LOGS
// ============================================================================

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T10:30:00',
    level: 'success',
    category: 'auth',
    action: 'user.login',
    description: 'Successful login from Kathmandu, Nepal',
    user: { name: 'Rajesh Kumar', email: 'rajesh@namastepms.com', role: 'Super Admin' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    id: '2',
    timestamp: '2024-01-20T09:45:00',
    level: 'info',
    category: 'admin',
    action: 'hotel.created',
    description: 'New hotel property added to the system',
    user: { name: 'Rajesh Kumar', email: 'rajesh@namastepms.com', role: 'Super Admin' },
    hotel: 'Chitwan Safari Lodge',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    id: '3',
    timestamp: '2024-01-19T16:20:00',
    level: 'info',
    category: 'admin',
    action: 'admin.role_changed',
    description: 'Role changed from staff to manager',
    user: { name: 'Anita Sharma', email: 'anita@grandhotel.com', role: 'Hotel Admin' },
    hotel: 'Grand Hotel Kathmandu',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    metadata: { targetUser: 'Maya Tamang', previousRole: 'staff', newRole: 'manager' },
  },
  {
    id: '4',
    timestamp: '2024-01-19T14:10:00',
    level: 'error',
    category: 'auth',
    action: 'auth.failed_login',
    description: 'Multiple failed login attempts detected',
    user: { name: 'Unknown', email: 'unknown@example.com', role: 'Unknown' },
    ipAddress: '45.33.32.156',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/120.0',
    metadata: { attempts: 5, blockedDuration: '30 minutes' },
  },
  {
    id: '5',
    timestamp: '2024-01-19T11:30:00',
    level: 'success',
    category: 'payment',
    action: 'subscription.upgraded',
    description: 'Subscription upgraded from Basic to Professional',
    user: { name: 'Rajesh Kumar', email: 'rajesh@namastepms.com', role: 'Super Admin' },
    hotel: 'Mountain View Hotel',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    metadata: { previousTier: 'basic', newTier: 'professional', amount: 59000 },
  },
  {
    id: '6',
    timestamp: '2024-01-18T15:45:00',
    level: 'warning',
    category: 'system',
    action: 'data.exported',
    description: 'Exported monthly revenue report',
    user: { name: 'Bikash Thapa', email: 'bikash@lakeside.com', role: 'Hotel Admin' },
    hotel: 'Lakeside Resort Pokhara',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    metadata: { reportType: 'revenue', period: 'January 2024', format: 'CSV' },
  },
  {
    id: '7',
    timestamp: '2024-01-18T10:00:00',
    level: 'info',
    category: 'settings',
    action: 'pricing.updated',
    description: 'Updated seasonal pricing for Deluxe rooms',
    user: { name: 'Sita Rai', email: 'sita@grandhotel.com', role: 'Manager' },
    hotel: 'Grand Hotel Kathmandu',
    ipAddress: '192.168.1.108',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15',
    metadata: { roomType: 'Deluxe', priceChange: '+15%' },
  },
  {
    id: '8',
    timestamp: '2024-01-17T09:30:00',
    level: 'warning',
    category: 'admin',
    action: 'account.suspended',
    description: 'Account suspended due to policy violation',
    user: { name: 'Anita Sharma', email: 'anita@grandhotel.com', role: 'Hotel Admin' },
    hotel: 'Heritage Palace',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    metadata: { targetUser: 'Maya Tamang', reason: 'Policy violation', duration: 'Indefinite' },
  },
  {
    id: '9',
    timestamp: '2024-01-16T14:22:00',
    level: 'success',
    category: 'booking',
    action: 'booking.created',
    description: 'New booking created for 3 nights',
    user: { name: 'Receptionist Demo', email: 'receptionist@namastepms.com', role: 'Receptionist' },
    hotel: 'Grand Hotel Kathmandu',
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    metadata: { bookingId: 'BK-2024-001', guestName: 'John Smith', roomType: 'Deluxe', nights: 3 },
  },
  {
    id: '10',
    timestamp: '2024-01-16T12:00:00',
    level: 'error',
    category: 'payment',
    action: 'payment.failed',
    description: 'Payment gateway error - transaction declined',
    user: { name: 'System', email: 'system@namastepms.com', role: 'System' },
    hotel: 'Lakeside Resort Pokhara',
    ipAddress: '127.0.0.1',
    userAgent: 'NamastePMS-Backend/1.0',
    metadata: { transactionId: 'TXN-12345', amount: 45000, errorCode: 'GATEWAY_TIMEOUT' },
  },
];

// ============================================================================
// MOCK DATA - SUBSCRIPTIONS
// ============================================================================

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    hotelId: '1',
    hotelName: 'Grand Hotel Kathmandu',
    tier: 'enterprise',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyPrice: 99000,
    amount: 99000,
    currency: 'NPR',
    autoRenew: true,
    roomLimit: 100,
    roomsUsed: 45,
    features: ['Unlimited rooms', 'Priority support', 'API access', 'Custom branding', 'Advanced analytics'],
  },
  {
    id: 'sub-2',
    hotelId: '2',
    hotelName: 'Lakeside Resort Pokhara',
    tier: 'professional',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    monthlyPrice: 59000,
    amount: 59000,
    currency: 'NPR',
    autoRenew: true,
    roomLimit: 50,
    roomsUsed: 35,
    features: ['Up to 50 rooms', 'Email support', 'Basic analytics', 'QR menu'],
  },
  {
    id: 'sub-3',
    hotelId: '3',
    hotelName: 'Mountain View Hotel',
    tier: 'basic',
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    monthlyPrice: 29000,
    amount: 29000,
    currency: 'NPR',
    autoRenew: false,
    roomLimit: 25,
    roomsUsed: 25,
    features: ['Up to 25 rooms', 'Email support', 'Basic reports'],
  },
  {
    id: 'sub-4',
    hotelId: '4',
    hotelName: 'Heritage Palace',
    tier: 'professional',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    monthlyPrice: 59000,
    amount: 59000,
    currency: 'NPR',
    autoRenew: true,
    roomLimit: 50,
    roomsUsed: 20,
    features: ['Up to 50 rooms', 'Email support', 'Basic analytics', 'QR menu'],
  },
  {
    id: 'sub-5',
    hotelId: '5',
    hotelName: 'Chitwan Safari Lodge',
    tier: 'basic',
    status: 'trial',
    startDate: '2024-01-10',
    endDate: '2024-02-09',
    monthlyPrice: 0,
    amount: 0,
    currency: 'NPR',
    autoRenew: false,
    roomLimit: 25,
    roomsUsed: 15,
    features: ['Up to 25 rooms', 'Email support', 'Basic reports', '30-day trial'],
  },
];

// ============================================================================
// MOCK DATA - SYSTEM HEALTH
// ============================================================================

export const mockSystemMetrics: SystemMetrics = {
  status: 'healthy',
  uptime: '99.9%',
  lastRestart: '2024-01-15T08:00:00',
  databaseSize: '2.5 GB',
  requestsPerMinute: 1250,
};

export const mockServiceStatus: ServiceStatus[] = [
  { name: 'API Server', status: 'running', cpu: 25, memory: 45 },
  { name: 'Database', status: 'running', cpu: 35, memory: 60 },
  { name: 'Cache Server', status: 'running', cpu: 10, memory: 30 },
  { name: 'Queue Worker', status: 'running', cpu: 15, memory: 25 },
  { name: 'Email Service', status: 'running', cpu: 5, memory: 15 },
  { name: 'Backup Service', status: 'running', cpu: 8, memory: 20 },
];

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

export const subscriptionTierConfig: Record<SubscriptionTier, { label: string; color: string; price: number }> = {
  basic: { label: 'Basic', color: 'bg-gray-100 text-gray-800', price: 29000 },
  professional: { label: 'Professional', color: 'bg-blue-100 text-blue-800', price: 59000 },
  enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-800', price: 99000 },
};

export const hotelStatusConfig: Record<HotelStatus, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'success' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'outline' },
};

export const adminRoleConfig: Record<AdminRole, { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
  hotel_admin: { label: 'Hotel Admin', color: 'bg-blue-100 text-blue-800' },
  manager: { label: 'Manager', color: 'bg-green-100 text-green-800' },
  staff: { label: 'Staff', color: 'bg-gray-100 text-gray-800' },
};

export const adminStatusConfig: Record<AdminStatus, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  suspended: { label: 'Suspended', variant: 'destructive' },
  pending: { label: 'Pending', variant: 'warning' },
};

export const logLevelConfig: Record<LogLevel, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive'; icon: any }> = {
  info: { label: 'Info', variant: 'default', icon: null },
  warning: { label: 'Warning', variant: 'warning', icon: null },
  error: { label: 'Error', variant: 'destructive', icon: null },
  success: { label: 'Success', variant: 'success', icon: null },
};

export const logCategoryConfig: Record<LogCategory, { label: string; icon: any; color: string }> = {
  auth: { label: 'Authentication', icon: null, color: 'text-purple-600' },
  booking: { label: 'Booking', icon: null, color: 'text-blue-600' },
  payment: { label: 'Payment', icon: null, color: 'text-green-600' },
  settings: { label: 'Settings', icon: null, color: 'text-gray-600' },
  admin: { label: 'Admin', icon: null, color: 'text-yellow-600' },
  system: { label: 'System', icon: null, color: 'text-red-600' },
};

export const subscriptionStatusConfig: Record<SubscriptionStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' }> = {
  active: { label: 'Active', variant: 'success' },
  trial: { label: 'Trial', variant: 'warning' },
  expired: { label: 'Expired', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get hotel by ID
 */
export function getHotelById(id: string): Hotel | undefined {
  return mockHotels.find(h => h.id === id);
}

/**
 * Get admin by ID
 */
export function getAdminById(id: string): Admin | undefined {
  return mockAdmins.find(a => a.id === id);
}

/**
 * Get user by email (for login)
 */
export function getUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Validate user credentials (for mock login)
 */
export function validateCredentials(email: string, password: string): MockUser | null {
  const user = getUserByEmail(email);
  if (user && user.password === password && user.isActive) {
    return user;
  }
  return null;
}

/**
 * Calculate portfolio stats
 */
export function calculatePortfolioStats() {
  const activeHotels = mockHotels.filter(h => h.status === 'active').length;
  const totalRooms = mockHotels.reduce((sum, h) => sum + h.roomCount, 0);
  const totalStaff = mockHotels.reduce((sum, h) => sum + h.staffCount, 0);
  const totalRevenue = mockHotelPerformance.reduce((sum, h) => sum + h.revenue, 0);
  const avgOccupancy = Math.round(
    mockHotelPerformance.filter(h => h.occupancy > 0).reduce((sum, h) => sum + h.occupancy, 0) /
    mockHotelPerformance.filter(h => h.occupancy > 0).length
  );
  const totalAlerts = mockHotelPerformance.reduce((sum, h) => sum + h.alerts, 0);
  
  return {
    totalHotels: mockHotels.length,
    activeHotels,
    totalRooms,
    totalStaff,
    totalRevenue,
    avgOccupancy,
    totalAlerts,
    avgRating: 4.5,
  };
}

// ============================================================================
// EXPORT ALL MOCK DATA AS SINGLE OBJECT (for easy import)
// ============================================================================

export const mockData = {
  // Configuration
  USE_MOCK_DATA,
  
  // Hotels
  hotels: mockHotels,
  hotelPerformance: mockHotelPerformance,
  
  // Admins & Users
  admins: mockAdmins,
  users: mockUsers,
  availableHotels,
  
  // Analytics
  propertyPerformance: mockPropertyPerformance,
  monthlyTrends: mockMonthlyTrends,
  revenueByCategory: mockRevenueByCategory,
  guestDemographics: mockGuestDemographics,
  topSegments: mockTopSegments,
  
  // Activities & Logs
  recentActivities: mockRecentActivities,
  auditLogs: mockAuditLogs,
  
  // Subscriptions
  subscriptions: mockSubscriptions,
  
  // System
  systemMetrics: mockSystemMetrics,
  serviceStatus: mockServiceStatus,
  
  // Config
  subscriptionTierConfig,
  hotelStatusConfig,
  adminRoleConfig,
  adminStatusConfig,
  
  // Helpers
  getHotelById,
  getAdminById,
  getUserByEmail,
  validateCredentials,
  calculatePortfolioStats,
};

export default mockData;
