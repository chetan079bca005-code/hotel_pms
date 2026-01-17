/**
 * Hotel PMS - Booking Service
 * API calls for booking management
 */

import api from './api';
import {
  Booking,
  BookingSearchFilters,
  BookingStatistics,
  BookingCalendarItem,
  CreateBookingRequest,
  UpdateBookingRequest,
  QuickBookingRequest,
  PaginatedResponse,
  RoomAvailabilityResponse,
  RoomSearchRequest,
} from '@/types';

// API endpoints
const BOOKING_ENDPOINTS = {
  BASE: '/bookings',
  AVAILABILITY: '/bookings/availability',
  CALENDAR: '/bookings/calendar',
  STATISTICS: '/bookings/statistics',
  CHECK_IN: (id: string) => `/bookings/${id}/check-in`,
  CHECK_OUT: (id: string) => `/bookings/${id}/check-out`,
  CANCEL: (id: string) => `/bookings/${id}/cancel`,
  MY_BOOKINGS: '/bookings/my-bookings',
  QUICK_BOOKING: '/bookings/quick',
};

/**
 * Booking service with all booking-related API calls
 */
export const bookingService = {
  /**
   * Check room availability
   */
  async checkAvailability(
    request: RoomSearchRequest
  ): Promise<RoomAvailabilityResponse[]> {
    const response = await api.post<{ data: RoomAvailabilityResponse[] }>(
      BOOKING_ENDPOINTS.AVAILABILITY,
      request
    );
    return response.data.data;
  },

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      BOOKING_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    const response = await api.get<{ data: Booking }>(
      `${BOOKING_ENDPOINTS.BASE}/${bookingId}`
    );
    return response.data.data;
  },

  /**
   * Get booking by booking number
   */
  async getBookingByNumber(bookingNumber: string): Promise<Booking> {
    const response = await api.get<{ data: Booking }>(
      `${BOOKING_ENDPOINTS.BASE}/number/${bookingNumber}`
    );
    return response.data.data;
  },

  /**
   * Get all bookings (admin)
   */
  async getBookings(
    filters: BookingSearchFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Booking>> {
    const response = await api.get<{ data: PaginatedResponse<Booking> }>(
      BOOKING_ENDPOINTS.BASE,
      {
        params: { ...filters, page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Booking>> {
    const response = await api.get<{ data: PaginatedResponse<Booking> }>(
      BOOKING_ENDPOINTS.MY_BOOKINGS,
      {
        params: { page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Update booking
   */
  async updateBooking(
    bookingId: string,
    data: UpdateBookingRequest
  ): Promise<Booking> {
    const response = await api.patch<{ data: Booking }>(
      `${BOOKING_ENDPOINTS.BASE}/${bookingId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      BOOKING_ENDPOINTS.CANCEL(bookingId),
      { reason }
    );
    return response.data.data;
  },

  /**
   * Check in guest
   */
  async checkIn(
    bookingId: string,
    details: {
      idVerified: boolean;
      idType?: string;
      idNumber?: string;
      vehicleNumber?: string;
    }
  ): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      BOOKING_ENDPOINTS.CHECK_IN(bookingId),
      details
    );
    return response.data.data;
  },

  /**
   * Check out guest
   */
  async checkOut(
    bookingId: string,
    details: {
      roomInspected: boolean;
      minibarCharges?: number;
      damageCharges?: number;
      lateCheckoutFee?: number;
      notes?: string;
    }
  ): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      BOOKING_ENDPOINTS.CHECK_OUT(bookingId),
      details
    );
    return response.data.data;
  },

  /**
   * Quick booking for walk-ins
   */
  async quickBooking(data: QuickBookingRequest): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      BOOKING_ENDPOINTS.QUICK_BOOKING,
      data
    );
    return response.data.data;
  },

  /**
   * Get booking calendar
   */
  async getBookingCalendar(
    startDate: string,
    endDate: string
  ): Promise<BookingCalendarItem[]> {
    const response = await api.get<{ data: BookingCalendarItem[] }>(
      BOOKING_ENDPOINTS.CALENDAR,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  /**
   * Get booking statistics
   */
  async getStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<BookingStatistics> {
    const response = await api.get<{ data: BookingStatistics }>(
      BOOKING_ENDPOINTS.STATISTICS,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  /**
   * Add extra charge to booking
   */
  async addExtraCharge(
    bookingId: string,
    charge: {
      description: string;
      amount: number;
      quantity: number;
      category: string;
    }
  ): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      `${BOOKING_ENDPOINTS.BASE}/${bookingId}/charges`,
      charge
    );
    return response.data.data;
  },

  /**
   * Apply discount to booking
   */
  async applyDiscount(
    bookingId: string,
    discountCode: string
  ): Promise<Booking> {
    const response = await api.post<{ data: Booking }>(
      `${BOOKING_ENDPOINTS.BASE}/${bookingId}/discount`,
      { discountCode }
    );
    return response.data.data;
  },

  /**
   * Send booking confirmation email
   */
  async sendConfirmationEmail(bookingId: string): Promise<void> {
    await api.post(`${BOOKING_ENDPOINTS.BASE}/${bookingId}/send-confirmation`);
  },

  /**
   * Download booking invoice
   */
  async downloadInvoice(bookingId: string): Promise<Blob> {
    const response = await api.get(
      `${BOOKING_ENDPOINTS.BASE}/${bookingId}/invoice`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default bookingService;
