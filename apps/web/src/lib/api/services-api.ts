import { api } from './client';
import type { ApiResponse } from './client';
  
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
  getAllServices: (): ApiResponse<Service[]> => {
    return api.get('/services');
  },

  getServicesByProvider: (providerId: number): ApiResponse<Service[]> => {
    return api.get(`/services?providerId=${providerId}`);
  },

  getProviderServices: (): ApiResponse<Service[]> => {
    return api.get('/providers/services');
  },

  getServiceById: (serviceId: number): ApiResponse<Service> => {
    return api.get(`/services/${serviceId}`);
  },

  createService: (data: ServiceCreateData): ApiResponse<Service> => {
    return api.post('/services', data);
  },

  updateService: (serviceId: number, data: Partial<ServiceCreateData>): ApiResponse<Service> => {
    return api.put(`/services/${serviceId}`, data);
  },

  deleteService: (serviceId: number): ApiResponse<void> => {
    return api.delete(`/services/${serviceId}`);
  },
};
