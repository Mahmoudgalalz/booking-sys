import { betterFetch } from '@better-fetch/fetch';
import { showResponseToast } from '../utils/toast-utils';

const BASE_URL = 'http://localhost:3005';
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  get: async <T>(endpoint: string, skipAuth = false): Promise<T> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<T>(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    showResponseToast(data);
    return data;
  },

  post: async <T>(endpoint: string, body: unknown, skipAuth = false): Promise<T> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<T>(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    showResponseToast(data);
    return data;
  },

  put: async <T>(endpoint: string, body: unknown, skipAuth = false): Promise<T> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<T>(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    showResponseToast(data);
    return data;
  },

  delete: async <T>(endpoint: string, skipAuth = false): Promise<T> => {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : getAuthHeaders();
    const { data, error } = await betterFetch<T>(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (error) {
      showResponseToast(error, true);
      throw error;
    }
    
    showResponseToast(data);
    return data;
  },
};

export type ApiResponse<T> = Promise<T>;
