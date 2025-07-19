import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import { useUserStore } from '../store/userStore';
import type { AuthResponse, LoginCredentials, RegisterData, ProviderData, User } from '../lib/types/auth';

export const useUserProfile = () => {
  const userStore = useUserStore();
  
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<AuthResponse>('/auth/profile');
        userStore.setUser(response.user);
        return response;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
      }
    },
    enabled: userStore.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
  });
};

export const useLogin = () => {
  const userStore = useUserStore();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      try {
        const response = await $fetchThrow<AuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials,
        });
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      userStore.setUser(data.user);
      userStore.setToken(data.token);
    },
  });
};

export const useRegister = () => {
  const userStore = useUserStore();
  
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      try {
        const response = await $fetchThrow<AuthResponse>('/auth/register', {
          method: 'POST',
          body: data,
        });
        return response;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      userStore.setUser(data.user);
      userStore.setToken(data.token);
    },
  });
};

export const useCompleteProviderProfile = () => {
  const userStore = useUserStore();
  
  return useMutation({
    mutationFn: async (data: ProviderData): Promise<AuthResponse> => {
      try {
        const response = await $fetchThrow<AuthResponse>('/providers/profile', {
          method: 'POST',
          body: data,
        });
        return response;
      } catch (error) {
        console.error('Failed to complete provider profile:', error);
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      userStore.setUser(data.user);
    },
  });
};

export const logout = () => {
  useUserStore.getState().clearUser();
};
export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await $fetchThrow<AuthResponse>('/auth/profile');
    useUserStore.getState().setUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
};
