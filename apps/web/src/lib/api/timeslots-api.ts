import { api } from './client';
import type { ApiResponse } from '../types/auth';

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

export const timeSlotsApi = {
  getTimeSlotsByService: async (serviceId: number, date: string, page = 1, limit = 10): Promise<PaginatedResponse<TimeSlot>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<TimeSlot>>>(`/time-slots?serviceId=${serviceId}&date=${date}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getProviderTimeSlots: async (page = 1, limit = 10, date?: string): Promise<PaginatedResponse<TimeSlot>> => {
    let url = `/providers/time-slots?page=${page}&limit=${limit}`;
    if (date) url += `&date=${date}`;
    const response = await api.get<ApiResponse<PaginatedResponse<TimeSlot>>>(url);
    return response.data.data;
  },

  createTimeSlots: async (serviceId: number, data: TimeSlotCreateData): Promise<TimeSlot[]> => {
    const response = await api.post<ApiResponse<TimeSlot[]>>(`/services/${serviceId}/time-slots`, data);
    return response.data.data;
  },

  deleteTimeSlot: async (timeSlotId: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/time-slots/${timeSlotId}`);
  },
};
