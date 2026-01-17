/**
 * Hotel PMS - Order Types
 * Types for food orders and order management
 */

import { BaseEntity } from './common.types';
import { MenuItem, MenuItemCustomization, MenuItemAddon } from './menu.types';

// Order status
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

// Order type
export type OrderType = 'room-service' | 'dine-in' | 'takeaway';

// Order entity
export interface Order extends BaseEntity {
  orderNumber: string;
  hotelId: string;
  guestId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  roomNumber?: string;
  tableNumber?: string;
  orderType: OrderType;
  items: OrderItem[];
  status: OrderStatus;
  specialInstructions?: string;
  pricing: OrderPricing;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  estimatedTime: number; // in minutes
  actualDeliveryTime?: string;
  assignedTo?: string; // Staff ID
  statusHistory: OrderStatusHistory[];
  feedback?: OrderFeedback;
}

// Order item
export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedCustomizations: SelectedCustomization[];
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
  status: OrderItemStatus;
}

// Order item status
export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

// Selected customization
export interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
}

// Selected addon
export interface SelectedAddon {
  addonId: string;
  addonName: string;
  price: number;
  quantity: number;
}

// Order pricing
export interface OrderPricing {
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  serviceCharge: number;
  deliveryCharge: number;
  discount: number;
  discountCode?: string;
  grandTotal: number;
  currency: string;
}

// Order status history
export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy?: string;
  notes?: string;
}

// Order feedback
export interface OrderFeedback {
  rating: number;
  comment?: string;
  submittedAt: string;
}

// Cart item (for guest ordering)
export interface CartItem {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
  totalPrice: number;
}

// Cart state
export interface CartState {
  hotelId: string | null;
  roomNumber: string | null;
  tableNumber: string | null;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  
  // Actions
  setHotelId: (hotelId: string) => void;
  setRoomNumber: (roomNumber: string) => void;
  setTableNumber: (tableNumber: string) => void;
  setOrderType: (orderType: OrderType) => void;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

// Create order request
export interface CreateOrderRequest {
  hotelId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  roomNumber?: string;
  tableNumber?: string;
  orderType: OrderType;
  items: CreateOrderItemRequest[];
  specialInstructions?: string;
  discountCode?: string;
}

// Create order item request
export interface CreateOrderItemRequest {
  menuItemId: string;
  quantity: number;
  selectedCustomizations?: {
    customizationId: string;
    optionId: string;
  }[];
  selectedAddons?: {
    addonId: string;
    quantity: number;
  }[];
  specialInstructions?: string;
}

// Update order request
export interface UpdateOrderRequest {
  status?: OrderStatus;
  assignedTo?: string;
  estimatedTime?: number;
}

// Order search filters
export interface OrderSearchFilters {
  search?: string;
  status?: OrderStatus | OrderStatus[];
  orderType?: OrderType;
  roomNumber?: string;
  tableNumber?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
}

// Order statistics
export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averagePreparationTime: number;
  topSellingItems: TopSellingItem[];
}

// Top selling item
export interface TopSellingItem {
  menuItemId: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
}

// Kitchen display order (for kitchen view)
export interface KitchenDisplayOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  roomNumber?: string;
  tableNumber?: string;
  items: KitchenDisplayItem[];
  status: OrderStatus;
  createdAt: string;
  elapsedTime: number; // in seconds
  priority: 'normal' | 'rush';
}

// Kitchen display item
export interface KitchenDisplayItem {
  id: string;
  name: string;
  quantity: number;
  customizations: string[];
  specialInstructions?: string;
  status: OrderItemStatus;
}

// Order notification
export interface OrderNotification {
  orderId: string;
  orderNumber: string;
  type: 'new' | 'status-update' | 'cancelled';
  message: string;
  timestamp: string;
}
