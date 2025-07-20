import { api } from './client';
import type { ApiResponse } from '../types/auth';
import { useQuery } from '@tanstack/react-query';

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlotCreateData {
  date: string;
  startTime: string;
  endTime: string;
  interval: number;
}

export interface BookableInterval {
  id: string;
  slotId: number;
  startTime: string;
  endTime: string;
  booked: boolean;
  serviceId: number;
  service: {
    id: number;
    title: string;
    duration: number;
  };
}

export const timeSlotsApi = {
  getTimeSlotsByService: async (serviceId: number, date: string, page = 1, limit = 10): Promise<PaginatedResponse<TimeSlot>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<TimeSlot>>>(`/time-slots/by-date?serviceId=${serviceId}&date=${date}&page=${page}&limit=${limit}`);
      // Ensure we always return a valid response, even if data is missing
      return response.data?.data || {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page
        }
      };
    } catch (error) {
      // Return empty response on error instead of throwing
      console.error('Error fetching time slots:', error);
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page
        }
      };
    }
  },

  getProviderTimeSlots: async (page = 1, limit = 10, date?: string): Promise<PaginatedResponse<TimeSlot>> => {
    try {
      let url = `/providers/time-slots?page=${page}&limit=${limit}`;
      if (date) url += `&date=${date}`;
      const response = await api.get<ApiResponse<PaginatedResponse<TimeSlot>>>(url);
      // Ensure we always return a valid response, even if data is missing
      return response.data?.data || {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page
        }
      };
    } catch (error) {
      // Return empty response on error instead of throwing
      console.error('Error fetching provider time slots:', error);
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page
        }
      };
    }
  },

  createTimeSlots: async (serviceId: number, data: TimeSlotCreateData): Promise<TimeSlot[]> => {
    try {
      const response = await api.post<ApiResponse<TimeSlot[]>>(`/services/${serviceId}/time-slots`, data);
      // Ensure we always return a valid array, even if data is missing
      return response.data?.data || [];
    } catch (error) {
      // Return empty array on error and let the calling code handle the error
      console.error('Error creating time slots:', error);
      throw error; // Re-throw for proper error handling in mutations
    }
  },

  deleteTimeSlot: async (timeSlotId: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/time-slots/${timeSlotId}`);
  },

  getBookableIntervals: async (serviceId: number, date: string): Promise<BookableInterval[]> => {
    try {
      const response = await api.get<ApiResponse<BookableInterval[]>>(`/time-slots?serviceId=${serviceId}&date=${date}`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching bookable intervals:', error);
      return [];
    }
  },
};

// React Query hooks
export const useBookableIntervals = (serviceId: number, date: string, enabled = true) => {
  return useQuery({
    queryKey: ['bookable-intervals', serviceId, date],
    queryFn: () => timeSlotsApi.getBookableIntervals(serviceId, date),
    enabled: enabled && !!serviceId && !!date,
    refetchInterval: 10000, // Poll every 10 seconds
    refetchIntervalInBackground: true,
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};
