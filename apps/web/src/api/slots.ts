import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import type { ApiResponse } from '../lib/types/auth';

export interface Slot {
  id: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
  service?: {
    id: number;
    title: string;
    providerId: number;
    provider?: {
      id: number;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
  };
}

export interface CreateSlotData {
  startTime: string;
  endTime: string;
}

export const useAvailableSlots = (serviceId?: number, dayOfWeek?: number) => {
  return useQuery({
    queryKey: ['slots', 'available', serviceId, dayOfWeek],
    queryFn: async () => {
      let url = '/slots';
      const params = new URLSearchParams();
      if (serviceId) params.append('serviceId', serviceId.toString());
      if (dayOfWeek !== undefined) params.append('dayOfWeek', dayOfWeek.toString());
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await $fetchThrow<ApiResponse<Slot[]>>(url);
      return response.data;
    },
    enabled: true,
  });
};

export const useAvailableSlotsByDate = (serviceId?: number, date?: string) => {
  return useQuery({
    queryKey: ['slots', 'by-date', serviceId, date],
    queryFn: async () => {
      if (!serviceId || !date) return null;
      
      const response = await $fetchThrow<ApiResponse<Slot[]>>(
        `/slots/by-date?serviceId=${serviceId}&date=${date}`
      );
      return response.data;
    },
    enabled: !!serviceId && !!date,
  });
};

export const useProviderSlots = (serviceId: number) => {
  return useQuery({
    queryKey: ['slots', 'service', serviceId],
    queryFn: async () => {
      const response = await $fetchThrow<ApiResponse<Slot[]>>(`/slots/service/${serviceId}`);
      return response.data;
    },
    enabled: !!serviceId,
  });
};

export const useCurrentProviderSlots = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['slots', 'my-slots', page, limit],
    queryFn: async () => {
      const response = await $fetchThrow<ApiResponse<Slot[]>>(`/slots/my-slots?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

export interface CreateSlotData {
  serviceId: number;
  startTime: string;
  endTime: string;
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isRecurring?: boolean;
}

export const useCreateSlot = () => {
  return useMutation({
    mutationFn: async (data: CreateSlotData) => {
      const response = await $fetchThrow<ApiResponse<Slot>>('/slots', {
        method: 'POST',
        body: data,
      });
      return response.data;
    },
  });
};

export const useDeleteSlot = () => {
  return useMutation({
    mutationFn: async (slotId: number) => {
      await $fetchThrow<ApiResponse<null>>(`/slots/${slotId}`, {
        method: 'DELETE',
      });
      return slotId;
    },
  });
};
