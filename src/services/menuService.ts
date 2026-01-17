/**
 * Hotel PMS - Menu Service
 * API calls for restaurant menu management
 */

import api from './api';
import {
  MenuCategory,
  MenuItem,
  MenuQRCode,
  GuestMenuView,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  MenuSearchFilters,
  BulkMenuAvailabilityUpdate,
  PaginatedResponse,
} from '@/types';

// API endpoints
const MENU_ENDPOINTS = {
  CATEGORIES: '/menu/categories',
  ITEMS: '/menu/items',
  QR_CODES: '/menu/qr-codes',
  GUEST_VIEW: (hotelId: string) => `/menu/${hotelId}/view`,
  POPULAR: (hotelId: string) => `/menu/${hotelId}/popular`,
  SEARCH: '/menu/search',
  BULK_AVAILABILITY: '/menu/items/bulk-availability',
};

/**
 * Menu service with all menu-related API calls
 */
export const menuService = {
  // ==================== Category Operations ====================

  /**
   * Get all menu categories
   */
  async getCategories(hotelId: string): Promise<MenuCategory[]> {
    const response = await api.get<{ data: MenuCategory[] }>(
      MENU_ENDPOINTS.CATEGORIES,
      { params: { hotelId } }
    );
    return response.data.data;
  },

  /**
   * Get category by ID
   */
  async getCategory(categoryId: string): Promise<MenuCategory> {
    const response = await api.get<{ data: MenuCategory }>(
      `${MENU_ENDPOINTS.CATEGORIES}/${categoryId}`
    );
    return response.data.data;
  },

  /**
   * Create new category
   */
  async createCategory(data: CreateMenuCategoryRequest): Promise<MenuCategory> {
    const response = await api.post<{ data: MenuCategory }>(
      MENU_ENDPOINTS.CATEGORIES,
      data
    );
    return response.data.data;
  },

  /**
   * Update category
   */
  async updateCategory(
    categoryId: string,
    data: UpdateMenuCategoryRequest
  ): Promise<MenuCategory> {
    const response = await api.patch<{ data: MenuCategory }>(
      `${MENU_ENDPOINTS.CATEGORIES}/${categoryId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string): Promise<void> {
    await api.delete(`${MENU_ENDPOINTS.CATEGORIES}/${categoryId}`);
  },

  /**
   * Reorder categories
   */
  async reorderCategories(
    categoryIds: string[]
  ): Promise<MenuCategory[]> {
    const response = await api.post<{ data: MenuCategory[] }>(
      `${MENU_ENDPOINTS.CATEGORIES}/reorder`,
      { categoryIds }
    );
    return response.data.data;
  },

  // ==================== Menu Item Operations ====================

  /**
   * Get menu items by category
   */
  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const response = await api.get<{ data: MenuItem[] }>(
      MENU_ENDPOINTS.ITEMS,
      { params: { categoryId } }
    );
    return response.data.data;
  },

  /**
   * Get all menu items with filters
   */
  async getItems(
    filters: MenuSearchFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<MenuItem>> {
    const response = await api.get<{ data: PaginatedResponse<MenuItem> }>(
      MENU_ENDPOINTS.ITEMS,
      { params: { ...filters, page, limit } }
    );
    return response.data.data;
  },

  /**
   * Get menu item by ID
   */
  async getItem(itemId: string): Promise<MenuItem> {
    const response = await api.get<{ data: MenuItem }>(
      `${MENU_ENDPOINTS.ITEMS}/${itemId}`
    );
    return response.data.data;
  },

  /**
   * Create new menu item
   */
  async createItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await api.post<{ data: MenuItem }>(
      MENU_ENDPOINTS.ITEMS,
      data
    );
    return response.data.data;
  },

  /**
   * Update menu item
   */
  async updateItem(
    itemId: string,
    data: UpdateMenuItemRequest
  ): Promise<MenuItem> {
    const response = await api.patch<{ data: MenuItem }>(
      `${MENU_ENDPOINTS.ITEMS}/${itemId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete menu item
   */
  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`${MENU_ENDPOINTS.ITEMS}/${itemId}`);
  },

  /**
   * Toggle item availability
   */
  async toggleAvailability(itemId: string): Promise<MenuItem> {
    const response = await api.post<{ data: MenuItem }>(
      `${MENU_ENDPOINTS.ITEMS}/${itemId}/toggle-availability`
    );
    return response.data.data;
  },

  /**
   * Bulk update availability
   */
  async bulkUpdateAvailability(
    data: BulkMenuAvailabilityUpdate
  ): Promise<MenuItem[]> {
    const response = await api.post<{ data: MenuItem[] }>(
      MENU_ENDPOINTS.BULK_AVAILABILITY,
      data
    );
    return response.data.data;
  },

  /**
   * Upload item images
   */
  async uploadItemImages(itemId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await api.post<{ data: string[] }>(
      `${MENU_ENDPOINTS.ITEMS}/${itemId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // ==================== Guest Menu View ====================

  /**
   * Get guest menu view (for QR code access)
   */
  async getGuestMenuView(hotelId: string): Promise<GuestMenuView> {
    const response = await api.get<{ data: GuestMenuView }>(
      MENU_ENDPOINTS.GUEST_VIEW(hotelId)
    );
    return response.data.data;
  },

  /**
   * Get popular menu items
   */
  async getPopularItems(hotelId: string, limit = 10): Promise<MenuItem[]> {
    const response = await api.get<{ data: MenuItem[] }>(
      MENU_ENDPOINTS.POPULAR(hotelId),
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Search menu items
   */
  async searchItems(
    hotelId: string,
    query: string
  ): Promise<MenuItem[]> {
    const response = await api.get<{ data: MenuItem[] }>(
      MENU_ENDPOINTS.SEARCH,
      { params: { hotelId, query } }
    );
    return response.data.data;
  },

  // ==================== QR Code Operations ====================

  /**
   * Get all QR codes for hotel
   */
  async getQRCodes(hotelId: string): Promise<MenuQRCode[]> {
    const response = await api.get<{ data: MenuQRCode[] }>(
      MENU_ENDPOINTS.QR_CODES,
      { params: { hotelId } }
    );
    return response.data.data;
  },

  /**
   * Generate QR code
   */
  async generateQRCode(data: {
    hotelId: string;
    type: 'room' | 'table' | 'general';
    identifier: string;
  }): Promise<MenuQRCode> {
    const response = await api.post<{ data: MenuQRCode }>(
      MENU_ENDPOINTS.QR_CODES,
      data
    );
    return response.data.data;
  },

  /**
   * Regenerate QR code
   */
  async regenerateQRCode(qrCodeId: string): Promise<MenuQRCode> {
    const response = await api.post<{ data: MenuQRCode }>(
      `${MENU_ENDPOINTS.QR_CODES}/${qrCodeId}/regenerate`
    );
    return response.data.data;
  },

  /**
   * Delete QR code
   */
  async deleteQRCode(qrCodeId: string): Promise<void> {
    await api.delete(`${MENU_ENDPOINTS.QR_CODES}/${qrCodeId}`);
  },

  /**
   * Download QR code as image
   */
  async downloadQRCode(qrCodeId: string): Promise<Blob> {
    const response = await api.get(
      `${MENU_ENDPOINTS.QR_CODES}/${qrCodeId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Bulk generate QR codes for rooms
   */
  async bulkGenerateQRCodes(
    hotelId: string,
    roomNumbers: string[]
  ): Promise<MenuQRCode[]> {
    const response = await api.post<{ data: MenuQRCode[] }>(
      `${MENU_ENDPOINTS.QR_CODES}/bulk-generate`,
      { hotelId, roomNumbers }
    );
    return response.data.data;
  },
};

export default menuService;
