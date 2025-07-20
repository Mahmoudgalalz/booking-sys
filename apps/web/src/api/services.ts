import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import type { ApiResponse } from '../lib/types/auth';

export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  isRecurring: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  serviceId: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price?: number;
  category: string;
  image: string | null;
  duration: number;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  providerId: number;
  provider: {
    id: number;
    bio: string;
    specialization: string;
    experience: number;
    profileImage: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
  timeSlots: TimeSlot[];
}

export interface CreateSlotData {
  date: string;
  duration: number;
  startTime: string; // Time in HH:MM format
  endTime: string; // Time in HH:MM format
  dayOfWeek: number;
  isRecurring: boolean;
}

export interface CreateServiceData {
  title: string;
  description: string;
  category: string;
  image?: string;
  duration: number;
  slots: CreateSlotData[];
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  duration?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export interface BackendPaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const useServices = (page: number = 1, search: string = '', category: string = '') => {
  return useQuery({
    queryKey: ['services', page, search, category],
    queryFn: async () => {
      try {
        let url = `/services?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        
        const response = await $fetchThrow<ApiResponse<BackendPaginatedResponse<Service>>>(url);
        return {
          data: response.data.items,
          meta: {
            total: response.data.meta.totalItems,
            currentPage: response.data.meta.currentPage,
            lastPage: response.data.meta.totalPages,
            perPage: response.data.meta.itemsPerPage
          }
        };
      } catch (error) {
        console.error('Failed to fetch services:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useProviderServices = (page: number = 1) => {
  return useQuery({
    queryKey: ['provider-services', page],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<ApiResponse<BackendPaginatedResponse<Service>>>(`/services?page=${page}`);
        return {
          data: response.data.items,
          meta: {
            total: response.data.meta.totalItems,
            currentPage: response.data.meta.currentPage,
            lastPage: response.data.meta.totalPages,
            perPage: response.data.meta.itemsPerPage
          }
        };
      } catch (error) {
        console.error('Failed to fetch provider services:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useService = (serviceId: number) => {
  return useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<ApiResponse<Service>>(`/services/${serviceId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch service with ID ${serviceId}:`, error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!serviceId,
  });
};

export const useCreateService = () => {
  return useMutation({
    mutationFn: async (data: CreateServiceData) => {
      try {
        const response = await $fetchThrow<ApiResponse<Service>>('/services', {
          method: 'POST',
          body: data,
        });
        return response.data;
      } catch (error) {
        console.error('Failed to create service:', error);
        throw error;
      }
    },
  });
};

export const useUpdateService = (serviceId: number) => {
  return useMutation({
    mutationFn: async (data: UpdateServiceData) => {
      try {
        const response = await $fetchThrow<ApiResponse<Service>>(`/services/${serviceId}`, {
          method: 'PATCH',
          body: data,
        });
        return response.data;
      } catch (error) {
        console.error(`Failed to update service with ID ${serviceId}:`, error);
        throw error;
      }
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: async (serviceId: number) => {
      try {
        await $fetchThrow<ApiResponse<null>>(`/services/${serviceId}`, {
          method: 'DELETE',
        });
        return serviceId;
      } catch (error) {
        console.error(`Failed to delete service with ID ${serviceId}:`, error);
        throw error;
      }
    },
  });
};
