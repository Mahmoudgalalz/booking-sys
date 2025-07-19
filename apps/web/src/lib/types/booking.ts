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

export interface TimeSlotCreateData {
  date: string;
  startTime: string;
  endTime: string;
  interval: number; // Duration in minutes for each slot
}
