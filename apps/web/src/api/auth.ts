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
        if (response.success && response.data) {
          // Extract user info from response data
          const userData = {
            id: response.data.roleId, // Using roleId as user id for now
            email: '', // This might need to be updated based on actual response
            firstName: '',
            lastName: '',
            role: response.data.role
          };
          userStore.setUser(userData);
        }
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
      if (data.success && data.data) {
        // Extract user info from response data
        const userData = {
          id: data.data.roleId, // Using roleId as user id for now
          email: '', // This might need to be updated based on actual response
          firstName: '',
          lastName: '',
          role: data.data.role
        };
        userStore.setUser(userData);
        userStore.setToken(data.data.accessToken);
        
        // Also store token in localStorage for backward compatibility
        localStorage.setItem('auth_token', data.data.accessToken);
        console.log('Login successful, token stored:', data.data.accessToken);
      }
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
      if (data.success && data.data) {
        // Extract user info from response data
        const userData = {
          id: data.data.roleId, // Using roleId as user id for now
          email: '', // This might need to be updated based on actual response
          firstName: '',
          lastName: '',
          role: data.data.role
        };
        userStore.setUser(userData);
        userStore.setToken(data.data.accessToken);
        
        // Also store token in localStorage for backward compatibility
        localStorage.setItem('auth_token', data.data.accessToken);
      }
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
      if (data.success && data.data) {
        // Extract user info from response data
        const userData = {
          id: data.data.roleId, // Using roleId as user id for now
          email: '', // This might need to be updated based on actual response
          firstName: '',
          lastName: '',
          role: data.data.role
        };
        userStore.setUser(userData);
      }
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
