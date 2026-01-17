/**
 * Hotel PMS - Booking Store
 * Zustand store for booking flow state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Hotel,
  RoomType,
  RoomRate,
  RoomSelection,
  GuestDetails,
  BookingSource,
} from '@/types';

// Booking step type
export type BookingStep = 
  | 'search'
  | 'rooms'
  | 'details'
  | 'payment'
  | 'confirmation';

// Booking store state interface
interface BookingState {
  // State
  currentStep: BookingStep;
  selectedHotel: Hotel | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  adults: number;
  children: number;
  roomCount: number;
  selectedRooms: SelectedRoom[];
  guestDetails: GuestDetails | null;
  specialRequests: string;
  discountCode: string;
  source: BookingSource;
  
  // Pricing
  roomTotal: number;
  taxAmount: number;
  serviceCharge: number;
  discount: number;
  grandTotal: number;

  // Actions
  setStep: (step: BookingStep) => void;
  setHotel: (hotel: Hotel) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number) => void;
  setRoomCount: (count: number) => void;
  addRoom: (room: SelectedRoom) => void;
  removeRoom: (roomTypeId: string) => void;
  updateRoomQuantity: (roomTypeId: string, quantity: number) => void;
  setGuestDetails: (details: GuestDetails) => void;
  setSpecialRequests: (requests: string) => void;
  setDiscountCode: (code: string) => void;
  calculatePricing: () => void;
  clearBooking: () => void;
  getNights: () => number;
  getBookingData: () => BookingData | null;
}

// Selected room with rate
interface SelectedRoom {
  roomType: RoomType;
  rate: RoomRate;
  quantity: number;
  pricePerNight: number;
  totalPrice: number;
}

// Booking data for API
interface BookingData {
  hotelId: string;
  roomSelections: RoomSelection[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestDetails: GuestDetails;
  specialRequests?: string;
  discountCode?: string;
  source: BookingSource;
}

// Tax rate (example: 13% VAT for Nepal)
const TAX_RATE = 0.13;
// Service charge rate
const SERVICE_CHARGE_RATE = 0.10;

/**
 * Calculate number of nights between dates
 */
const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Booking store with persistence
 * Manages the booking flow state
 */
export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'search',
      selectedHotel: null,
      checkInDate: null,
      checkOutDate: null,
      adults: 2,
      children: 0,
      roomCount: 1,
      selectedRooms: [],
      guestDetails: null,
      specialRequests: '',
      discountCode: '',
      source: 'website',
      
      roomTotal: 0,
      taxAmount: 0,
      serviceCharge: 0,
      discount: 0,
      grandTotal: 0,

      /**
       * Set current booking step
       */
      setStep: (step: BookingStep) => {
        set({ currentStep: step });
      },

      /**
       * Set selected hotel
       */
      setHotel: (hotel: Hotel) => {
        set({ selectedHotel: hotel });
      },

      /**
       * Set check-in and check-out dates
       */
      setDates: (checkIn: string, checkOut: string) => {
        set({ checkInDate: checkIn, checkOutDate: checkOut });
        
        // Recalculate pricing when dates change
        get().calculatePricing();
      },

      /**
       * Set number of guests
       */
      setGuests: (adults: number, children: number) => {
        set({ adults, children });
      },

      /**
       * Set number of rooms needed
       */
      setRoomCount: (count: number) => {
        set({ roomCount: count });
      },

      /**
       * Add a room selection
       */
      addRoom: (room: SelectedRoom) => {
        set((state) => {
          // Check if room type already selected
          const existingIndex = state.selectedRooms.findIndex(
            (r) => r.roomType.id === room.roomType.id
          );

          let newRooms: SelectedRoom[];

          if (existingIndex >= 0) {
            // Update existing room
            newRooms = [...state.selectedRooms];
            newRooms[existingIndex] = room;
          } else {
            // Add new room
            newRooms = [...state.selectedRooms, room];
          }

          return { selectedRooms: newRooms };
        });

        // Recalculate pricing
        get().calculatePricing();
      },

      /**
       * Remove a room selection
       */
      removeRoom: (roomTypeId: string) => {
        set((state) => ({
          selectedRooms: state.selectedRooms.filter(
            (r) => r.roomType.id !== roomTypeId
          ),
        }));

        // Recalculate pricing
        get().calculatePricing();
      },

      /**
       * Update room quantity
       */
      updateRoomQuantity: (roomTypeId: string, quantity: number) => {
        const { checkInDate, checkOutDate } = get();
        
        if (quantity <= 0) {
          get().removeRoom(roomTypeId);
          return;
        }

        set((state) => {
          const newRooms = state.selectedRooms.map((room) => {
            if (room.roomType.id === roomTypeId) {
              const nights = checkInDate && checkOutDate 
                ? calculateNights(checkInDate, checkOutDate) 
                : 1;
              
              return {
                ...room,
                quantity,
                totalPrice: room.pricePerNight * quantity * nights,
              };
            }
            return room;
          });

          return { selectedRooms: newRooms };
        });

        // Recalculate pricing
        get().calculatePricing();
      },

      /**
       * Set guest details
       */
      setGuestDetails: (details: GuestDetails) => {
        set({ guestDetails: details });
      },

      /**
       * Set special requests
       */
      setSpecialRequests: (requests: string) => {
        set({ specialRequests: requests });
      },

      /**
       * Set discount code
       */
      setDiscountCode: (code: string) => {
        set({ discountCode: code });
        // You would typically validate the code here
        // and apply the discount
      },

      /**
       * Calculate pricing based on selected rooms
       */
      calculatePricing: () => {
        const { selectedRooms } = get();

        // Calculate room total
        const roomTotal = selectedRooms.reduce(
          (sum, room) => sum + room.totalPrice,
          0
        );

        // Calculate tax
        const taxAmount = roomTotal * TAX_RATE;

        // Calculate service charge
        const serviceCharge = roomTotal * SERVICE_CHARGE_RATE;

        // Calculate grand total
        const grandTotal = roomTotal + taxAmount + serviceCharge;

        set({
          roomTotal,
          taxAmount,
          serviceCharge,
          grandTotal,
        });
      },

      /**
       * Clear all booking data
       */
      clearBooking: () => {
        set({
          currentStep: 'search',
          selectedHotel: null,
          checkInDate: null,
          checkOutDate: null,
          adults: 2,
          children: 0,
          roomCount: 1,
          selectedRooms: [],
          guestDetails: null,
          specialRequests: '',
          discountCode: '',
          roomTotal: 0,
          taxAmount: 0,
          serviceCharge: 0,
          discount: 0,
          grandTotal: 0,
        });
      },

      /**
       * Get number of nights
       */
      getNights: (): number => {
        const { checkInDate, checkOutDate } = get();
        
        if (!checkInDate || !checkOutDate) return 0;
        
        return calculateNights(checkInDate, checkOutDate);
      },

      /**
       * Get booking data for API submission
       */
      getBookingData: (): BookingData | null => {
        const {
          selectedHotel,
          selectedRooms,
          checkInDate,
          checkOutDate,
          adults,
          children,
          guestDetails,
          specialRequests,
          discountCode,
          source,
        } = get();

        if (!selectedHotel || !checkInDate || !checkOutDate || !guestDetails) {
          return null;
        }

        if (selectedRooms.length === 0) {
          return null;
        }

        return {
          hotelId: selectedHotel.id,
          roomSelections: selectedRooms.map((room) => ({
            roomTypeId: room.roomType.id,
            rateId: room.rate.id,
            quantity: room.quantity,
          })),
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults,
          children,
          guestDetails,
          specialRequests: specialRequests || undefined,
          discountCode: discountCode || undefined,
          source,
        };
      },
    }),
    {
      name: 'hotel-pms-booking',
      storage: createJSONStorage(() => sessionStorage), // Use session storage
      partialize: (state) => ({
        selectedHotel: state.selectedHotel,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        adults: state.adults,
        children: state.children,
        roomCount: state.roomCount,
        selectedRooms: state.selectedRooms,
        guestDetails: state.guestDetails,
        specialRequests: state.specialRequests,
        discountCode: state.discountCode,
      }),
    }
  )
);

export default useBookingStore;
