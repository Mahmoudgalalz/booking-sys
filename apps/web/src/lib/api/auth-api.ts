import { api } from './client';
import type { ApiResponse } from './client';
import type { LoginCredentials, RegisterData, ProviderData, AuthResponse } from '../types/auth';

export const authApi = {
  login: (credentials: LoginCredentials): ApiResponse<AuthResponse> => {
    return api.post('/auth/login', credentials, true);
  },

  register: (data: RegisterData): ApiResponse<AuthResponse> => {
    return api.post('/auth/register', data, true);
  },

  completeProviderProfile: (data: ProviderData): ApiResponse<AuthResponse> => {
    return api.post('/providers/profile', data);
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
};
