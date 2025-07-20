import { $fetchThrow } from '../../api/client';

export interface BookingCreateData {
  timeSlotId: number;
  bookedAt: string; // ISO date string for the specific booking time
  notes?: string;
}

export interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  bookedAt: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number;
  serviceId: number;
  timeSlotId: number;
  timeSlot: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    isRecurring: boolean;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    serviceId: number;
    service: {
      id: number;
      title: string;
      description: string;
      category: string;
      duration: number;
      image: string | null;
      isActive: boolean;
      metadata: Record<string, unknown> | null;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      providerId: number;
    };
  };
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role: string;
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
    return $fetchThrow('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Get bookings for the current user
  getUserBookings: async (page = 1, limit = 10): Promise<PaginatedBookingsResponse> => {
    return $fetchThrow(`/bookings/user?page=${page}&limit=${limit}`);
  },

  // Get bookings for a provider
  getProviderBookings: async (page = 1, limit = 10): Promise<PaginatedBookingsResponse> => {
    const x = await $fetchThrow(`/bookings/provider?page=${page}&limit=${limit}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return x.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId: number, status: string): Promise<Booking> => {
    return $fetchThrow(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Cancel a booking
  cancelBooking: async (bookingId: number): Promise<Booking> => {
    return $fetchThrow(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  },

  // Get a specific booking by ID
  getBooking: async (bookingId: number): Promise<Booking> => {
    return $fetchThrow(`/bookings/${bookingId}`);
  },
};