/**
 * Hotel PMS - Analytics Types
 * Types for reports and analytics
 */

import { DateRange } from './common.types';

// Dashboard metrics
export interface DashboardMetrics {
  // Today's stats
  todayCheckIns: number;
  todayCheckOuts: number;
  currentOccupancy: number;
  occupancyRate: number;
  
  // Revenue
  todayRevenue: number;
  monthRevenue: number;
  revenueChange: number; // Percentage change from previous period
  
  // Bookings
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  
  // Orders
  todayOrders: number;
  pendingOrders: number;
  orderRevenue: number;
  
  // Rooms
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  
  // Reviews
  averageRating: number;
  recentReviewCount: number;
}

// Occupancy data
export interface OccupancyData {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  revPAR: number;
  adr: number; // Average Daily Rate
}

// Revenue data
export interface RevenueData {
  date: string;
  roomRevenue: number;
  restaurantRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
}

// Booking analytics
export interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  noShows: number;
  averageStayLength: number;
  averageLeadTime: number; // Days between booking and check-in
  bookingsBySource: {
    source: string;
    count: number;
    percentage: number;
  }[];
  bookingsByRoomType: {
    roomType: string;
    count: number;
    revenue: number;
  }[];
}

// Guest analytics
export interface GuestAnalytics {
  totalGuests: number;
  newGuests: number;
  returningGuests: number;
  returnRate: number;
  averageSpend: number;
  guestsByNationality: {
    nationality: string;
    count: number;
    percentage: number;
  }[];
  guestsByVipLevel: {
    level: string;
    count: number;
  }[];
}

// Restaurant analytics
export interface RestaurantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByType: {
    type: string;
    count: number;
    revenue: number;
  }[];
  topSellingItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  ordersByHour: {
    hour: number;
    count: number;
  }[];
  categoryPerformance: {
    category: string;
    orders: number;
    revenue: number;
  }[];
}

// Report filters
export interface ReportFilters {
  dateRange: DateRange;
  hotelId?: string;
  roomTypeId?: string;
  comparison?: 'previous-period' | 'previous-year' | 'none';
}

// Financial report
export interface FinancialReport {
  period: DateRange;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    profitMargin: number;
  };
  revenueBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  expenseBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  dailyRevenue: RevenueData[];
  comparison?: {
    previousRevenue: number;
    revenueChange: number;
    previousExpenses: number;
    expensesChange: number;
  };
}

// Occupancy report
export interface OccupancyReport {
  period: DateRange;
  summary: {
    averageOccupancy: number;
    peakOccupancy: number;
    lowestOccupancy: number;
    totalRoomNights: number;
    soldRoomNights: number;
  };
  dailyOccupancy: OccupancyData[];
  occupancyByRoomType: {
    roomType: string;
    occupancyRate: number;
    revenue: number;
  }[];
  occupancyByDayOfWeek: {
    day: string;
    averageOccupancy: number;
  }[];
}

// Super admin consolidated analytics
export interface ConsolidatedAnalytics {
  totalHotels: number;
  activeHotels: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  averageOccupancy: number;
  hotelPerformance: {
    hotelId: string;
    hotelName: string;
    location: string;
    rooms: number;
    occupancyRate: number;
    revenue: number;
    rating: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  topPerformingHotels: {
    hotelId: string;
    hotelName: string;
    metric: string;
    value: number;
  }[];
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface MultiSeriesData {
  name: string;
  data: TimeSeriesData[];
  color?: string;
}

// Export report options
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  reportType: string;
  dateRange: DateRange;
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
}
