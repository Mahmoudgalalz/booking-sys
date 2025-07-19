import { api } from './client';

export interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  timeSlot: {
    id: number;
    startTime: string;
    endTime: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    id: number;
    title: string;
  };
}

export interface BookingCreateData {
  timeSlotId: number;
  notes?: string;
}


export const bookingsApi = {
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/user');
    return response.data;
  },

  getProviderBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/provider');
    return response.data;
  },

  createBooking: async (data: BookingCreateData): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  updateBookingStatus: async (bookingId: number, status: string): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },
};
