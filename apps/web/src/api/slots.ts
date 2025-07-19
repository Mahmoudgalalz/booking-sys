import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';

export interface Slot {
  id: number;
  providerId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateSlotData {
  startTime: string;
  endTime: string;
}

export const useAvailableSlots = () => {
  return useQuery({
    queryKey: ['slots', 'available'],
    queryFn: async () => {
      const response = await $fetchThrow<Slot[]>('/slots/available');
      return response;
    },
  });
};

export const useProviderSlots = (providerId: number) => {
  return useQuery({
    queryKey: ['slots', 'provider', providerId],
    queryFn: async () => {
      const response = await $fetchThrow<Slot[]>(`/slots/provider/${providerId}`);
      return response;
    },
    enabled: !!providerId,
  });
};

export const useCurrentProviderSlots = () => {
  return useQuery({
    queryKey: ['slots', 'current-provider'],
    queryFn: async () => {
      const response = await $fetchThrow<Slot[]>('/slots/my-slots');
      return response;
    },
  });
};

export const useCreateSlot = () => {
  return useMutation({
    mutationFn: async (data: CreateSlotData) => {
      const response = await $fetchThrow<Slot>('/slots', {
        method: 'POST',
        body: data,
      });
      return response;
    },
  });
};

export const useDeleteSlot = () => {
  return useMutation({
    mutationFn: async (slotId: number) => {
      await $fetchThrow(`/slots/${slotId}`, {
        method: 'DELETE',
      });
      return slotId;
    },
  });
};
