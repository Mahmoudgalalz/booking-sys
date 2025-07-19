import { betterFetch } from '@better-fetch/fetch';
import { showResponseToast } from '../utils/toast-utils';
import { useUserStore } from '../../store/userStore';
import type { ApiResponse } from '../types/auth';

const BASE_URL = 'http://localhost:3005';
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Get token from userStore instead of directly from localStorage
  const token = useUserStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    
    // Also ensure token is in localStorage for backward compatibility
    localStorage.setItem('auth_token', token);
  }

  return headers;
};

export const api = {
  get: async <T>(endpoint: string, skipAuth = false): Promise<ApiResponse<T>> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<ApiResponse<T>>(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    if (data && data.message) {
      showResponseToast({ message: data.message }, !data.success);
    }
    
    return data;
  },

  post: async <T>(endpoint: string, body: unknown, skipAuth = false): Promise<ApiResponse<T>> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<ApiResponse<T>>(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    if (data && data.message) {
      showResponseToast({ message: data.message }, !data.success);
    }
    
    return data;
  },

  put: async <T>(endpoint: string, body: unknown, skipAuth = false): Promise<ApiResponse<T>> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<ApiResponse<T>>(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    if (data && data.message) {
      showResponseToast({ message: data.message }, !data.success);
    }
    
    return data;
  },

  delete: async <T>(endpoint: string, skipAuth = false): Promise<ApiResponse<T>> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<ApiResponse<T>>(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    if (data && data.message) {
      showResponseToast({ message: data.message }, !data.success);
    }
    
    return data;
  },
};

// ApiResponse type is now imported from '../types/auth'
