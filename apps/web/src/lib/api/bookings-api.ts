import { $fetchThrow } from '../../api/client';

export interface BookingCreateData {
  serviceId: number;
  timeSlotId: number;
  notes?: string;
}

export interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeSlot: {
    id: number;
    date: string;
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
    description: string;
    duration: number;
    price?: number;
  };
}

export interface PaginatedBookingsResponse {
  items: Booking[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const bookingsApi = {
  // Create a new booking
  createBooking: async (data: BookingCreateData): Promise<Booking> => {
    return $fetchThrow('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Get bookings for the current user
  getUserBookings: async (page = 1, limit = 10): Promise<PaginatedBookingsResponse> => {
    return $fetchThrow(`/api/bookings/user?page=${page}&limit=${limit}`);
  },

  // Get bookings for a provider
  getProviderBookings: async (page = 1, limit = 10): Promise<PaginatedBookingsResponse> => {
    return $fetchThrow(`/api/bookings/provider?page=${page}&limit=${limit}`);
  },

  // Update booking status
  updateBookingStatus: async (bookingId: number, status: string): Promise<Booking> => {
    return $fetchThrow(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Cancel a booking
  cancelBooking: async (bookingId: number): Promise<Booking> => {
    return $fetchThrow(`/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  },

  // Get a specific booking by ID
  getBooking: async (bookingId: number): Promise<Booking> => {
    return $fetchThrow(`/api/bookings/${bookingId}`);
  },
};