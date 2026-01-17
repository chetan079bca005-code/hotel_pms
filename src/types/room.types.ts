/**
 * Hotel PMS - Room Types
 * Types for room entity and related data
 */

import { BaseEntity, Image } from './common.types';
import { Amenity } from './hotel.types';

// Room status
export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'cleaning';

// Room type/category
export interface RoomType extends BaseEntity {
  hotelId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  bedConfiguration: BedConfiguration[];
  size: number; // in square meters/feet
  sizeUnit: 'sqm' | 'sqft';
  images: Image[];
  amenities: Amenity[];
  basePrice: number;
  currency: string;
  totalRooms: number;
  availableRooms: number;
}

// Bed configuration
export interface BedConfiguration {
  type: BedType;
  count: number;
}

// Bed types
export type BedType = 
  | 'single'
  | 'double'
  | 'queen'
  | 'king'
  | 'twin'
  | 'sofa-bed'
  | 'bunk-bed'
  | 'crib';

// Individual room
export interface Room extends BaseEntity {
  hotelId: string;
  roomTypeId: string;
  roomType: RoomType;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  isClean: boolean;
  lastCleanedAt?: string;
  notes?: string;
  currentBookingId?: string;
  features: RoomFeature[];
}

// Room features
export interface RoomFeature {
  name: string;
  icon?: string;
}

// Room availability
export interface RoomAvailability {
  roomTypeId: string;
  roomType: RoomType;
  date: string;
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  blockedRooms: number;
  price: number;
  minStay: number;
}

// Room rate/pricing
export interface RoomRate extends BaseEntity {
  hotelId: string;
  roomTypeId: string;
  name: string;
  description?: string;
  rateType: RateType;
  price: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  minStay: number;
  maxStay?: number;
  isActive: boolean;
  inclusions: string[];
  restrictions?: RateRestrictions;
}

// Rate types
export type RateType = 
  | 'standard'
  | 'weekend'
  | 'seasonal'
  | 'promotional'
  | 'corporate'
  | 'package';

// Rate restrictions
export interface RateRestrictions {
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minAdvanceBooking?: number; // Days
  maxAdvanceBooking?: number; // Days
}

// Room search/availability request
export interface RoomSearchRequest {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  roomCount?: number;
}

// Room availability response
export interface RoomAvailabilityResponse {
  roomType: RoomType;
  availableCount: number;
  rates: RoomRate[];
  lowestRate: number;
  totalPrice: number; // For the entire stay
}

// Create room request
export interface CreateRoomRequest {
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  features?: RoomFeature[];
  notes?: string;
}

// Update room request
export interface UpdateRoomRequest {
  roomNumber?: string;
  floor?: number;
  status?: RoomStatus;
  isClean?: boolean;
  features?: RoomFeature[];
  notes?: string;
}

// Create room type request
export interface CreateRoomTypeRequest {
  name: string;
  description: string;
  shortDescription: string;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  bedConfiguration: BedConfiguration[];
  size: number;
  sizeUnit: 'sqm' | 'sqft';
  amenities: string[];
  basePrice: number;
}

// Room inventory calendar
export interface RoomInventoryCalendar {
  date: string;
  roomTypes: {
    roomTypeId: string;
    roomTypeName: string;
    total: number;
    available: number;
    booked: number;
    blocked: number;
    rate: number;
  }[];
}

// Bulk room status update
export interface BulkRoomStatusUpdate {
  roomIds: string[];
  status: RoomStatus;
  notes?: string;
}
