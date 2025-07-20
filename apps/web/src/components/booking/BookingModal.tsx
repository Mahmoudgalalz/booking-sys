import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TimeSlot } from '../../lib/api/timeslots-api';
import { timeSlotsApi } from '../../lib/api/timeslots-api';
import { useBookingMutations } from '../../lib/hooks/useBookingMutations';
import { formatTime } from '../../lib/utils/time-utils';
import type { Service, TimeSlot as ServiceTimeSlot } from '../../api/services';

interface BookingModalProps {
  service: Service;
  selectedTimeSlot?: ServiceTimeSlot | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ service, onClose, onSuccess }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  

  
  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }
    
    return dates;
  };
  
  // Get the booking mutations hook
  const { createBookingOptimistic } = useBookingMutations();
  
  // Fetch available time slots for the selected date and service
  const timeSlotsQuery = useQuery({
    queryKey: ['timeSlots', service.id, selectedDate],
    queryFn: () => timeSlotsApi.getTimeSlotsByService(service.id, selectedDate),
    staleTime: 10000, // Short stale time to ensure fresh data when booking
  });
  
  // Handle booking confirmation
  const handleBooking = () => {
    if (selectedTimeSlot) {
      createBookingOptimistic.mutate({
        serviceId: service.id,
        timeSlotId: selectedTimeSlot.id,
        notes: bookingNotes
      }, {
        onSuccess: () => {
          onSuccess();
        }
      });
    }
  };
  
  // Reset selected time slot when date changes
  useEffect(() => {
    setSelectedTimeSlot(null);
  }, [selectedDate]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Book {service.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <p className="mb-4">
          Select a date and time to book this service.
        </p>
        
        {/* Date selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {getAvailableDates().map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 py-2 whitespace-nowrap rounded-md ${
                  selectedDate === date
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Time slot selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Time</label>
          
          {timeSlotsQuery.isLoading ? (
            <div className="text-center py-4">Loading available times...</div>
          ) : timeSlotsQuery.isError ? (
            <div className="text-center py-4 text-red-500">
              Error loading time slots. Please try again.
            </div>
          ) : !timeSlotsQuery.data || timeSlotsQuery.data.items.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No available time slots for this date. Please select another date.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {timeSlotsQuery.data.items.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={!slot.isAvailable}
                  className={`p-2 rounded-md ${selectedTimeSlot?.id === slot.id
                    ? 'bg-blue-600 text-white'
                    : slot.isAvailable
                    ? 'border hover:bg-gray-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  {!slot.isAvailable && ' (Booked)'}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Notes field */}
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={bookingNotes}
            onChange={(e) => setBookingNotes(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Any special requests or information..."
          />
        </div>
        
        {/* Booking summary */}
        {selectedTimeSlot && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Service:</span>
              <span>{service.title}</span>
              
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(selectedDate)}</span>
              
              <span className="text-gray-600">Time:</span>
              <span>{formatTime(selectedTimeSlot.startTime)}</span>
              
              <span className="text-gray-600">Duration:</span>
              <span>{service.duration} minutes</span>
              
              <span className="text-gray-600">Price:</span>
              <span>${service.price ? service.price.toFixed(2) : 'N/A'}</span>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={!selectedTimeSlot || createBookingOptimistic.isPending}
            className={`px-4 py-2 rounded-md ${
              !selectedTimeSlot || createBookingOptimistic.isPending
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {createBookingOptimistic.isPending ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
        
        {createBookingOptimistic.isError && (
          <div className="mt-3 text-red-500 text-sm">
            {(createBookingOptimistic.error as Error)?.message || 'An error occurred during booking'}
          </div>
        )}
      </div>
    </div>
  );
}
