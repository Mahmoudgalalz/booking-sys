import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import type { ApiResponse } from '../lib/types/auth';

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

export interface PaginatedBookings {
  data: Booking[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export interface BackendPaginatedBookings {
  items: Booking[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const useUserBookings = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['bookings', 'user', page, limit],
    queryFn: async () => {
      const response = await $fetchThrow<ApiResponse<BackendPaginatedBookings>>(`/bookings/me?page=${page}&limit=${limit}`);
      // Transform the backend response to match the expected format in the component
      return {
        data: response.data.items,
        meta: {
          total: response.data.meta.totalItems,
          currentPage: response.data.meta.currentPage,
          lastPage: response.data.meta.totalPages,
          perPage: response.data.meta.itemsPerPage
        }
      };
    },
  });
};

export const useProviderBookings = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['bookings', 'provider', page, limit],
    queryFn: async () => {
      const response = await $fetchThrow<ApiResponse<BackendPaginatedBookings>>(`/bookings/provider?page=${page}&limit=${limit}`);
      // Transform the backend response to match the expected format in the component
      return {
        data: response.data.items,
        meta: {
          total: response.data.meta.totalItems,
          currentPage: response.data.meta.currentPage,
          lastPage: response.data.meta.totalPages,
          perPage: response.data.meta.itemsPerPage
        }
      };
    },
  });
};

export interface CreateBookingData {
  slotId: number;
}

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      const response = await $fetchThrow<ApiResponse<Booking>>('/bookings', {
        method: 'POST',
        body: data,
      });
      return response.data;
    },
  });
};

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await $fetchThrow<ApiResponse<Booking>>(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });
      return response.data;
    },
  });
};
