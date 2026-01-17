/**
 * Hotel PMS - Review Types
 * Types for guest reviews and ratings
 */

import { BaseEntity } from './common.types';

// Review entity
export interface Review extends BaseEntity {
  hotelId: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  guestAvatar?: string;
  ratings: ReviewRatings;
  overallRating: number;
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  stayDate: string;
  roomType: string;
  tripType: TripType;
  isVerified: boolean;
  isPublished: boolean;
  helpfulCount: number;
  response?: ReviewResponse;
  flags?: ReviewFlag[];
}

// Review ratings breakdown
export interface ReviewRatings {
  cleanliness: number;
  comfort: number;
  location: number;
  facilities: number;
  staff: number;
  valueForMoney: number;
  food?: number;
}

// Trip types
export type TripType = 
  | 'business'
  | 'leisure'
  | 'family'
  | 'couple'
  | 'solo'
  | 'group';

// Review response from hotel
export interface ReviewResponse {
  message: string;
  respondedBy: string;
  respondedAt: string;
}

// Review flag for moderation
export interface ReviewFlag {
  reason: 'inappropriate' | 'fake' | 'spam' | 'other';
  description?: string;
  flaggedBy: string;
  flaggedAt: string;
}

// Create review request
export interface CreateReviewRequest {
  bookingId: string;
  ratings: ReviewRatings;
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  tripType: TripType;
  images?: string[];
}

// Review response request
export interface CreateReviewResponseRequest {
  reviewId: string;
  message: string;
}

// Review search filters
export interface ReviewSearchFilters {
  search?: string;
  minRating?: number;
  maxRating?: number;
  tripType?: TripType;
  isPublished?: boolean;
  hasResponse?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Review statistics
export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>; // 1-5 stars count
  categoryAverages: ReviewRatings;
  responseRate: number;
  averageResponseTime: number; // in hours
  recentReviews: Review[];
}

// Review summary for display
export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  categoryAverages: ReviewRatings;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  highlights: {
    category: string;
    sentiment: 'positive' | 'negative';
    count: number;
  }[];
}
