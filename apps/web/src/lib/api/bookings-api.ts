import { api } from './client';
import type { ApiResponse } from './client';

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
  getUserBookings: (): ApiResponse<Booking[]> => {
    return api.get('/bookings/user');
  },

  getProviderBookings: (): ApiResponse<Booking[]> => {
    return api.get('/bookings/provider');
  },

  createBooking: (data: BookingCreateData): ApiResponse<Booking> => {
    return api.post('/bookings', data);
  },

  updateBookingStatus: (bookingId: number, status: string): ApiResponse<Booking> => {
    return api.put(`/bookings/${bookingId}/status`, { status });
  },
};
