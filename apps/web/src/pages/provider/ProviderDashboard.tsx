import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../lib/utils/api-service';
import { authService } from '../../lib/utils/auth-service';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils/cn';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  duration: number;
}

interface Booking {
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

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

type Tab = 'services' | 'bookings' | 'timeslots';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const queryClient = useQueryClient();
  
  const user = authService.getCurrentUser();
  
  // Fetch provider services
  const servicesQuery = useQuery({
    queryKey: ['provider-services'],
    queryFn: () => apiService.get<Service[]>('/providers/services'),
  });
  
  // Fetch provider bookings
  const bookingsQuery = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: () => apiService.get<Booking[]>('/providers/bookings'),
  });
  
  // Fetch provider time slots
  const timeSlotsQuery = useQuery({
    queryKey: ['provider-timeslots'],
    queryFn: () => apiService.get<TimeSlot[]>('/providers/time-slots'),
  });
  
  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: number) => apiService.delete(`/services/${serviceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-services'] });
    },
  });
  
  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: number; status: string }) => 
      apiService.put(`/bookings/${bookingId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Handle service deletion
  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(serviceId);
    }
  };
  
  // Handle booking status update
  const handleUpdateBookingStatus = (bookingId: number, status: string) => {
    updateBookingStatusMutation.mutate({ bookingId, status });
  };
  
  // Render services tab
  const renderServicesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Services</h2>
          <Button 
            onClick={() => {
              setEditingService(null);
              setIsAddServiceModalOpen(true);
            }}
            variant="default"
          >
            Add New Service
          </Button>
        </div>
        
        {servicesQuery.isLoading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : servicesQuery.isError ? (
          <div className="text-center py-8 text-red-500">
            Error loading services. Please try again.
          </div>
        ) : servicesQuery.data?.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent className="pt-6">
              <p className="text-gray-600">You haven't added any services yet.</p>
              <Button
                onClick={() => setIsAddServiceModalOpen(true)}
                className="mt-4"
                variant="default"
              >
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicesQuery.data?.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {service.category}
                    </span>
                    <span className="font-semibold">${service.price.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">{service.duration} min</div>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setEditingService(service);
                      setIsAddServiceModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteService(service.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render bookings tab
  const renderBookingsTab = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsQuery.isLoading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookingsQuery.isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading bookings. Please try again.
            </div>
          ) : bookingsQuery.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium text-sm">Service</th>
                    <th className="py-3 text-left font-medium text-sm">Client</th>
                    <th className="py-3 text-left font-medium text-sm">Date & Time</th>
                    <th className="py-3 text-left font-medium text-sm">Status</th>
                    <th className="py-3 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsQuery.data?.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="py-4">
                        <div className="font-medium">{booking.service.title}</div>
                      </td>
                      <td className="py-4">
                        <div>
                          {booking.user.firstName} {booking.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </td>
                      <td className="py-4">
                        <div>{formatDate(booking.timeSlot.startTime)}</div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-semibold rounded-full",
                            {
                              "bg-green-100 text-green-800": booking.status === 'confirmed',
                              "bg-yellow-100 text-yellow-800": booking.status === 'pending',
                              "bg-red-100 text-red-800": booking.status === 'cancelled',
                              "bg-blue-100 text-blue-800": booking.status === 'completed'
                            }
                          )}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Confirm
                            </Button>
                            <Button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render time slots tab
  const renderTimeSlotsTab = () => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Time Slots</CardTitle>
          <Button
            onClick={() => setIsAddTimeSlotModalOpen(true)}
            variant="default"
            size="sm"
          >
            Add Time Slots
          </Button>
        </CardHeader>
        <CardContent>
          {timeSlotsQuery.isLoading ? (
            <div className="text-center py-8">Loading time slots...</div>
          ) : timeSlotsQuery.isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading time slots. Please try again.
            </div>
          ) : timeSlotsQuery.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">You haven't added any time slots yet.</p>
              <Button
                onClick={() => setIsAddTimeSlotModalOpen(true)}
                className="mt-4"
                variant="default"
              >
                Add Your First Time Slot
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium text-sm">Date</th>
                    <th className="py-3 text-left font-medium text-sm">Time</th>
                    <th className="py-3 text-left font-medium text-sm">Status</th>
                    <th className="py-3 text-left font-medium text-sm">Actions</th>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        
        <Button 
          onClick={() => authService.logout()}
          variant="outline"
          className="mt-4 md:mt-0"
        >
          Logout
        </Button>
      </div>
      
      <Tabs 
        defaultValue="services" 
        value={activeTab} 
        onValueChange={(value: Tab) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services">
          {renderServicesTab()}
        </TabsContent>
        
        <TabsContent value="bookings">
          {renderBookingsTab()}
        </TabsContent>
        
        <TabsContent value="timeslots">
          {renderTimeSlotsTab()}
        </TabsContent>
      </Tabs>
      
      {/* Add Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService 
                ? 'Update your service details below.' 
                : 'Fill in the details to add a new service.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" placeholder="Service title" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" placeholder="Service description" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (min)</label>
                <Input id="duration" type="number" min="15" step="15" placeholder="60" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input id="category" placeholder="Service category" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? 'Update Service' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Time Slot Modal */}
      <Dialog open={isAddTimeSlotModalOpen} onOpenChange={setIsAddTimeSlotModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slots</DialogTitle>
            <DialogDescription>
              Create available time slots for bookings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <Input id="date" type="date" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                <Input id="startTime" type="time" />
              </div>
              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                <Input id="endTime" type="time" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTimeSlotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}