import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';

// Types for bookings
export interface Booking {
  id: number;
  userId: number;
  providerId: number;
  slotId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  slot?: {
    id: number;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  };
  provider?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const useUserBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: async () => {
      const response = await $fetchThrow<Booking[]>('/bookings/user');
      return response;
    },
  });
};

export const useProviderBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'provider'],
    queryFn: async () => {
      const response = await $fetchThrow<Booking[]>('/bookings/provider');
      return response;
    },
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (data: { slotId: number }) => {
      const response = await $fetchThrow<Booking>('/bookings', {
        method: 'POST',
        body: data,
      });
      return response;
    },
  });
};

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await $fetchThrow<Booking>(`/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      });
      return response;
    },
  });
};
