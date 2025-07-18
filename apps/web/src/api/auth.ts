import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import { useUserStore } from '../store/userStore';
import type { AuthResponse, LoginCredentials, RegisterData, ProviderData } from '../lib/utils/auth-service';

// Fetch user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await $fetchThrow<AuthResponse>('/auth/profile');
      return response;
    },
    enabled: useUserStore.getState().isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await $fetchThrow<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      useUserStore.getState().setUser(data.user);
      useUserStore.getState().setToken(data.token);
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await $fetchThrow<AuthResponse>('/auth/register', {
        method: 'POST',
        body: data,
      });
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      useUserStore.getState().setUser(data.user);
      useUserStore.getState().setToken(data.token);
    },
  });
};

// Complete provider profile mutation
export const useCompleteProviderProfile = () => {
  return useMutation({
    mutationFn: async (data: ProviderData) => {
      const response = await $fetchThrow<AuthResponse>('/providers/profile', {
        method: 'POST',
        body: data,
      });
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      useUserStore.getState().setUser(data.user);
    },
  });
};

// Logout function
export const logout = () => {
  useUserStore.getState().clearUser();
};
