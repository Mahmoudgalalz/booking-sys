import { api } from './client';
import type { LoginCredentials, RegisterData, ProviderData, AuthResponse } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials, true);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data, true);
    return response.data;
  },

  completeProviderProfile: async (data: ProviderData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/providers/profile', data);
    return response.data;
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
};
