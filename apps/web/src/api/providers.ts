import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import type { ApiResponse } from '../lib/types/auth';

export interface Provider {
  id: number;
  bio?: string;
  specialization?: string;
  experience?: number;
  profileImage?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderProfileData {
  bio?: string;
  specialization?: string;
  experience?: number;
  profileImage?: string;
}

export interface UpdateProviderProfileData {
  bio?: string;
  specialization?: string;
  experience?: number;
  profileImage?: string;
}

// Get provider profile
export const useGetProviderProfile = () => {
  return useQuery({
    queryKey: ['provider-profile'],
    queryFn: async (): Promise<Provider | null> => {
      try {
        const response = await $fetchThrow<ApiResponse<Provider>>('/providers/profile');
        return response.data;
      } catch (error: unknown) {
        // If profile doesn't exist (404), return null instead of throwing
        if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry on 404 errors
  });
};

// Create provider profile
export const useCreateProviderProfile = () => {
  return useMutation({
    mutationFn: async (data: CreateProviderProfileData): Promise<Provider> => {
      try {
        const response = await $fetchThrow<ApiResponse<Provider>>('/providers/profile', {
          method: 'POST',
          body: data,
        });
        return response.data;
      } catch (error) {
        console.error('Failed to create provider profile:', error);
        throw error;
      }
    },
  });
};

// Update provider profile
export const useUpdateProviderProfile = () => {
  return useMutation({
    mutationFn: async (data: UpdateProviderProfileData): Promise<Provider> => {
      try {
        const response = await $fetchThrow<ApiResponse<Provider>>('/providers/profile', {
          method: 'PATCH',
          body: data,
        });
        return response.data;
      } catch (error) {
        console.error('Failed to update provider profile:', error);
        throw error;
      }
    },
  });
};
