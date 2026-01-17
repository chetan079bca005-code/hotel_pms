/**
 * Hotel PMS - Order Service
 * API calls for food order management
 */

import api from './api';
import {
  Order,
  OrderSearchFilters,
  OrderStatistics,
  KitchenDisplayOrder,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFeedback,
  PaginatedResponse,
} from '@/types';

// API endpoints
const ORDER_ENDPOINTS = {
  BASE: '/orders',
  KITCHEN: '/orders/kitchen-display',
  STATISTICS: '/orders/statistics',
  MY_ORDERS: '/orders/my-orders',
  TRACK: (orderId: string) => `/orders/${orderId}/track`,
  UPDATE_STATUS: (orderId: string) => `/orders/${orderId}/status`,
  FEEDBACK: (orderId: string) => `/orders/${orderId}/feedback`,
  CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
};

/**
 * Order service with all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      ORDER_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/${orderId}`
    );
    return response.data.data;
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/number/${orderNumber}`
    );
    return response.data.data;
  },

  /**
   * Get all orders with filters (admin)
   */
  async getOrders(
    filters: OrderSearchFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Order>> {
    const response = await api.get<{ data: PaginatedResponse<Order> }>(
      ORDER_ENDPOINTS.BASE,
      {
        params: { ...filters, page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Get orders for a specific room
   */
  async getOrdersByRoom(
    roomNumber: string,
    hotelId: string
  ): Promise<Order[]> {
    const response = await api.get<{ data: Order[] }>(
      ORDER_ENDPOINTS.BASE,
      {
        params: { roomNumber, hotelId },
      }
    );
    return response.data.data;
  },

  /**
   * Get user's orders (guest)
   */
  async getMyOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const response = await api.get<{ data: PaginatedResponse<Order> }>(
      ORDER_ENDPOINTS.MY_ORDERS,
      {
        params: { page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Update order
   */
  async updateOrder(
    orderId: string,
    data: UpdateOrderRequest
  ): Promise<Order> {
    const response = await api.patch<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/${orderId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string
  ): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      ORDER_ENDPOINTS.UPDATE_STATUS(orderId),
      { status, notes }
    );
    return response.data.data;
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      ORDER_ENDPOINTS.CANCEL(orderId),
      { reason }
    );
    return response.data.data;
  },

  /**
   * Track order (real-time status)
   */
  async trackOrder(orderId: string): Promise<Order> {
    const response = await api.get<{ data: Order }>(
      ORDER_ENDPOINTS.TRACK(orderId)
    );
    return response.data.data;
  },

  /**
   * Get kitchen display orders
   */
  async getKitchenOrders(): Promise<KitchenDisplayOrder[]> {
    const response = await api.get<{ data: KitchenDisplayOrder[] }>(
      ORDER_ENDPOINTS.KITCHEN
    );
    return response.data.data;
  },

  /**
   * Update order item status (kitchen)
   */
  async updateItemStatus(
    orderId: string,
    itemId: string,
    status: string
  ): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/${orderId}/items/${itemId}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Submit order feedback
   */
  async submitFeedback(
    orderId: string,
    feedback: { rating: number; comment?: string }
  ): Promise<OrderFeedback> {
    const response = await api.post<{ data: OrderFeedback }>(
      ORDER_ENDPOINTS.FEEDBACK(orderId),
      feedback
    );
    return response.data.data;
  },

  /**
   * Get order statistics
   */
  async getStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<OrderStatistics> {
    const response = await api.get<{ data: OrderStatistics }>(
      ORDER_ENDPOINTS.STATISTICS,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  /**
   * Assign order to staff
   */
  async assignOrder(orderId: string, staffId: string): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/${orderId}/assign`,
      { staffId }
    );
    return response.data.data;
  },

  /**
   * Mark order as paid
   */
  async markAsPaid(
    orderId: string,
    paymentMethod: string
  ): Promise<Order> {
    const response = await api.post<{ data: Order }>(
      `${ORDER_ENDPOINTS.BASE}/${orderId}/pay`,
      { paymentMethod }
    );
    return response.data.data;
  },

  /**
   * Get pending orders count
   */
  async getPendingOrdersCount(): Promise<number> {
    const response = await api.get<{ data: { count: number } }>(
      `${ORDER_ENDPOINTS.BASE}/pending-count`
    );
    return response.data.data.count;
  },

  /**
   * Print order ticket
   */
  async printOrderTicket(orderId: string): Promise<Blob> {
    const response = await api.get(
      `${ORDER_ENDPOINTS.BASE}/${orderId}/print`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default orderService;
