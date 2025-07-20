import { useState } from 'react';
import { useCreateSlot, useDeleteSlot, useProviderSlots } from '../../api/slots';
import { useProviderServices } from '../../api/services';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Trash2, RefreshCw, Clock, Calendar } from 'lucide-react';

type TimeSlotFormData = {
  serviceId: number;
  date: string;
  timeSlot: string;
  dayOfWeek?: number;
  isRecurring: boolean;
  notes?: string;
};

export function TimeSlotsTab() {
  const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState('one-time');
  
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlotFormData>({
    serviceId: 0,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00',
    isRecurring: false,
    notes: ''
  });

  // Fetch provider services with polling every 10 seconds
  const servicesQuery = useProviderServices(1, {
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
  
  // Fetch time slots for the selected service with polling
  const timeSlotsQuery = useProviderSlots(selectedService, {
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    enabled: selectedService > 0,
  });
  
  // Create and delete mutations
  const createSlotMutation = useCreateSlot();
  const deleteSlotMutation = useDeleteSlot();
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTimeSlot({
      ...newTimeSlot,
      [name]: name === 'serviceId' || name === 'dayOfWeek' ? Number(value) : value,
    });
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'serviceId') {
      setSelectedService(Number(value));
    }
    
    setNewTimeSlot({
      ...newTimeSlot,
      [name]: name === 'serviceId' || name === 'dayOfWeek' ? Number(value) : value,
    });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setNewTimeSlot({
      ...newTimeSlot,
      isRecurring: value === 'recurring',
      dayOfWeek: value === 'recurring' ? 1 : undefined, // Monday as default
    });
  };
  
  // Get day name from day of week
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  // Handle time slot creation
  const handleCreateTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTimeSlot.serviceId === 0) {
      alert('Please select a service');
      return;
    }
    
    createSlotMutation.mutate({
      serviceId: newTimeSlot.serviceId,
      date: newTimeSlot.date,
      timeSlot: newTimeSlot.timeSlot,
      dayOfWeek: newTimeSlot.isRecurring ? newTimeSlot.dayOfWeek : undefined,
      isRecurring: newTimeSlot.isRecurring,
      notes: newTimeSlot.notes || undefined,
    }, {
      onSuccess: () => {
        setIsAddTimeSlotModalOpen(false);
        timeSlotsQuery.refetch();
        // Reset form
        setNewTimeSlot({
          serviceId: 0,
          date: new Date().toISOString().split('T')[0],
          timeSlot: '09:00',
          isRecurring: false,
          notes: ''
        });
      },
      onError: (error) => {
        console.error('Error creating time slot:', error);
        alert('Failed to create time slot. Please try again.');
      }
    });
  };

  // Handle time slot deletion
  const handleDeleteTimeSlot = (timeSlotId: number) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      deleteSlotMutation.mutate(timeSlotId, {
        onSuccess: () => {
          timeSlotsQuery.refetch();
        },
        onError: (error) => {
          console.error('Error deleting time slot:', error);
          alert('Failed to delete time slot. Please try again.');
        }
      });
    }
  };
  
  // Format time for display
  const formatTimeDisplay = (timeSlot: string) => {
    return timeSlot;
  };
  
  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Manual refresh handler
  const handleRefresh = () => {
    timeSlotsQuery.refetch();
    servicesQuery.refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Time Slot Management</h2>
          <p className="text-gray-600">Manage your service availability and time slots</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={timeSlotsQuery.isFetching || servicesQuery.isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${(timeSlotsQuery.isFetching || servicesQuery.isFetching) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsAddTimeSlotModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Time Slots
          </Button>
        </div>
      </div>

      {/* Service Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter by Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedService.toString()} 
            onValueChange={(value) => setSelectedService(Number(value))}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a service to view time slots" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Services</SelectItem>
              {servicesQuery.data?.data?.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Time Slots Display */}
      {timeSlotsQuery.isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p>Loading time slots...</p>
            </div>
          </CardContent>
        </Card>
      ) : timeSlotsQuery.error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">
              <p>Error loading time slots. Please try again.</p>
              <Button onClick={handleRefresh} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !timeSlotsQuery.data || timeSlotsQuery.data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No time slots yet</h3>
              <p className="text-gray-500 mb-6">
                {selectedService === 0 
                  ? "You haven't added any time slots yet." 
                  : "No time slots found for the selected service."
                }
              </p>
              <Button 
                onClick={() => setIsAddTimeSlotModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Your First Time Slots
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlotsQuery.data.map((slot) => (
            <Card key={slot.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {slot.isRecurring ? (
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium text-sm text-gray-600">
                        {slot.isRecurring ? 'Weekly' : 'One-time'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {slot.isRecurring 
                        ? getDayName(slot.dayOfWeek || 0) 
                        : formatDateDisplay(slot.date)
                      }
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeDisplay(slot.timeSlot)}
                    </p>
                    {slot.notes && (
                      <p className="text-xs text-gray-500 mt-1">{slot.notes}</p>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteTimeSlot(slot.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    slot.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.available ? 'Available' : 'Booked'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Time Slot Modal */}
      <Dialog open={isAddTimeSlotModalOpen} onOpenChange={setIsAddTimeSlotModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
            <DialogDescription>
              Create time slots for your services. Clients can book these available time slots.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTimeSlot} className="space-y-4">
            <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-time">One-time Slot</TabsTrigger>
                <TabsTrigger value="recurring">Recurring Weekly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="one-time" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={newTimeSlot.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="recurring" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                  <Select 
                    value={newTimeSlot.dayOfWeek?.toString() || '1'} 
                    onValueChange={(value) => handleSelectChange('dayOfWeek', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <Select 
                value={newTimeSlot.serviceId.toString()} 
                onValueChange={(value) => handleSelectChange('serviceId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" disabled>Select a service</SelectItem>
                  {servicesQuery.data?.data?.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time</label>
              <Input
                type="time"
                id="timeSlot"
                name="timeSlot"
                value={newTimeSlot.timeSlot}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={newTimeSlot.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={2}
                placeholder="Add any notes about this time slot..."
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddTimeSlotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSlotMutation.isPending}>
                {createSlotMutation.isPending ? 'Creating...' : 'Create Time Slot'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
