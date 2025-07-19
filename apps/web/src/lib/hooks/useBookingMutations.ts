import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings-api';
import type { BookingCreateData } from '../api/bookings-api';

export const useBookingMutations = () => {
  const queryClient = useQueryClient();

  const createBooking = useMutation({
    mutationFn: (data: BookingCreateData) => bookingsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
    },
  });

  const createBookingOptimistic = useMutation({
    mutationFn: (data: BookingCreateData) => bookingsApi.createBooking(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['timeSlots'] });
      const previousTimeSlots = queryClient.getQueryData(['timeSlots']);
      return { previousTimeSlots };
    },
    onError: (_, __, context) => {
      if (context?.previousTimeSlots) {
        queryClient.setQueryData(['timeSlots'], context.previousTimeSlots);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: number; status: string }) => 
      bookingsApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'provider'] });
    },
  });

  return {
    createBooking,
    createBookingOptimistic,
    updateBookingStatus,
  };
};
