import { useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  duration: number;
  provider: {
    id: number;
    bio: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
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

export const useServices = (page: number = 1, search: string = '') => {
  return useQuery({
    queryKey: ['services', page, search],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<PaginatedResponse<Service>>(
          `/services?page=${page}&search=${encodeURIComponent(search)}`
        );
        return response;
      } catch (error) {
        console.error('Failed to fetch services:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useProviderServices = () => {
  return useQuery({
    queryKey: ['provider-services'],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<Service[]>('/providers/services');
        return response;
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
        const response = await $fetchThrow<Service>(`/services/${serviceId}`);
        return response;
      } catch (error) {
        console.error(`Failed to fetch service with ID ${serviceId}:`, error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
