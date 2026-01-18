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

// Rooms
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning';

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  roomCount: number;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  type: string;
  floor: number;
  capacity: number;
  price: number;
  status: RoomStatus;
  isActive: boolean;
  amenities: string[];
  image: string;
  lastCleaned: string;
  currentGuest?: string;
  checkOut?: string;
}

// Bookings
export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';

export interface Booking {
  id: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  status: BookingStatus;
  paymentStatus: 'paid' | 'partial' | 'pending';
  source: 'direct' | 'website' | 'ota';
  createdAt: string;
}

// Guests
export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  membershipTier: MembershipTier;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string;
  notes?: string;
  isVIP: boolean;
  createdAt: string;
  avatar?: string;
}

// Orders
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'served' | 'cancelled';
export type DeliveryType = 'room' | 'table' | 'takeaway';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  reference: string;
  guestName: string;
  guestPhone?: string;
  roomNumber?: string;
  tableNumber?: string;
  location: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  paymentMethod: string;
  isPaid: boolean;
  notes?: string;
  createdAt: string;
}

// Payments
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'esewa' | 'khalti' | 'card' | 'cash' | 'room-charge';

export interface Payment {
  id: string;
  transactionId: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  type: 'booking' | 'restaurant' | 'service';
  referenceNumber?: string;
  bookingId?: string;
  orderId?: string;
  createdAt: string;
}

// Reviews
export type ReviewCategory = 'room' | 'restaurant' | 'service' | 'amenities';

export interface Review {
  id: string;
  guestName: string;
  guestEmail: string;
  category: ReviewCategory;
  rating: number;
  title: string;
  content: string;
  response?: string;
  responseDate?: string;
  roomNumber?: string;
  orderNumber?: string;
  isVerified: boolean;
  isFlagged: boolean;
  createdAt: string;
}

// Housekeeping
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'checkout-clean' | 'touch-up' | 'deep-clean' | 'maintenance' | 'turndown';

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomType: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: {
    id: string;
    name: string;
  };
  scheduledTime?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface HousekeepingStaff {
  id: string;
  name: string;
  role: string;
  assignedTasks: number;
  completedToday: number;
  isAvailable: boolean;
}

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
// MOCK DATA - MENU & RESTAURANT
// ============================================================================

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Store icon name as string (e.g., 'Coffee', 'Utensils')
  itemCount: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  prepTime: number;
  isAvailable: boolean;
  createdAt: string;
}

export const mockCategories: Category[] = [
  { id: '1', name: 'Breakfast', description: 'Morning meals', icon: 'Croissant', itemCount: 6, isActive: true },
  { id: '2', name: 'Nepali', description: 'Traditional favorites', icon: 'Utensils', itemCount: 5, isActive: true },
  { id: '3', name: 'Indian', description: 'Authentic flavors', icon: 'Soup', itemCount: 4, isActive: true },
  { id: '4', name: 'Chinese', description: 'Asian delights', icon: 'Pizza', itemCount: 4, isActive: true },
  { id: '5', name: 'Continental', description: 'Western cuisine', icon: 'Beef', itemCount: 3, isActive: true },
  { id: '6', name: 'Beverages', description: 'Drinks & more', icon: 'Coffee', itemCount: 5, isActive: true },
  { id: '7', name: 'Desserts', description: 'Sweet treats', icon: 'Cake', itemCount: 4, isActive: true },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Dal Bhat Set',
    description: 'Traditional Nepali meal with dal, rice, vegetables, pickle, and papad',
    price: 350,
    categoryId: '2',
    categoryName: 'Nepali',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    prepTime: 20,
    isAvailable: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Momo (Chicken)',
    description: 'Steamed dumplings filled with spiced chicken',
    price: 280,
    categoryId: '2',
    categoryName: 'Nepali',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    prepTime: 25,
    isAvailable: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken',
    price: 450,
    categoryId: '3',
    categoryName: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    prepTime: 30,
    isAvailable: true,
    createdAt: '2024-01-02',
  },
  {
    id: '4',
    name: 'English Breakfast',
    description: 'Eggs, bacon, sausages, beans, toast, and grilled tomatoes',
    price: 550,
    categoryId: '1',
    categoryName: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    prepTime: 20,
    isAvailable: true,
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon butter sauce',
    price: 850,
    categoryId: '5',
    categoryName: 'Continental',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    prepTime: 35,
    isAvailable: false,
    createdAt: '2024-01-04',
  },
];

// ============================================================================
// MOCK DATA - DASHBOARD (MANAGER)
// ============================================================================

export const mockManagerStats = [
  {
    title: 'Total Bookings',
    value: '156',
    change: '+12.5%',
    changeType: 'positive',
    iconName: 'Calendar',
    description: 'This month',
  },
  {
    title: 'Occupancy Rate',
    value: '78%',
    change: '+5.2%',
    changeType: 'positive',
    iconName: 'BedDouble',
    description: 'Current',
  },
  {
    title: 'Revenue',
    value: 'NPR 2.4M',
    change: '+18.3%',
    changeType: 'positive',
    iconName: 'DollarSign',
    description: 'This month',
  },
  {
    title: 'Total Guests',
    value: '324',
    change: '-2.1%',
    changeType: 'negative',
    iconName: 'Users',
    description: 'This month',
  },
];

export const mockRoomAvailability = {
  total: 50,
  occupied: 39,
  available: 8,
  maintenance: 3,
};

export const mockRecentBookings = [
  {
    id: '1',
    guestName: 'Ramesh Sharma',
    roomName: 'Deluxe Suite 305',
    checkIn: '2024-01-20',
    checkOut: '2024-01-23',
    status: 'confirmed',
    amount: 54000,
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    roomName: 'Executive Room 201',
    checkIn: '2024-01-21',
    checkOut: '2024-01-24',
    status: 'pending',
    amount: 36000,
  },
  {
    id: '3',
    guestName: 'Priya Patel',
    roomName: 'Standard Room 102',
    checkIn: '2024-01-20',
    checkOut: '2024-01-21',
    status: 'checked-in',
    amount: 8000,
  },
  {
    id: '4',
    guestName: 'John Smith',
    roomName: 'Presidential Suite',
    checkIn: '2024-01-22',
    checkOut: '2024-01-28',
    status: 'confirmed',
    amount: 270000,
  },
];

export const mockPendingOrders = [
  {
    id: 'ORD001',
    items: 'Dal Bhat Set, Momo (2)',
    roomNumber: '305',
    time: '5 min ago',
    total: 910,
    status: 'preparing',
  },
  {
    id: 'ORD002',
    items: 'Butter Chicken, Naan (2)',
    roomNumber: '201',
    time: '8 min ago',
    total: 650,
    status: 'pending',
  },
  {
    id: 'ORD003',
    items: 'English Breakfast',
    roomNumber: '102',
    time: '12 min ago',
    total: 550,
    status: 'preparing',
  },
];

export const mockTodayActivity = {
  arrivals: [
    { guestName: 'Mike Wilson', roomNumber: '401', time: '14:00' },
    { guestName: 'Emma Brown', roomNumber: '208', time: '15:30' },
    { guestName: 'David Lee', roomNumber: '312', time: '16:00' },
  ],
  departures: [
    { guestName: 'Lisa Chen', roomNumber: '105', time: '10:00' },
    { guestName: 'Tom Harris', roomNumber: '209', time: '11:00' },
  ],
};

export const mockHousekeepingSummary = [
  { room: '105', type: 'Checkout Clean', priority: 'high', assignee: 'Maya' },
  { room: '209', type: 'Checkout Clean', priority: 'high', assignee: 'Rita' },
  { room: '303', type: 'Touch-up', priority: 'medium', assignee: 'Sita' },
  { room: '107', type: 'Deep Clean', priority: 'low', assignee: 'Maya' },
];

// ============================================================================
// EXPORT ALL MOCK DATA AS SINGLE OBJECT (for easy import)
// ============================================================================

export const mockKitchenStats = [
  {
    title: 'Pending Orders',
    value: 5,
    subtext: 'Needs preparation',
    iconName: 'AlertTriangle',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-900',
  },
  {
    title: 'Cooking',
    value: 3,
    subtext: 'On stove',
    iconName: 'UtensilsCrossed',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-900',
  },
  {
    title: 'Ready to Serve',
    value: 2,
    subtext: 'Waiting for pickup',
    iconName: 'CheckCircle',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-900',
  },
  {
    title: 'Avg Prep Time',
    value: '18m',
    subtext: 'Target: 20m',
    iconName: 'Clock',
    color: 'text-muted-foreground',
    bgColor: '',
    borderColor: '',
  },
];

export const mockKitchenTickets = {
  new: [
    {
      id: '#1024',
      location: 'Table 12',
      time: '2 mins ago',
      items: [
        { name: '2x Chicken Burger', subtext: '' },
        { name: '- No onions', subtext: '', isNote: true },
        { name: '1x Fries (L)', subtext: '' },
        { name: '2x Coke', subtext: '' },
      ],
      action: 'Start Cooking',
      targetStatus: 'Cooking',
      btnVariant: 'default', // Map to actual variant logic in component or just string
      btnColor: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      id: '#1025',
      location: 'Room 304',
      time: 'Just now',
      items: [
        { name: '1x Club Sandwich', subtext: '' },
        { name: '1x Coffee', subtext: '' },
      ],
      action: 'Start Cooking',
      targetStatus: 'Cooking',
      btnVariant: 'default',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
    },
  ],
  cooking: [
    {
      id: '#1022',
      location: 'Table 4',
      time: '12 mins elapsed',
      timeColor: 'text-yellow-600',
      items: [
        { name: '1x Pasta Alfredo', subtext: '' },
        { name: '1x Garlic Bread', subtext: '' },
      ],
      action: 'Mark Ready',
      targetStatus: 'Ready',
      btnVariant: 'default',
      btnColor: 'bg-green-600 hover:bg-green-700',
    },
  ],
  ready: [
    {
      id: '#1020',
      location: 'Room 101',
      time: 'Waiting Pickup (4m)',
      timeColor: 'text-green-600 font-bold',
      items: [
        { name: '1x Pizza', subtext: '', isDimmed: true },
      ],
      action: 'Served',
      targetStatus: 'Served',
      btnVariant: 'outline',
      btnColor: '',
    },
  ],
};

export const mockHousekeepingStats = [
  {
    title: 'To Clean',
    value: 12,
    subtext: '4 high priority',
    iconName: 'BedDouble',
    color: 'text-red-500',
    progress: 33,
  },
  {
    title: 'In Progress',
    value: 5,
    subtext: 'AVG time: 25 mins',
    iconName: 'Clock',
    color: 'text-blue-500',
  },
  {
    title: 'Ready',
    value: 38,
    subtext: 'Ready for check-in',
    iconName: 'CheckCircle2',
    color: 'text-green-500',
  },
];

export const mockHousekeepingRooms = [
  { number: '101', status: 'clean', assignee: '' },
  { number: '102', status: 'dirty', assignee: 'Jane' },
  { number: '103', status: 'cleaning', assignee: 'Sarah' },
  { number: '104', status: 'clean', assignee: '' },
  { number: '105', status: 'dirty', assignee: 'Jane' },
  { number: '201', status: 'maintenance', assignee: '' },
  { number: '202', status: 'clean', assignee: '' },
  { number: '203', status: 'cleaning', assignee: 'Mike' },
  { number: '204', status: 'dirty', assignee: 'Mike' },
  { number: '205', status: 'clean', assignee: '' },
  { number: '301', status: 'clean', assignee: '' },
  { number: '302', status: 'dirty', assignee: 'Sarah' },
];

export const mockReceptionistStats = [
  { title: 'Arrivals Today', value: '12', subtext: '4 checked in', iconName: 'Users' },
  { title: 'Departures', value: '8', subtext: '2 checked out', iconName: 'LogOut' },
  { title: 'In House', value: '45', subtext: '85% occupancy', iconName: 'BedDouble' },
  { title: 'Available Rooms', value: '5', subtext: 'Clean & Ready', iconName: 'Search' },
];

export const mockGuestActivity = {
  arrivals: [
    { id: 1, guest: 'John Doe', room: '101', pax: '2 Adults', source: 'Booking.com', status: 'Paid' },
    { id: 2, guest: 'Jane Smith', room: '102', pax: '1 Adult', source: 'Direct', status: 'Pending' },
    { id: 3, guest: 'Robert Brown', room: '103', pax: '2 Adults, 1 Child', source: 'Expedia', status: 'Paid' },
    { id: 4, guest: 'Emily Davis', room: '104', pax: '2 Adults', source: 'Walk-in', status: 'Paid' },
  ],
  departures: [],
  inhouse: [],
};

export const mockFrontDeskRequests = [
  { type: 'Wake up call', room: '204', time: '6:00 AM', iconName: 'Clock', color: 'text-orange-500' },
  { type: 'Taxi to Airport', room: '305', time: '10:30 AM', iconName: 'Phone', color: 'text-blue-500' },
  { type: 'Extra Towels', room: '102', time: 'Just now', iconName: 'Mail', color: 'text-green-500' },
];

export const mockShiftNotes = "Room 201 VIP guest arriving at 2 PM. Please ensure amenities are placed.\n\nNight audit needs to run at 11 PM.";

export const mockRevenueStats = [
  { title: 'Total Revenue', value: '$12,345', change: '+15%', changeType: 'positive', subtext: 'from last month', iconName: 'DollarSign' },
  { title: 'RevPAR', value: '$85.00', change: '+5%', changeType: 'positive', subtext: 'vs target', iconName: 'TrendingUp' },
  { title: 'ADR', value: '$105.00', change: '-2%', changeType: 'negative', subtext: 'vs last week', iconName: 'BarChart' },
  { title: 'Occupancy', value: '82%', change: '+12%', changeType: 'positive', subtext: 'yoy', iconName: 'Users' },
];

export const mockRevenueOverview = [
  { month: 'J', value: 40 },
  { month: 'F', value: 60 },
  { month: 'M', value: 45 },
  { month: 'A', value: 70 },
  { month: 'M', value: 80 },
  { month: 'J', value: 55 },
  { month: 'J', value: 65 },
  { month: 'A', value: 85 },
  { month: 'S', value: 90 },
  { month: 'O', value: 75 },
  { month: 'N', value: 60 },
  { month: 'D', value: 95 },
];

// ============================================================================
// MOCK DATA - ROOMS & BOOKINGS
// ============================================================================

export const mockRoomTypes: RoomType[] = [
  { id: '1', name: 'Standard Room', description: 'Basic room with essential amenities', basePrice: 8000, capacity: 2, roomCount: 20 },
  { id: '2', name: 'Deluxe Room', description: 'Spacious room with city views', basePrice: 12000, capacity: 2, roomCount: 15 },
  { id: '3', name: 'Executive Suite', description: 'Luxury suite with separate living area', basePrice: 18000, capacity: 3, roomCount: 8 },
  { id: '4', name: 'Family Suite', description: 'Perfect for families with extra space', basePrice: 22000, capacity: 4, roomCount: 5 },
  { id: '5', name: 'Presidential Suite', description: 'Ultimate luxury experience', basePrice: 45000, capacity: 4, roomCount: 2 },
];

export const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    name: 'Standard Room 101',
    type: 'Standard Room',
    floor: 1,
    capacity: 2,
    price: 8000,
    status: 'available',
    isActive: true,
    amenities: ['wifi', 'tv', 'ac'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    lastCleaned: '2024-01-20T10:00:00',
  },
  {
    id: '2',
    number: '102',
    name: 'Standard Room 102',
    type: 'Standard Room',
    floor: 1,
    capacity: 2,
    price: 8000,
    status: 'occupied',
    isActive: true,
    amenities: ['wifi', 'tv', 'ac'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    lastCleaned: '2024-01-19T14:00:00',
    currentGuest: 'Priya Patel',
    checkOut: '2024-01-21',
  },
  {
    id: '3',
    number: '201',
    name: 'Deluxe Room 201',
    type: 'Deluxe Room',
    floor: 2,
    capacity: 2,
    price: 12000,
    status: 'cleaning',
    isActive: true,
    amenities: ['wifi', 'tv', 'ac', 'minibar'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
    lastCleaned: '2024-01-20T08:00:00',
  },
  {
    id: '4',
    number: '305',
    name: 'Executive Suite 305',
    type: 'Executive Suite',
    floor: 3,
    capacity: 3,
    price: 18000,
    status: 'occupied',
    isActive: true,
    amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
    lastCleaned: '2024-01-19T16:00:00',
    currentGuest: 'Ramesh Sharma',
    checkOut: '2024-01-23',
  },
  {
    id: '5',
    number: '107',
    name: 'Standard Room 107',
    type: 'Standard Room',
    floor: 1,
    capacity: 2,
    price: 8000,
    status: 'maintenance',
    isActive: false,
    amenities: ['wifi', 'tv', 'ac'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    lastCleaned: '2024-01-18T10:00:00',
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    reference: 'BK87654321',
    guestName: 'Ramesh Sharma',
    guestEmail: 'ramesh@example.com',
    guestPhone: '+977 9841234567',
    roomName: 'Deluxe Suite',
    roomNumber: '305',
    checkIn: '2024-01-20',
    checkOut: '2024-01-23',
    guests: 2,
    totalAmount: 54000,
    paidAmount: 54000,
    status: 'confirmed',
    paymentStatus: 'paid',
    source: 'website',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    reference: 'BK12345678',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah@example.com',
    guestPhone: '+1 555-0123',
    roomName: 'Executive Room',
    roomNumber: '201',
    checkIn: '2024-01-21',
    checkOut: '2024-01-24',
    guests: 1,
    totalAmount: 36000,
    paidAmount: 18000,
    status: 'pending',
    paymentStatus: 'partial',
    source: 'ota',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    reference: 'BK98765432',
    guestName: 'Priya Patel',
    guestEmail: 'priya@example.com',
    guestPhone: '+91 9876543210',
    roomName: 'Standard Room',
    roomNumber: '102',
    checkIn: '2024-01-20',
    checkOut: '2024-01-21',
    guests: 2,
    totalAmount: 8000,
    paidAmount: 8000,
    status: 'checked-in',
    paymentStatus: 'paid',
    source: 'direct',
    createdAt: '2024-01-17',
  },
];

export const mockRecentTransactions = [
  { id: 1, guest: 'Guest #101', room: 'Room 201', amount: '+$120.00', method: 'Credit Card' },
  { id: 2, guest: 'Guest #102', room: 'Room 202', amount: '+$85.00', method: 'Cash' },
  { id: 3, guest: 'Guest #103', room: 'Room 203', amount: '+$310.00', method: 'Credit Card' },
  { id: 4, guest: 'Guest #104', room: 'Room 204', amount: '+$45.00', method: 'UPI' },
  { id: 5, guest: 'Guest #105', room: 'Room 205', amount: '+$150.00', method: 'Credit Card' },
];

// ============================================================================
// MOCK DATA - GUESTS, ORDERS & PAYMENTS
// ============================================================================

export const mockGuests: Guest[] = [
  {
    id: '1',
    firstName: 'Ramesh',
    lastName: 'Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+977 9841234567',
    address: 'Lazimpat, Kathmandu',
    city: 'Kathmandu',
    country: 'Nepal',
    nationality: 'Nepali',
    idType: 'Citizenship',
    idNumber: 'NP12345678',
    membershipTier: 'gold',
    totalBookings: 15,
    totalSpent: 450000,
    lastVisit: '2024-01-20',
    isVIP: true,
    createdAt: '2022-05-15',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 555-0123',
    city: 'New York',
    country: 'United States',
    nationality: 'American',
    idType: 'Passport',
    idNumber: 'US987654321',
    membershipTier: 'silver',
    totalBookings: 3,
    totalSpent: 125000,
    lastVisit: '2024-01-18',
    isVIP: false,
    createdAt: '2023-08-20',
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    reference: 'ORD001',
    guestName: 'Ramesh Sharma',
    guestPhone: '+977 9841234567',
    roomNumber: '305',
    location: 'Room 305',
    items: [
      { id: '1', name: 'Dal Bhat Set', quantity: 1, price: 350 },
      { id: '2', name: 'Momo (Chicken)', quantity: 2, price: 280, notes: 'Extra spicy', specialInstructions: 'Extra spicy' },
    ],
    totalAmount: 910,
    status: 'preparing',
    deliveryType: 'room',
    paymentMethod: 'Room Charge',
    isPaid: false,
    createdAt: '2024-01-20T12:30:00',
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    reference: 'ORD002',
    guestName: 'Sarah Johnson',
    guestPhone: '+1 555-0123',
    roomNumber: '201',
    location: 'Room 201',
    items: [
      { id: '3', name: 'Butter Chicken', quantity: 1, price: 450 },
      { id: '4', name: 'Naan', quantity: 2, price: 50 },
    ],
    totalAmount: 550,
    status: 'pending',
    deliveryType: 'room',
    paymentMethod: 'Cash',
    isPaid: true,
    createdAt: '2024-01-20T12:45:00',
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-2024011801',
    guestName: 'Ramesh Sharma',
    amount: 15500,
    method: 'esewa',
    status: 'completed',
    type: 'booking',
    referenceNumber: 'ESW123456789',
    bookingId: 'BK-2024-001',
    createdAt: '2024-01-18T10:30:00',
  },
  {
    id: '2',
    transactionId: 'TXN-2024011802',
    guestName: 'Sarah Johnson',
    amount: 2450,
    method: 'khalti',
    status: 'completed',
    type: 'restaurant',
    referenceNumber: 'KHL987654321',
    orderId: 'ORD-2024-045',
    createdAt: '2024-01-18T09:15:00',
  },
];

// ============================================================================
// MOCK DATA - REPORTS, REVIEWS & HOUSEKEEPING
// ============================================================================

export const mockRevenueData = [
  { month: 'Jan', rooms: 1850000, restaurant: 420000, other: 85000 },
  { month: 'Feb', rooms: 1920000, restaurant: 480000, other: 92000 },
  { month: 'Mar', rooms: 2150000, restaurant: 560000, other: 110000 },
  { month: 'Apr', rooms: 1980000, restaurant: 510000, other: 95000 },
  { month: 'May', rooms: 2350000, restaurant: 620000, other: 125000 },
  { month: 'Jun', rooms: 2480000, restaurant: 680000, other: 140000 },
];

export const mockOccupancyData = [
  { month: 'Jan', rate: 68 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 78 },
  { month: 'Apr', rate: 75 },
  { month: 'May', rate: 82 },
  { month: 'Jun', rate: 85 },
];

export const mockRoomTypePerformance = [
  { type: 'Standard Room', revenue: 4250000, occupancy: 92, bookings: 480 },
  { type: 'Deluxe Room', revenue: 3850000, occupancy: 85, bookings: 320 },
  { type: 'Executive Suite', revenue: 2150000, occupancy: 78, bookings: 145 },
  { type: 'Family Suite', revenue: 1450000, occupancy: 65, bookings: 85 },
  { type: 'Presidential Suite', revenue: 980000, occupancy: 45, bookings: 28 },
];

export const mockTopMenuItems = [
  { name: 'Dal Bhat Set', quantity: 1250, revenue: 437500 },
  { name: 'Momo (Chicken)', quantity: 980, revenue: 274400 },
  { name: 'Butter Chicken', quantity: 720, revenue: 324000 },
  { name: 'English Breakfast', quantity: 650, revenue: 357500 },
  { name: 'Grilled Chicken', quantity: 480, revenue: 312000 },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    guestName: 'Ramesh Sharma',
    guestEmail: 'ramesh@example.com',
    category: 'room',
    rating: 5,
    title: 'Excellent stay!',
    content: 'The room was spotless, the view was amazing, and the staff was incredibly helpful. Will definitely come back!',
    response: 'Thank you for your wonderful review! We look forward to welcoming you again.',
    responseDate: '2024-01-18',
    roomNumber: '305',
    isVerified: true,
    isFlagged: false,
    createdAt: '2024-01-17',
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah@example.com',
    category: 'restaurant',
    rating: 4,
    title: 'Great food, slow service',
    content: 'The food quality was excellent - especially the butter chicken. However, the room service was a bit slow during peak hours.',
    isVerified: true,
    isFlagged: false,
    createdAt: '2024-01-16',
  },
];

export const mockHousekeepingTasks: HousekeepingTask[] = [
  {
    id: '1',
    roomNumber: '105',
    roomType: 'Standard Room',
    taskType: 'checkout-clean',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-20T10:00:00',
  },
  {
    id: '2',
    roomNumber: '209',
    roomType: 'Deluxe Room',
    taskType: 'checkout-clean',
    priority: 'high',
    status: 'in-progress',
    assignee: { id: 'staff-1', name: 'Rita' },
    startedAt: '2024-01-20T11:00:00',
    createdAt: '2024-01-20T10:15:00',
  },
];

export const mockHousekeepingStaff: HousekeepingStaff[] = [
  { id: 'staff-1', name: 'Rita', role: 'Housekeeper', assignedTasks: 4, completedToday: 3, isAvailable: false },
  { id: 'staff-2', name: 'Maya', role: 'Housekeeper', assignedTasks: 2, completedToday: 5, isAvailable: true },
  { id: 'staff-3', name: 'Sita', role: 'Housekeeper', assignedTasks: 3, completedToday: 2, isAvailable: true },
];

export const mockHotelSettings = {
  name: 'Grand Hotel Kathmandu',
  email: 'info@grandkathmandu.com',
  phone: '+977-1-4411999',
  address: 'Durbar Marg, Kathmandu, Nepal',
  currency: 'NPR',
  timezone: 'Asia/Kathmandu',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  taxRate: 13,
  serviceCharge: 10,
};

export const mockData = {
  // Configuration
  USE_MOCK_DATA,

  // Hotel Core Data
  settings: mockHotelSettings,
  hotels: mockHotels,
  hotelPerformance: mockHotelPerformance,

  // Admins & Users
  admins: mockAdmins,
  users: mockUsers,
  availableHotels,

  // Rooms & Bookings
  rooms: mockRooms,
  roomTypes: mockRoomTypes,
  bookings: mockBookings,
  guests: mockGuests,

  // Restaurant & Orders
  categories: mockCategories,
  menuItems: mockMenuItems,
  orders: mockOrders,

  // Finance & Payments
  payments: mockPayments,
  totalRevenue: mockRevenueData,
  occupancyHistory: mockOccupancyData,
  revenueStats: mockRevenueStats,
  revenueOverview: mockRevenueOverview,
  recentTransactions: mockRecentTransactions,

  // Analytics & Reports
  propertyPerformance: mockPropertyPerformance,
  monthlyTrends: mockMonthlyTrends,
  revenueByCategory: mockRevenueByCategory,
  guestDemographics: mockGuestDemographics,
  topSegments: mockTopSegments,
  roomTypePerformance: mockRoomTypePerformance,
  topMenuItems: mockTopMenuItems,

  // Housekeeping & Operations
  housekeepingTasks: mockHousekeepingTasks,
  housekeepingStaff: mockHousekeepingStaff,
  housekeepingSummary: mockHousekeepingSummary,
  housekeepingRooms: mockHousekeepingRooms,
  housekeepingStats: mockHousekeepingStats,

  // Reviews
  reviews: mockReviews,

  // Kitchen Dashboard
  kitchenStats: mockKitchenStats,
  kitchenTickets: mockKitchenTickets,

  // Receptionist Dashboard
  receptionistStats: mockReceptionistStats,
  guestActivity: mockGuestActivity,
  frontDeskRequests: mockFrontDeskRequests,
  shiftNotes: mockShiftNotes,

  // Manager Dashboard Stats
  managerStats: mockManagerStats,
  roomAvailability: mockRoomAvailability,
  recentBookings: mockRecentBookings,
  pendingOrders: mockPendingOrders,
  todayActivity: mockTodayActivity,

  // Activities & Logs
  recentActivities: mockRecentActivities,
  auditLogs: mockAuditLogs,

  // Subscriptions
  subscriptions: mockSubscriptions,

  // System
  systemMetrics: mockSystemMetrics,
  serviceStatus: mockServiceStatus,

  // Config Mapping
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
