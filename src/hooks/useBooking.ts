/**
 * Hotel PMS - useBooking Hook
 * Booking management hook with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { useBookingStore } from '@/store/bookingStore';
import { toastSuccess, toastError } from '@/hooks/use-toast';
import type { 
  CreateBookingRequest, 
  UpdateBookingRequest,
  BookingSearchFilters 
} from '@/types';

/**
 * Query keys for booking data
 */
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: BookingSearchFilters) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  userBookings: (userId: string) => [...bookingKeys.all, 'user', userId] as const,
};

/**
 * useBookings - Fetch list of bookings
 */
export function useBookings(filters?: BookingSearchFilters) {
  return useQuery({
    queryKey: bookingKeys.list(filters || {}),
    queryFn: () => bookingService.getBookings(filters || {}),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * useBooking - Fetch single booking by ID
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
  });
}

/**
 * useUserBookings - Fetch bookings for current user
 */
export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.userBookings(userId),
    queryFn: () => bookingService.getBookings({ guestId: userId }),
    enabled: !!userId,
  });
}

/**
 * useCreateBooking - Create new booking mutation
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { clearBooking } = useBookingStore();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingService.createBooking(data),
    onSuccess: (booking) => {
      // Invalidate booking lists
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      // Reset booking store
      clearBooking();
      
      toastSuccess('Booking confirmed!', `Booking ID: ${booking.bookingNumber}`);
    },
    onError: (error: Error) => {
      toastError('Booking failed', error.message || 'Please try again');
    },
  });
}

/**
 * useUpdateBooking - Update booking mutation
 */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) =>
      bookingService.updateBooking(id, data),
    onSuccess: (booking) => {
      // Update cache
      queryClient.setQueryData(bookingKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toastSuccess('Booking updated', 'Changes have been saved');
    },
    onError: (error: Error) => {
      toastError('Update failed', error.message || 'Please try again');
    },
  });
}

/**
 * useCancelBooking - Cancel booking mutation
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      bookingService.cancelBooking(id, reason),
    onSuccess: (booking) => {
      // Update cache
      queryClient.setQueryData(bookingKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toastSuccess('Booking cancelled', 'Your booking has been cancelled');
    },
    onError: (error: Error) => {
      toastError('Cancellation failed', error.message || 'Please try again');
    },
  });
}

/**
 * useCheckIn - Check-in guest mutation
 */
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, details }: { 
      id: string; 
      details: { 
        idVerified: boolean; 
        idType?: string; 
        idNumber?: string; 
        vehicleNumber?: string; 
      } 
    }) => 
      bookingService.checkIn(id, details),
    onSuccess: (booking) => {
      queryClient.setQueryData(bookingKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toastSuccess('Check-in complete', 'Guest has been checked in');
    },
    onError: (error: Error) => {
      toastError('Check-in failed', error.message || 'Please try again');
    },
  });
}

/**
 * useCheckOut - Check-out guest mutation
 */
export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, details }: { 
      id: string; 
      details: { 
        roomInspected: boolean; 
        minibarCharges?: number; 
        damageCharges?: number; 
        lateCheckoutFee?: number; 
        notes?: string; 
      } 
    }) => 
      bookingService.checkOut(id, details),
    onSuccess: (booking) => {
      queryClient.setQueryData(bookingKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toastSuccess('Check-out complete', 'Guest has been checked out');
    },
    onError: (error: Error) => {
      toastError('Check-out failed', error.message || 'Please try again');
    },
  });
}

/**
 * useBookingFlow - Hook for managing booking flow state
 */
export function useBookingFlow() {
  const store = useBookingStore();
  const createBooking = useCreateBooking();

  // Submit booking
  const submitBooking = async () => {
    const bookingData = store.getBookingData();
    
    if (!bookingData) {
      toastError('Incomplete booking', 'Please complete all required fields');
      return null;
    }

    return createBooking.mutateAsync(bookingData);
  };

  return {
    // State from store
    currentStep: store.currentStep,
    selectedHotel: store.selectedHotel,
    checkInDate: store.checkInDate,
    checkOutDate: store.checkOutDate,
    adults: store.adults,
    children: store.children,
    roomCount: store.roomCount,
    selectedRooms: store.selectedRooms,
    guestDetails: store.guestDetails,
    specialRequests: store.specialRequests,
    grandTotal: store.grandTotal,

    // Actions
    setStep: store.setStep,
    setHotel: store.setHotel,
    setDates: store.setDates,
    setGuests: store.setGuests,
    setGuestDetails: store.setGuestDetails,
    setSpecialRequests: store.setSpecialRequests,
    addRoom: store.addRoom,
    removeRoom: store.removeRoom,
    clearBooking: store.clearBooking,
    submitBooking,
    getNights: store.getNights,

    // Status
    isSubmitting: createBooking.isPending,
    isSuccess: createBooking.isSuccess,
    error: createBooking.error,
  };
}

/**
 * useAvailableRooms - Fetch available rooms for date range
 */
export function useAvailableRooms(
  hotelId: string | undefined,
  checkIn: string | undefined,
  checkOut: string | undefined,
  adults?: number,
  children?: number
) {
  return useQuery({
    queryKey: ['availableRooms', hotelId, checkIn, checkOut, adults, children],
    queryFn: () =>
      bookingService.checkAvailability({
        hotelId: hotelId!,
        checkIn: checkIn!,
        checkOut: checkOut!,
        adults: adults || 1,
        children,
      }),
    enabled: !!hotelId && !!checkIn && !!checkOut,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
