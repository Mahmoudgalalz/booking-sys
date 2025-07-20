import { useMutation, useQuery } from '@tanstack/react-query';
import { $fetchThrow } from './client';
import { useUserStore } from '../store/userStore';
import type { LoginCredentials, RegisterData, ProviderData, User, AuthData, ApiResponse } from '../lib/types/auth';

export const useUserProfile = () => {
  const userStore = useUserStore();
  
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      try {
        const response = await $fetchThrow<ApiResponse<User>>('/auth/profile');
        if (response.success && response.data) {
          userStore.setUser(response.data);
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
    mutationFn: async (credentials: LoginCredentials): Promise<ApiResponse<AuthData>> => {
      try {
        const response = await $fetchThrow<ApiResponse<AuthData>>('/auth/login', {
          method: 'POST',
          body: credentials,
        });
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    onSuccess: (data: ApiResponse<AuthData>) => {
      if (data.success && data.data) {
        userStore.setUser(data.data.user);
        userStore.setToken(data.data.accessToken);
        
        // Set provider flag if user has provider role
        if (data.data.role.name === 'Provider') {
          userStore.setIsProvider(true);
        }
        
        // Also store token in localStorage for backward compatibility
        localStorage.setItem('auth_token', data.data.accessToken);
      }
    },
  });
};

export const useRegister = () => {
  const userStore = useUserStore();
  // Store the password temporarily for login after registration
  let tempPassword = '';
  
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<ApiResponse<User>> => {
      try {
        // Store the password temporarily for login after registration
        tempPassword = data.password;
        
        const response = await $fetchThrow<ApiResponse<User>>('/auth/register', {
          method: 'POST',
          body: data,
        });
        return response;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    onSuccess: async (data: ApiResponse<User>) => {
      if (data.success && data.data) {
        // After successful registration, we need to login to get the token
        try {
          // Use the temporarily stored password for login
          const loginCredentials: LoginCredentials = {
            email: data.data.email,
            password: tempPassword,
          };
          
          // Login to get the token
          const loginResponse = await $fetchThrow<ApiResponse<AuthData>>('/auth/login', {
            method: 'POST',
            body: loginCredentials,
          });
          
          if (loginResponse.success && loginResponse.data) {
            userStore.setUser(loginResponse.data.user);
            userStore.setToken(loginResponse.data.accessToken);
            
            // Set provider flag if user registered as provider
            if (loginResponse.data.role.name === 'Provider') {
              userStore.setIsProvider(true);
            }
            
            // Also store token in localStorage for backward compatibility
            localStorage.setItem('auth_token', loginResponse.data.accessToken);
          }
        } catch (loginError) {
          console.error('Auto-login after registration failed:', loginError);
        }
      }
    },
  });
};

export const useCompleteProviderProfile = () => {
  const userStore = useUserStore();
  
  return useMutation({
    mutationFn: async (data: ProviderData): Promise<ApiResponse<AuthData>> => {
      try {
        const response = await $fetchThrow<ApiResponse<AuthData>>('/providers/profile', {
          method: 'POST',
          body: data,
        });
        return response;
      } catch (error) {
        console.error('Failed to complete provider profile:', error);
        throw error;
      }
    },
    onSuccess: (data: ApiResponse<AuthData>) => {
      if (data.success && data.data) {
        userStore.setUser(data.data.user);
        userStore.setIsProvider(true);
      }
    },
  });
};

export const logout = () => {
  useUserStore.getState().clearUser();
  localStorage.removeItem('auth_token');
};

export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await $fetchThrow<ApiResponse<User>>('/auth/profile');
    if (response.success && response.data) {
      useUserStore.getState().setUser(response.data);
      
      // Set provider flag if user has provider role
      if (response.data.role.name === 'Provider') {
        useUserStore.getState().setIsProvider(true);
      }
      
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
};
