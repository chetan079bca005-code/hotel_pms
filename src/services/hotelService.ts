/**
 * Hotel PMS - Hotel Service
 * API calls for hotel management
 */

import api from './api';
import {
  Hotel,
  HotelSearchFilters,
  HotelSearchResult,
  HotelStatistics,
  CreateHotelRequest,
  UpdateHotelRequest,
  PaginatedResponse,
  Amenity,
} from '@/types';

// API endpoints
const HOTEL_ENDPOINTS = {
  BASE: '/hotels',
  SEARCH: '/hotels/search',
  FEATURED: '/hotels/featured',
  POPULAR: '/hotels/popular',
  AMENITIES: '/amenities',
  STATISTICS: (id: string) => `/hotels/${id}/statistics`,
};

/**
 * Hotel service with all hotel-related API calls
 */
export const hotelService = {
  /**
   * Search hotels with filters
   */
  async searchHotels(
    filters: HotelSearchFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<HotelSearchResult>> {
    const response = await api.get<{ data: PaginatedResponse<HotelSearchResult> }>(
      HOTEL_ENDPOINTS.SEARCH,
      {
        params: { ...filters, page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Get hotel by ID
   */
  async getHotel(hotelId: string): Promise<Hotel> {
    const response = await api.get<{ data: Hotel }>(
      `${HOTEL_ENDPOINTS.BASE}/${hotelId}`
    );
    return response.data.data;
  },

  /**
   * Get hotel by slug
   */
  async getHotelBySlug(slug: string): Promise<Hotel> {
    const response = await api.get<{ data: Hotel }>(
      `${HOTEL_ENDPOINTS.BASE}/slug/${slug}`
    );
    return response.data.data;
  },

  /**
   * Get featured hotels
   */
  async getFeaturedHotels(limit = 6): Promise<Hotel[]> {
    const response = await api.get<{ data: Hotel[] }>(
      HOTEL_ENDPOINTS.FEATURED,
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get popular hotels
   */
  async getPopularHotels(limit = 6): Promise<Hotel[]> {
    const response = await api.get<{ data: Hotel[] }>(
      HOTEL_ENDPOINTS.POPULAR,
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get all hotels (admin)
   */
  async getAllHotels(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<Hotel>> {
    const response = await api.get<{ data: PaginatedResponse<Hotel> }>(
      HOTEL_ENDPOINTS.BASE,
      { params: { page, limit, search } }
    );
    return response.data.data;
  },

  /**
   * Create a new hotel (super admin)
   */
  async createHotel(data: CreateHotelRequest): Promise<Hotel> {
    const response = await api.post<{ data: Hotel }>(
      HOTEL_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update hotel
   */
  async updateHotel(hotelId: string, data: UpdateHotelRequest): Promise<Hotel> {
    const response = await api.patch<{ data: Hotel }>(
      `${HOTEL_ENDPOINTS.BASE}/${hotelId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete hotel (super admin)
   */
  async deleteHotel(hotelId: string): Promise<void> {
    await api.delete(`${HOTEL_ENDPOINTS.BASE}/${hotelId}`);
  },

  /**
   * Get hotel statistics
   */
  async getHotelStatistics(hotelId: string): Promise<HotelStatistics> {
    const response = await api.get<{ data: HotelStatistics }>(
      HOTEL_ENDPOINTS.STATISTICS(hotelId)
    );
    return response.data.data;
  },

  /**
   * Upload hotel images
   */
  async uploadImages(hotelId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await api.post<{ data: string[] }>(
      `${HOTEL_ENDPOINTS.BASE}/${hotelId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete hotel image
   */
  async deleteImage(hotelId: string, imageId: string): Promise<void> {
    await api.delete(`${HOTEL_ENDPOINTS.BASE}/${hotelId}/images/${imageId}`);
  },

  /**
   * Get all amenities
   */
  async getAmenities(): Promise<Amenity[]> {
    const response = await api.get<{ data: Amenity[] }>(
      HOTEL_ENDPOINTS.AMENITIES
    );
    return response.data.data;
  },

  /**
   * Get nearby hotels
   */
  async getNearbyHotels(
    latitude: number,
    longitude: number,
    radius = 10,
    limit = 5
  ): Promise<HotelSearchResult[]> {
    const response = await api.get<{ data: HotelSearchResult[] }>(
      `${HOTEL_ENDPOINTS.BASE}/nearby`,
      {
        params: { latitude, longitude, radius, limit },
      }
    );
    return response.data.data;
  },
};

export default hotelService;
