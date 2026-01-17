/**
 * Hotel PMS - Guest Types
 * Types for guest entity and related data
 */

import { BaseEntity, Address, ContactInfo } from './common.types';

// Guest entity
export interface Guest extends BaseEntity {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality?: string;
  address?: Address;
  idType?: IdentificationType;
  idNumber?: string;
  idExpiryDate?: string;
  avatar?: string;
  vipLevel: VIPLevel;
  tags: string[];
  preferences: GuestPreferences;
  statistics: GuestStatistics;
  notes?: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
}

// Identification types
export type IdentificationType = 
  | 'passport'
  | 'national-id'
  | 'driving-license'
  | 'voter-id'
  | 'citizenship'
  | 'other';

// VIP levels
export type VIPLevel = 'none' | 'silver' | 'gold' | 'platinum' | 'diamond';

// Guest preferences
export interface GuestPreferences {
  roomPreferences: {
    floor?: 'low' | 'high' | 'any';
    bedType?: string;
    smoking?: boolean;
    view?: string;
    quietRoom?: boolean;
  };
  dietaryRestrictions?: string[];
  allergies?: string[];
  specialNeeds?: string[];
  communicationPreference: 'email' | 'phone' | 'sms' | 'whatsapp';
  language: string;
}

// Guest statistics
export interface GuestStatistics {
  totalStays: number;
  totalNights: number;
  totalSpent: number;
  averageSpendPerStay: number;
  lastStayDate?: string;
  firstStayDate?: string;
  cancellationRate: number;
  totalOrders: number;
}

// Create guest request
export interface CreateGuestRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  address?: Address;
  idType?: IdentificationType;
  idNumber?: string;
  notes?: string;
}

// Update guest request
export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {
  vipLevel?: VIPLevel;
  tags?: string[];
  preferences?: Partial<GuestPreferences>;
  isBlacklisted?: boolean;
  blacklistReason?: string;
}

// Guest search filters
export interface GuestSearchFilters {
  search?: string;
  vipLevel?: VIPLevel;
  isBlacklisted?: boolean;
  hasUpcomingBooking?: boolean;
  minStays?: number;
  maxStays?: number;
  tags?: string[];
}

// Guest list item
export interface GuestListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vipLevel: VIPLevel;
  totalStays: number;
  totalSpent: number;
  lastStayDate?: string;
  isBlacklisted: boolean;
}

// Guest activity log
export interface GuestActivityLog {
  id: string;
  guestId: string;
  type: GuestActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

// Guest activity types
export type GuestActivityType = 
  | 'booking-created'
  | 'booking-cancelled'
  | 'checked-in'
  | 'checked-out'
  | 'order-placed'
  | 'payment-made'
  | 'review-submitted'
  | 'profile-updated'
  | 'complaint-filed'
  | 'note-added';

// Guest feedback
export interface GuestFeedback {
  id: string;
  guestId: string;
  bookingId: string;
  type: 'complaint' | 'suggestion' | 'compliment' | 'general';
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}
