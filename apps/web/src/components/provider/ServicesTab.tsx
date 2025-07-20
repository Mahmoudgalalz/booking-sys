import { useState } from 'react';
import { useProviderServices, useCreateService, useDeleteService, type Service, type CreateSlotData } from '../../api/services';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FileUpload } from '../ui/FileUpload';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';

interface ServicesTabProps {
  onEditService: (service: Service) => void;
}

export function ServicesTab({ onEditService }: ServicesTabProps) {
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: '',
    duration: 30,
    image: '',
    slots: [] as CreateSlotData[],
  });
  
  const [newSlot, setNewSlot] = useState<CreateSlotData>({
    date: '',
    duration: 30,
    startTime: 9, // 9 AM
    endTime: 10, // 10 AM
    dayOfWeek: 1, // Monday
    isRecurring: false,
  });

  // Use the newer API hooks
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();

  // Fetch provider services with pagination
  const servicesQuery = useProviderServices(currentPage);

  // Handle service deletion
  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutateAsync(serviceId);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: name === 'duration' ? Number(value) : value,
    });
  };

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setNewService({
      ...newService,
      image: url,
    });
  };

  // Handle adding a slot
  const handleAddSlot = () => {
    if (newSlot.date || newSlot.isRecurring) {
      const slotToAdd = { ...newSlot };
      
      // For non-recurring slots, convert date to ISO 8601 format
      if (!newSlot.isRecurring && newSlot.date) {
        // Convert date string (YYYY-MM-DD) to ISO 8601 format
        const dateObj = new Date(newSlot.date + 'T00:00:00.000Z');
        slotToAdd.date = dateObj.toISOString();
      }
      
      setNewService({
        ...newService,
        slots: [...newService.slots, slotToAdd],
      });
      setNewSlot({
        date: '',
        duration: 30,
        startTime: 9,
        endTime: 10,
        dayOfWeek: 1,
        isRecurring: false,
      });
    }
  };

  // Handle removing a slot
  const handleRemoveSlot = (index: number) => {
    setNewService({
      ...newService,
      slots: newService.slots.filter((_, i) => i !== index),
    });
  };

  // Handle slot input change
  const handleSlotChange = (field: keyof CreateSlotData, value: string | number | boolean) => {
    setNewSlot({
      ...newSlot,
      [field]: value,
    });
  };

  // Handle service creation
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newService.slots.length === 0) {
      alert('Please add at least one time slot for your service.');
      return;
    }
    
    // Process slots to ensure proper date and time formatting for backend
    const processedSlots = newService.slots.map(slot => {
      // Convert hour numbers to ISO 8601 time strings
      // Create a base date (1970-01-01) and set the hours/minutes
      const startTimeDate = new Date('1970-01-01T00:00:00.000Z');
      startTimeDate.setUTCHours(slot.startTime, 0, 0, 0);
      const startTimeISO = startTimeDate.toISOString();
      
      const endTimeDate = new Date('1970-01-01T00:00:00.000Z');
      endTimeDate.setUTCHours(slot.endTime, 0, 0, 0);
      const endTimeISO = endTimeDate.toISOString();
      
      let processedDate = slot.date;
      
      if (!slot.isRecurring && slot.date) {
        // Ensure non-recurring slots have proper ISO date
        if (!slot.date.includes('T')) {
          const dateObj = new Date(slot.date + 'T00:00:00.000Z');
          processedDate = dateObj.toISOString();
        }
      } else if (slot.isRecurring) {
        // For recurring slots, backend still requires a valid date
        // Use current date as a placeholder since it's recurring
        const currentDate = new Date();
        processedDate = currentDate.toISOString();
      }
      
      // Create backend-compatible slot object
      return {
        date: processedDate,
        startTime: startTimeISO,
        endTime: endTimeISO,
        dayOfWeek: slot.dayOfWeek,
        isRecurring: slot.isRecurring,
        duration: slot.duration
      };
    });
    
    // Create service data for backend API (backend expects ISO strings for startTime/endTime)
    const serviceData = {
      ...newService,
      duration: Number(newService.duration) || 30,
      slots: processedSlots,
    };
    
    // Debug: Log the actual payload being sent
    console.log('Service creation payload:', JSON.stringify(serviceData, null, 2));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createServiceMutation.mutateAsync(serviceData as any)
      .then(() => {
        setIsAddServiceModalOpen(false);
        setNewService({
          title: '',
          description: '',
          category: '',
          duration: 30,
          image: '',
          slots: [],
        });
        setNewSlot({
          date: '',
          duration: 30,
          startTime: 9,
          endTime: 10,
          dayOfWeek: 1,
          isRecurring: false,
        });
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-800">Your Services</h2>
        <Button 
          onClick={() => setIsAddServiceModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add New Service
        </Button>
      </div>

      {servicesQuery.isLoading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : servicesQuery.error ? (
        <div className="text-center py-8 text-red-500">
          Error loading services: {(servicesQuery.error as Error).message}
        </div>
      ) : !servicesQuery.data || !servicesQuery.data.data || servicesQuery.data.data.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">You haven't added any services yet.</p>
            <Button 
              onClick={() => setIsAddServiceModalOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesQuery.data?.data?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.duration} min</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{service.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  onClick={() => onEditService(service)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
            ))}
          </div>
          
          {/* Pagination controls */}
          {servicesQuery.data && servicesQuery.data.meta && servicesQuery.data.meta.lastPage > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              
              {Array.from({ length: servicesQuery.data.meta.lastPage }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, servicesQuery.data.meta.lastPage))}
                disabled={currentPage === servicesQuery.data.meta.lastPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service to offer to your clients.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateService} className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={newService.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                id="category"
                name="category"
                value={newService.category}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={newService.duration}
                onChange={handleInputChange}
                min="15"
                step="15"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <FileUpload onUploadSuccess={handleImageUpload} />
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Time Slots
                </label>
                <span className="text-xs text-gray-500">
                  {newService.slots.length} slot{newService.slots.length !== 1 ? 's' : ''} added
                </span>
              </div>
              
              {/* Existing Slots Display */}
              {newService.slots.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {newService.slots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span>
                          {slot.isRecurring 
                            ? `Weekly on ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][slot.dayOfWeek]}` 
                            : new Date(slot.date).toLocaleDateString()}
                        </span>
                        <Clock className="h-4 w-4 text-indigo-600" />
                        <span>{slot.startTime}:00 - {slot.endTime}:00</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSlot(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Slot Form */}
              <div className="border border-gray-200 rounded-md p-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newSlot.isRecurring}
                    onChange={(e) => handleSlotChange('isRecurring', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                    Recurring weekly slot
                  </label>
                </div>
                
                {newSlot.isRecurring ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Day of Week
                    </label>
                    <select
                      value={newSlot.dayOfWeek}
                      onChange={(e) => handleSlotChange('dayOfWeek', Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => handleSlotChange('date', e.target.value)}
                      className="text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Time
                    </label>
                    <select
                      value={newSlot.startTime}
                      onChange={(e) => handleSlotChange('startTime', Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <select
                      value={newSlot.endTime}
                      onChange={(e) => handleSlotChange('endTime', Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button
                  type="button"
                  onClick={handleAddSlot}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!newSlot.date && !newSlot.isRecurring}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddServiceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createServiceMutation.isPending}
              >
                {createServiceMutation.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
