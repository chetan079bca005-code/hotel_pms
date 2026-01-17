/**
 * Hotel PMS - Payment Types
 * Types for payment processing and transactions
 */

import { BaseEntity } from './common.types';

// Payment status
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

// Payment method
export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'esewa'
  | 'khalti'
  | 'ime-pay'
  | 'bank-transfer'
  | 'cheque'
  | 'room-charge'
  | 'other';

// Payment entity
export interface Payment extends BaseEntity {
  paymentNumber: string;
  hotelId: string;
  bookingId?: string;
  orderId?: string;
  guestId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  description: string;
  metadata?: PaymentMetadata;
  refund?: RefundDetails;
  processedAt?: string;
  processedBy?: string;
}

// Payment metadata
export interface PaymentMetadata {
  bookingNumber?: string;
  orderNumber?: string;
  guestName?: string;
  roomNumber?: string;
  invoiceNumber?: string;
  notes?: string;
}

// Refund details
export interface RefundDetails {
  amount: number;
  reason: string;
  refundedAt: string;
  refundedBy: string;
  transactionId?: string;
}

// Payment gateway config
export interface PaymentGatewayConfig {
  provider: 'esewa' | 'khalti' | 'ime-pay';
  merchantId: string;
  secretKey: string;
  isTestMode: boolean;
  callbackUrl: string;
  isActive: boolean;
}

// eSewa payment request
export interface ESewaPaymentRequest {
  amount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryCharge: number;
  totalAmount: number;
  productId: string;
  successUrl: string;
  failureUrl: string;
}

// eSewa payment response
export interface ESewaPaymentResponse {
  productId: string;
  totalAmount: number;
  status: string;
  refId: string;
}

// Khalti payment request
export interface KhaltiPaymentRequest {
  amount: number;
  purchaseOrderId: string;
  purchaseOrderName: string;
  returnUrl: string;
  websiteUrl: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Khalti payment response
export interface KhaltiPaymentResponse {
  pidx: string;
  paymentUrl: string;
  expiresAt: string;
}

// IME Pay payment request
export interface IMEPayPaymentRequest {
  amount: number;
  merchantCode: string;
  refId: string;
  tokenId: string;
}

// Create payment request
export interface CreatePaymentRequest {
  bookingId?: string;
  orderId?: string;
  amount: number;
  method: PaymentMethod;
  description?: string;
  metadata?: PaymentMetadata;
}

// Process payment request (for gateway payments)
export interface ProcessPaymentRequest {
  paymentId: string;
  gatewayData: Record<string, unknown>;
}

// Payment search filters
export interface PaymentSearchFilters {
  search?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  bookingId?: string;
  orderId?: string;
  guestId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Invoice
export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  hotelId: string;
  bookingId?: string;
  orderId?: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  dueDate?: string;
  paidAt?: string;
  notes?: string;
}

// Invoice item
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
}

// Payment summary
export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  completedPayments: number;
  completedAmount: number;
  pendingPayments: number;
  pendingAmount: number;
  failedPayments: number;
  refundedAmount: number;
  byMethod: Record<PaymentMethod, { count: number; amount: number }>;
}

// Daily revenue
export interface DailyRevenue {
  date: string;
  roomRevenue: number;
  restaurantRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  paymentCount: number;
}
