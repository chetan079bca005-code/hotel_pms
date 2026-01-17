/**
 * Hotel PMS - Payment Service
 * API calls for payment processing
 */

import api from './api';
import {
  Payment,
  PaymentSearchFilters,
  PaymentSummary,
  CreatePaymentRequest,
  ESewaPaymentRequest,
  ESewaPaymentResponse,
  KhaltiPaymentRequest,
  KhaltiPaymentResponse,
  Invoice,
  DailyRevenue,
  PaginatedResponse,
} from '@/types';

// API endpoints
const PAYMENT_ENDPOINTS = {
  BASE: '/payments',
  ESEWA: '/payments/esewa',
  KHALTI: '/payments/khalti',
  IME_PAY: '/payments/ime-pay',
  VERIFY: (id: string) => `/payments/${id}/verify`,
  REFUND: (id: string) => `/payments/${id}/refund`,
  INVOICES: '/invoices',
  SUMMARY: '/payments/summary',
  REVENUE: '/payments/revenue',
};

/**
 * Payment service with all payment-related API calls
 */
export const paymentService = {
  /**
   * Create a payment record
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await api.post<{ data: Payment }>(
      PAYMENT_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment> {
    const response = await api.get<{ data: Payment }>(
      `${PAYMENT_ENDPOINTS.BASE}/${paymentId}`
    );
    return response.data.data;
  },

  /**
   * Get all payments with filters
   */
  async getPayments(
    filters: PaymentSearchFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Payment>> {
    const response = await api.get<{ data: PaginatedResponse<Payment> }>(
      PAYMENT_ENDPOINTS.BASE,
      {
        params: { ...filters, page, limit },
      }
    );
    return response.data.data;
  },

  /**
   * Get payments for a booking
   */
  async getBookingPayments(bookingId: string): Promise<Payment[]> {
    const response = await api.get<{ data: Payment[] }>(
      PAYMENT_ENDPOINTS.BASE,
      {
        params: { bookingId },
      }
    );
    return response.data.data;
  },

  // ==================== eSewa Integration ====================

  /**
   * Initiate eSewa payment
   */
  async initiateESewaPayment(
    data: ESewaPaymentRequest
  ): Promise<{ paymentUrl: string; formData: Record<string, string> }> {
    const response = await api.post<{
      data: { paymentUrl: string; formData: Record<string, string> };
    }>(`${PAYMENT_ENDPOINTS.ESEWA}/initiate`, data);
    return response.data.data;
  },

  /**
   * Verify eSewa payment
   */
  async verifyESewaPayment(
    data: ESewaPaymentResponse
  ): Promise<Payment> {
    const response = await api.post<{ data: Payment }>(
      `${PAYMENT_ENDPOINTS.ESEWA}/verify`,
      data
    );
    return response.data.data;
  },

  // ==================== Khalti Integration ====================

  /**
   * Initiate Khalti payment
   */
  async initiateKhaltiPayment(
    data: KhaltiPaymentRequest
  ): Promise<KhaltiPaymentResponse> {
    const response = await api.post<{ data: KhaltiPaymentResponse }>(
      `${PAYMENT_ENDPOINTS.KHALTI}/initiate`,
      data
    );
    return response.data.data;
  },

  /**
   * Verify Khalti payment
   */
  async verifyKhaltiPayment(pidx: string): Promise<Payment> {
    const response = await api.post<{ data: Payment }>(
      `${PAYMENT_ENDPOINTS.KHALTI}/verify`,
      { pidx }
    );
    return response.data.data;
  },

  // ==================== IME Pay Integration ====================

  /**
   * Initiate IME Pay payment
   */
  async initiateIMEPayPayment(data: {
    amount: number;
    orderId: string;
  }): Promise<{ paymentUrl: string }> {
    const response = await api.post<{ data: { paymentUrl: string } }>(
      `${PAYMENT_ENDPOINTS.IME_PAY}/initiate`,
      data
    );
    return response.data.data;
  },

  /**
   * Verify IME Pay payment
   */
  async verifyIMEPayPayment(transactionId: string): Promise<Payment> {
    const response = await api.post<{ data: Payment }>(
      `${PAYMENT_ENDPOINTS.IME_PAY}/verify`,
      { transactionId }
    );
    return response.data.data;
  },

  // ==================== Refunds ====================

  /**
   * Process refund
   */
  async processRefund(
    paymentId: string,
    data: { amount: number; reason: string }
  ): Promise<Payment> {
    const response = await api.post<{ data: Payment }>(
      PAYMENT_ENDPOINTS.REFUND(paymentId),
      data
    );
    return response.data.data;
  },

  // ==================== Invoices ====================

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await api.get<{ data: Invoice }>(
      `${PAYMENT_ENDPOINTS.INVOICES}/${invoiceId}`
    );
    return response.data.data;
  },

  /**
   * Generate invoice for booking
   */
  async generateInvoice(bookingId: string): Promise<Invoice> {
    const response = await api.post<{ data: Invoice }>(
      PAYMENT_ENDPOINTS.INVOICES,
      { bookingId }
    );
    return response.data.data;
  },

  /**
   * Download invoice PDF
   */
  async downloadInvoicePDF(invoiceId: string): Promise<Blob> {
    const response = await api.get(
      `${PAYMENT_ENDPOINTS.INVOICES}/${invoiceId}/pdf`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Send invoice email
   */
  async sendInvoiceEmail(invoiceId: string, email: string): Promise<void> {
    await api.post(`${PAYMENT_ENDPOINTS.INVOICES}/${invoiceId}/send`, {
      email,
    });
  },

  // ==================== Reports ====================

  /**
   * Get payment summary
   */
  async getPaymentSummary(
    startDate?: string,
    endDate?: string
  ): Promise<PaymentSummary> {
    const response = await api.get<{ data: PaymentSummary }>(
      PAYMENT_ENDPOINTS.SUMMARY,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  /**
   * Get daily revenue
   */
  async getDailyRevenue(
    startDate: string,
    endDate: string
  ): Promise<DailyRevenue[]> {
    const response = await api.get<{ data: DailyRevenue[] }>(
      PAYMENT_ENDPOINTS.REVENUE,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  /**
   * Export payments report
   */
  async exportPaymentsReport(
    format: 'pdf' | 'excel' | 'csv',
    filters: PaymentSearchFilters
  ): Promise<Blob> {
    const response = await api.get(
      `${PAYMENT_ENDPOINTS.BASE}/export`,
      {
        params: { format, ...filters },
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default paymentService;
