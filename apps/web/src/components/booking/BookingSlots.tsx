import React, { useState } from 'react';
import { BookableIntervals } from './BookableIntervals';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Calendar, Search } from 'lucide-react';

interface BookingSlotsProps {
  serviceId?: number;
  onBookInterval?: (intervalId: string) => void;
}

export function BookingSlots({ serviceId, onBookInterval }: BookingSlotsProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(serviceId || 0);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  );

  const handleBookInterval = (intervalId: string) => {
    console.log('Booking interval:', intervalId);
    if (onBookInterval) {
      onBookInterval(intervalId);
    } else {
      // Default booking logic - you can customize this
      alert(`Booking interval ${intervalId}. Implement your booking logic here.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Service and Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Available Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Service ID
              </label>
              <Input
                id="serviceId"
                type="number"
                value={selectedServiceId || ''}
                onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                placeholder="Enter service ID"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookable Intervals */}
      {selectedServiceId && selectedDate && (
        <BookableIntervals
          serviceId={selectedServiceId}
          date={selectedDate}
          onBookInterval={handleBookInterval}
          showBookingButton={true}
        />
      )}
    </div>
  );
}
