/**
 * Hotel PMS - Booking Types
 * Types for booking entity and related data
 */

import { BaseEntity } from './common.types';
import type { Hotel } from './hotel.types';
import type { Room, RoomType, RoomRate } from './room.types';
import type { Guest } from './guest.types';
import type { Payment } from './payment.types';

// Booking status
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'no-show';

// Payment status
export type BookingPaymentStatus = 
  | 'pending'
  | 'partial'
  | 'paid'
  | 'refunded'
  | 'failed';

// Booking entity
export interface Booking extends BaseEntity {
  bookingNumber: string;
  hotelId: string;
  hotel: Hotel;
  guestId: string;
  guest: Guest;
  rooms: BookedRoom[];
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  specialRequests?: string;
  internalNotes?: string;
  pricing: BookingPricing;
  payments: Payment[];
  source: BookingSource;
  cancellation?: BookingCancellation;
  checkInDetails?: CheckInDetails;
  checkOutDetails?: CheckOutDetails;
}

// Booked room
export interface BookedRoom {
  roomId: string;
  room: Room;
  roomTypeId: string;
  roomType: RoomType;
  rateId: string;
  rate: RoomRate;
  pricePerNight: number;
  totalPrice: number;
  guestNames?: string[];
}

// Booking pricing breakdown
export interface BookingPricing {
  roomTotal: number;
  taxAmount: number;
  taxPercentage: number;
  serviceCharge: number;
  discount: number;
  discountCode?: string;
  extraCharges: ExtraCharge[];
  subtotal: number;
  grandTotal: number;
  currency: string;
  amountPaid: number;
  amountDue: number;
}

// Extra charges
export interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  total: number;
  date: string;
  category: 'room-service' | 'minibar' | 'laundry' | 'restaurant' | 'other';
}

// Booking source
export type BookingSource = 
  | 'direct'
  | 'website'
  | 'phone'
  | 'walk-in'
  | 'booking.com'
  | 'expedia'
  | 'airbnb'
  | 'agoda'
  | 'other';

// Booking cancellation
export interface BookingCancellation {
  cancelledAt: string;
  cancelledBy: string;
  reason: string;
  refundAmount: number;
  refundStatus: 'pending' | 'processed' | 'failed';
}

// Check-in details
export interface CheckInDetails {
  checkedInAt: string;
  checkedInBy: string;
  idVerified: boolean;
  idType?: string;
  idNumber?: string;
  vehicleNumber?: string;
  keyCardNumbers?: string[];
}

// Check-out details
export interface CheckOutDetails {
  checkedOutAt: string;
  checkedOutBy: string;
  roomInspected: boolean;
  minibarCharges: number;
  damageCharges: number;
  lateCheckoutFee: number;
  notes?: string;
}

// Create booking request
export interface CreateBookingRequest {
  hotelId: string;
  guestId?: string;
  guestDetails?: GuestDetails;
  roomSelections: RoomSelection[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  specialRequests?: string;
  discountCode?: string;
  source?: BookingSource;
}

// Room selection for booking
export interface RoomSelection {
  roomTypeId: string;
  rateId: string;
  quantity: number;
}

// Guest details for booking (if not registered)
export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

// Update booking request
export interface UpdateBookingRequest {
  status?: BookingStatus;
  specialRequests?: string;
  internalNotes?: string;
  checkIn?: string;
  checkOut?: string;
}

// Booking search filters
export interface BookingSearchFilters {
  search?: string;
  status?: BookingStatus | BookingStatus[];
  paymentStatus?: BookingPaymentStatus;
  checkInFrom?: string;
  checkInTo?: string;
  checkOutFrom?: string;
  checkOutTo?: string;
  source?: BookingSource;
  guestId?: string;
}

// Booking calendar item
export interface BookingCalendarItem {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  nights: number;
}

// Booking statistics
export interface BookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInGuests: number;
  upcomingCheckIns: number;
  upcomingCheckOuts: number;
  cancellations: number;
  noShows: number;
  averageStayDuration: number;
  occupancyRate: number;
}

// Quick booking for walk-ins
export interface QuickBookingRequest {
  roomId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  nights: number;
  adults: number;
  children?: number;
  paymentMethod: string;
  amountPaid: number;
}
