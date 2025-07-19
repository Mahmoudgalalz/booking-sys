import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { timeSlotsApi, type TimeSlotCreateData } from '../../lib/api/timeslots-api';
import { servicesApi, type Service } from '../../lib/api/services-api';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils/cn';

export function TimeSlotsTab() {
  const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<{
    serviceId: number;
    date: string;
    startTime: string;
    endTime: string;
    interval: number;
  }>({
    serviceId: 0,
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  });

  // Fetch provider time slots
  const timeSlotsQuery = useQuery({
    queryKey: ['provider-timeslots'],
    queryFn: () => timeSlotsApi.getProviderTimeSlots(),
  });

  // Fetch provider services for the dropdown
  const servicesQuery = useQuery({
    queryKey: ['provider-services'],
    queryFn: () => servicesApi.getProviderServices(),
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTimeSlot({
      ...newTimeSlot,
      [name]: name === 'serviceId' || name === 'interval' ? Number(value) : value,
    });
  };

  // Handle time slot creation
  const handleCreateTimeSlots = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTimeSlot.serviceId === 0) {
      alert('Please select a service');
      return;
    }
    
    const timeSlotData: TimeSlotCreateData = {
      date: newTimeSlot.date,
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime,
      interval: newTimeSlot.interval,
    };
    
    timeSlotsApi.createTimeSlots(newTimeSlot.serviceId, timeSlotData)
      .then(() => {
        setIsAddTimeSlotModalOpen(false);
        timeSlotsQuery.refetch();
      })
      .catch((error) => {
        console.error('Error creating time slots:', error);
        alert('Failed to create time slots. Please try again.');
      });
  };

  // Handle time slot deletion
  const handleDeleteTimeSlot = (timeSlotId: number) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      timeSlotsApi.deleteTimeSlot(timeSlotId)
        .then(() => {
          timeSlotsQuery.refetch();
        })
        .catch((error) => {
          console.error('Error deleting time slot:', error);
          alert('Failed to delete time slot. Please try again.');
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-800">Your Time Slots</h2>
        <Button onClick={() => setIsAddTimeSlotModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Add Time Slots
        </Button>
      </div>

      {timeSlotsQuery.isLoading ? (
        <div className="text-center py-8">Loading time slots...</div>
      ) : timeSlotsQuery.error ? (
        <div className="text-center py-8 text-red-500">
          Error loading time slots. Please try again.
        </div>
      ) : timeSlotsQuery.data?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">You haven't added any time slots yet.</p>
            <Button 
              onClick={() => setIsAddTimeSlotModalOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Your First Time Slots
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Date</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Time</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Status</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeSlotsQuery.data?.map((slot) => (
                <tr key={slot.id} className="border-b">
                  <td className="py-4">
                    {formatDate(slot.startTime)}
                  </td>
                  <td className="py-4">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        slot.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {slot.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="py-4">
                    {slot.isAvailable && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Time Slot Modal */}
      <Dialog open={isAddTimeSlotModalOpen} onOpenChange={setIsAddTimeSlotModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slots</DialogTitle>
            <DialogDescription>
              Create time slots for clients to book. This will generate multiple slots based on your interval.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTimeSlots}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="serviceId" className="text-sm font-medium text-indigo-800">Service</label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={newTimeSlot.serviceId}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value={0}>Select a service</option>
                  {servicesQuery.data?.map((service: Service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-indigo-800">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newTimeSlot.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium text-indigo-800">Start Time</label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={newTimeSlot.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium text-indigo-800">End Time</label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={newTimeSlot.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="interval" className="text-sm font-medium text-indigo-800">Interval (minutes)</label>
                <Input
                  id="interval"
                  name="interval"
                  type="number"
                  min="15"
                  step="15"
                  value={newTimeSlot.interval}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddTimeSlotModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Create Time Slots
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
