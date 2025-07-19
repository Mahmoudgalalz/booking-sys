import { api } from './client';
import type { ApiResponse } from '../types/auth';
  
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  duration: number;
  provider?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface ServiceCreateData {
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  duration: number;
}

export const servicesApi = {
  getAllServices: async (page = 1, limit = 10, category?: string, search?: string): Promise<PaginatedResponse<Service>> => {
    let url = `/services?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    
    const response = await api.get<ApiResponse<PaginatedResponse<Service>>>(url);
    return response.data.data;
  },

  getServicesByProvider: async (providerId: number, page = 1, limit = 10): Promise<PaginatedResponse<Service>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Service>>>(`/services?providerId=${providerId}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getProviderServices: async (page = 1, limit = 10): Promise<PaginatedResponse<Service>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Service>>>(`/providers/services?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getServiceById: async (serviceId: number): Promise<Service> => {
    const response = await api.get<ApiResponse<Service>>(`/services/${serviceId}`);
    return response.data.data;
  },

  createService: async (data: ServiceCreateData): Promise<Service> => {
    const response = await api.post<Service>('/services', data);
    return response.data;
  },

  updateService: async (serviceId: number, data: Partial<ServiceCreateData>): Promise<Service> => {
    const response = await api.put<Service>(`/services/${serviceId}`, data);
    return response.data;
  },

  deleteService: async (serviceId: number): Promise<void> => {
    await api.delete<void>(`/services/${serviceId}`);
  },
};
