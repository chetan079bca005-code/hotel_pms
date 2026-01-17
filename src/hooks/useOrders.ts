/**
 * Hotel PMS - useOrders Hook
 * Order management hook with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useCartStore } from '@/store/cartStore';
import { toastSuccess, toastError } from '@/hooks/use-toast';
import type { 
  CreateOrderRequest, 
  UpdateOrderRequest,
  OrderSearchFilters, 
  OrderStatus 
} from '@/types';

/**
 * Query keys for order data
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderSearchFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  userOrders: (guestId: string) => [...orderKeys.all, 'user', guestId] as const,
};

/**
 * useOrders - Fetch list of orders with filters
 */
export function useOrders(filters?: OrderSearchFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters || {}),
    queryFn: () => orderService.getOrders(filters || {}),
    staleTime: 30 * 1000, // 30 seconds - orders change frequently
  });
}

/**
 * useOrder - Fetch single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    refetchInterval: 10 * 1000, // Poll every 10 seconds for status updates
  });
}

/**
 * useOrderByNumber - Fetch order by order number
 */
export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: ['orderByNumber', orderNumber],
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
    refetchInterval: 10 * 1000,
  });
}

/**
 * useUserOrders - Fetch orders for a specific room
 */
export function useUserOrders(roomNumber: string, hotelId: string) {
  return useQuery({
    queryKey: orderKeys.userOrders(roomNumber),
    queryFn: () => orderService.getOrdersByRoom(roomNumber, hotelId),
    enabled: !!roomNumber && !!hotelId,
  });
}

/**
 * useCreateOrder - Create new order mutation
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: (order) => {
      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Clear cart after successful order
      clearCart();
      
      toastSuccess('Order placed!', `Order #${order.orderNumber} has been submitted`);
    },
    onError: (error: Error) => {
      toastError('Order failed', error.message || 'Please try again');
    },
  });
}

/**
 * useUpdateOrder - Update order mutation
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      orderService.updateOrder(id, data),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      toastSuccess('Order updated', 'Changes have been saved');
    },
    onError: (error: Error) => {
      toastError('Update failed', error.message || 'Please try again');
    },
  });
}

/**
 * useUpdateOrderStatus - Update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      toastSuccess('Status updated', `Order status changed to ${order.status}`);
    },
    onError: (error: Error) => {
      toastError('Update failed', error.message || 'Please try again');
    },
  });
}

/**
 * useCancelOrder - Cancel order mutation
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      toastSuccess('Order cancelled', 'Your order has been cancelled');
    },
    onError: (error: Error) => {
      toastError('Cancellation failed', error.message || 'Please try again');
    },
  });
}

/**
 * useCart - Hook for managing cart state
 */
export function useCart() {
  const store = useCartStore();
  const createOrder = useCreateOrder();

  // Calculate totals
  const itemCount = store.getItemCount();
  const cartTotal = store.getCartTotal();

  // Submit order from cart
  const submitOrder = async () => {
    if (store.items.length === 0) {
      toastError('Empty cart', 'Please add items to your cart');
      return null;
    }

    if (!store.hotelId) {
      toastError('Hotel not selected', 'Please scan a QR code to select a hotel');
      return null;
    }

    const orderData: CreateOrderRequest = {
      hotelId: store.hotelId,
      orderType: store.orderType,
      roomNumber: store.roomNumber || undefined,
      tableNumber: store.tableNumber || undefined,
      guestName: store.guestName || 'Guest',
      guestPhone: store.guestPhone || '',
      guestEmail: store.guestEmail || undefined,
      items: store.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        customizations: item.selectedCustomizations,
        addons: item.selectedAddons,
        specialInstructions: item.specialInstructions,
      })),
      specialInstructions: store.specialInstructions || undefined,
    };

    return createOrder.mutateAsync(orderData);
  };

  return {
    // Cart state
    hotelId: store.hotelId,
    roomNumber: store.roomNumber,
    tableNumber: store.tableNumber,
    orderType: store.orderType,
    items: store.items,
    guestName: store.guestName,
    guestPhone: store.guestPhone,
    guestEmail: store.guestEmail,
    specialInstructions: store.specialInstructions,
    
    // Computed
    itemCount,
    cartTotal,
    subtotal: store.subtotal,

    // Actions
    setHotelId: store.setHotelId,
    setRoomNumber: store.setRoomNumber,
    setTableNumber: store.setTableNumber,
    setOrderType: store.setOrderType,
    setGuestInfo: store.setGuestInfo,
    setSpecialInstructions: store.setSpecialInstructions,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    submitOrder,

    // Status
    isSubmitting: createOrder.isPending,
    isSuccess: createOrder.isSuccess,
    orderError: createOrder.error,
  };
}

/**
 * useKitchenOrders - Fetch orders for kitchen display
 */
export function useKitchenOrders() {
  return useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: () => orderService.getKitchenOrders(),
    refetchInterval: 5 * 1000, // Poll every 5 seconds
  });
}

/**
 * useOrderStatistics - Fetch order statistics
 */
export function useOrderStatistics(dateRange?: { from: string; to: string }) {
  return useQuery({
    queryKey: ['orderStats', dateRange],
    queryFn: () => orderService.getStatistics(dateRange?.from, dateRange?.to),
    staleTime: 5 * 60 * 1000,
  });
}
