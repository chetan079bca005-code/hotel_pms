/**
 * Hotel PMS - Cart Store
 * Zustand store for restaurant order cart management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CartItem,
  MenuItem,
  OrderType,
  SelectedCustomization,
  SelectedAddon,
} from '@/types';

// Cart store state interface
interface CartState {
  // State
  hotelId: string | null;
  roomNumber: string | null;
  tableNumber: string | null;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialInstructions: string;

  // Actions
  setHotelId: (hotelId: string) => void;
  setRoomNumber: (roomNumber: string | null) => void;
  setTableNumber: (tableNumber: string | null) => void;
  setOrderType: (orderType: OrderType) => void;
  setGuestInfo: (info: { name?: string; phone?: string; email?: string }) => void;
  setSpecialInstructions: (instructions: string) => void;
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    customizations?: SelectedCustomization[],
    addons?: SelectedAddon[],
    specialInstructions?: string
  ) => void;
  removeItem: (cartItemIndex: number) => void;
  updateQuantity: (cartItemIndex: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
}

/**
 * Calculate total price for a cart item
 */
const calculateItemTotal = (
  menuItem: MenuItem,
  quantity: number,
  customizations: SelectedCustomization[] = [],
  addons: SelectedAddon[] = []
): number => {
  // Base price (use discount price if available)
  let itemPrice = menuItem.discountPrice || menuItem.price;

  // Add customization price modifiers
  const customizationTotal = customizations.reduce(
    (sum, c) => sum + c.priceModifier,
    0
  );

  // Add addon prices
  const addonTotal = addons.reduce(
    (sum, a) => sum + a.price * a.quantity,
    0
  );

  // Calculate total
  return (itemPrice + customizationTotal + addonTotal) * quantity;
};

/**
 * Cart store with persistence
 * Manages shopping cart for restaurant orders
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      hotelId: null,
      roomNumber: null,
      tableNumber: null,
      orderType: 'room-service',
      items: [],
      subtotal: 0,
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      specialInstructions: '',

      /**
       * Set hotel ID for the cart
       */
      setHotelId: (hotelId: string) => {
        const currentHotelId = get().hotelId;
        
        // If changing hotels, clear the cart
        if (currentHotelId && currentHotelId !== hotelId) {
          set({
            hotelId,
            items: [],
            subtotal: 0,
            roomNumber: null,
            tableNumber: null,
          });
        } else {
          set({ hotelId });
        }
      },

      /**
       * Set room number for room service
       */
      setRoomNumber: (roomNumber: string | null) => {
        set({ roomNumber, tableNumber: null, orderType: 'room-service' });
      },

      /**
       * Set table number for dine-in
       */
      setTableNumber: (tableNumber: string | null) => {
        set({ tableNumber, roomNumber: null, orderType: 'dine-in' });
      },

      /**
       * Set order type
       */
      setOrderType: (orderType: OrderType) => {
        set({ orderType });
      },

      /**
       * Set guest information
       */
      setGuestInfo: (info: { name?: string; phone?: string; email?: string }) => {
        set((state) => ({
          guestName: info.name ?? state.guestName,
          guestPhone: info.phone ?? state.guestPhone,
          guestEmail: info.email ?? state.guestEmail,
        }));
      },

      /**
       * Set special instructions for the order
       */
      setSpecialInstructions: (instructions: string) => {
        set({ specialInstructions: instructions });
      },

      /**
       * Add item to cart
       */
      addItem: (
        menuItem: MenuItem,
        quantity: number,
        customizations: SelectedCustomization[] = [],
        addons: SelectedAddon[] = [],
        specialInstructions?: string
      ) => {
        const totalPrice = calculateItemTotal(
          menuItem,
          quantity,
          customizations,
          addons
        );

        const newItem: CartItem = {
          menuItemId: menuItem.id,
          menuItem,
          quantity,
          selectedCustomizations: customizations,
          selectedAddons: addons,
          specialInstructions,
          totalPrice,
        };

        set((state) => {
          // Check if same item with same customizations exists
          const existingIndex = state.items.findIndex(
            (item) =>
              item.menuItemId === menuItem.id &&
              JSON.stringify(item.selectedCustomizations) ===
                JSON.stringify(customizations) &&
              JSON.stringify(item.selectedAddons) === JSON.stringify(addons)
          );

          let newItems: CartItem[];

          if (existingIndex >= 0) {
            // Update existing item quantity
            newItems = [...state.items];
            const existingItem = newItems[existingIndex];
            const newQuantity = existingItem.quantity + quantity;
            
            newItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
              totalPrice: calculateItemTotal(
                menuItem,
                newQuantity,
                customizations,
                addons
              ),
            };
          } else {
            // Add new item
            newItems = [...state.items, newItem];
          }

          // Calculate new subtotal
          const subtotal = newItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          return { items: newItems, subtotal };
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (cartItemIndex: number) => {
        set((state) => {
          const newItems = state.items.filter(
            (_, index) => index !== cartItemIndex
          );
          
          const subtotal = newItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          return { items: newItems, subtotal };
        });
      },

      /**
       * Update item quantity
       */
      updateQuantity: (cartItemIndex: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemIndex);
          return;
        }

        set((state) => {
          const newItems = [...state.items];
          const item = newItems[cartItemIndex];

          if (item) {
            newItems[cartItemIndex] = {
              ...item,
              quantity,
              totalPrice: calculateItemTotal(
                item.menuItem,
                quantity,
                item.selectedCustomizations,
                item.selectedAddons
              ),
            };
          }

          const subtotal = newItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          return { items: newItems, subtotal };
        });
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          specialInstructions: '',
        });
      },

      /**
       * Get total number of items in cart
       */
      getItemCount: (): number => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Get cart total with all calculations
       */
      getCartTotal: (): number => {
        return get().subtotal;
      },
    }),
    {
      name: 'hotel-pms-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hotelId: state.hotelId,
        roomNumber: state.roomNumber,
        tableNumber: state.tableNumber,
        orderType: state.orderType,
        items: state.items,
        subtotal: state.subtotal,
        guestName: state.guestName,
        guestPhone: state.guestPhone,
        guestEmail: state.guestEmail,
      }),
    }
  )
);

export default useCartStore;
