import { api } from './client';
import type { ApiResponse } from './client';

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
  getTimeSlotsByService: (serviceId: number, date: string): ApiResponse<TimeSlot[]> => {
    return api.get(`/time-slots?serviceId=${serviceId}&date=${date}`);
  },

  getProviderTimeSlots: (date?: string): ApiResponse<TimeSlot[]> => {
    const url = date ? `/providers/time-slots?date=${date}` : '/providers/time-slots';
    return api.get(url);
  },

  createTimeSlots: (serviceId: number, data: TimeSlotCreateData): ApiResponse<TimeSlot[]> => {
    return api.post(`/services/${serviceId}/time-slots`, data);
  },

  deleteTimeSlot: (timeSlotId: number): ApiResponse<void> => {
    return api.delete(`/time-slots/${timeSlotId}`);
  },
};
