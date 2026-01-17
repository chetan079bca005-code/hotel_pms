/**
 * Hotel PMS - Hotel Types
 * Types for hotel entity and related data
 */

import { BaseEntity, Address, ContactInfo, Image, Status } from './common.types';

// Hotel entity
export interface Hotel extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  address: Address;
  contactInfo: ContactInfo;
  images: Image[];
  coverImage: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  starRating: number; // 1-5 stars
  amenities: Amenity[];
  policies: HotelPolicies;
  checkInTime: string;
  checkOutTime: string;
  status: Status;
  isVerified: boolean;
  totalRooms: number;
  availableRooms: number;
  priceRange: PriceRange;
  features: HotelFeature[];
  socialLinks?: SocialLinks;
  subscription?: HotelSubscription;
}

// Hotel amenity
export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: AmenityCategory;
  description?: string;
}

// Amenity categories
export type AmenityCategory = 
  | 'general'
  | 'room'
  | 'bathroom'
  | 'dining'
  | 'entertainment'
  | 'wellness'
  | 'business'
  | 'transportation'
  | 'outdoor';

// Hotel policies
export interface HotelPolicies {
  cancellation: CancellationPolicy;
  childPolicy: string;
  petPolicy: string;
  smokingPolicy: string;
  paymentMethods: string[];
  additionalPolicies?: string[];
}

// Cancellation policy types
export interface CancellationPolicy {
  type: 'free' | 'partial' | 'non-refundable';
  description: string;
  deadlineHours: number; // Hours before check-in
  refundPercentage: number;
}

// Price range
export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

// Hotel features
export type HotelFeature = 
  | 'restaurant'
  | 'bar'
  | 'spa'
  | 'gym'
  | 'pool'
  | 'parking'
  | 'wifi'
  | 'room-service'
  | 'laundry'
  | 'airport-shuttle'
  | 'conference-room'
  | 'kids-club';

// Social media links
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  tripadvisor?: string;
}

// Hotel subscription for SaaS model
export interface HotelSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

// Subscription plans
export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

// Hotel search filters
export interface HotelSearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  amenities?: string[];
  features?: HotelFeature[];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Hotel search result
export interface HotelSearchResult {
  hotel: Hotel;
  lowestPrice: number;
  availableRooms: number;
  distance?: number; // Distance from search location
  matchScore: number; // Relevance score
}

// Create hotel request
export interface CreateHotelRequest {
  name: string;
  description: string;
  shortDescription: string;
  address: Address;
  contactInfo: ContactInfo;
  starRating: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: HotelPolicies;
}

// Update hotel request
export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  status?: Status;
}

// Hotel statistics
export interface HotelStatistics {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalReviews: number;
  totalGuests: number;
  repeatGuestRate: number;
  averageDailyRate: number;
  revPAR: number; // Revenue per available room
}

// Hotel list item for super admin
export interface HotelListItem {
  id: string;
  name: string;
  location: string;
  status: Status;
  totalRooms: number;
  subscription: HotelSubscription;
  statistics: Pick<HotelStatistics, 'totalBookings' | 'totalRevenue' | 'occupancyRate'>;
}
