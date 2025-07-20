export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
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

export interface BookingCreateData {
  timeSlotId: number;
  notes?: string;
}

export interface TimeSlotCreateData {
  date: string;
  startTime: string;
  endTime: string;
  interval: number; // Duration in minutes for each slot
}
