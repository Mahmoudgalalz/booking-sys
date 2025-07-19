import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { servicesApi, type Service } from '../../lib/api/services-api';
import { useServiceMutations } from '../../lib/hooks/useServiceMutations';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FileUpload } from '../ui/FileUpload';

interface ServicesTabProps {
  onEditService: (service: Service) => void;
}

export function ServicesTab({ onEditService }: ServicesTabProps) {
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    duration: 30,
    image: '',
  });

  // Get service mutations
  const { createService, deleteService } = useServiceMutations();

  // Fetch provider services
  const servicesQuery = useQuery({
    queryKey: ['provider-services'],
    queryFn: () => servicesApi.getProviderServices(),
  });

  // Handle service deletion
  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate(serviceId);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value,
    });
  };

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setNewService({
      ...newService,
      image: url,
    });
  };

  // Handle service creation
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    createService.mutate(newService, {
      onSuccess: () => {
        setIsAddServiceModalOpen(false);
        setNewService({
          title: '',
          description: '',
          price: 0,
          category: '',
          duration: 30,
          image: '',
        });
      },
    });
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
          Error loading services. Please try again.
        </div>
      ) : servicesQuery.data?.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesQuery.data?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{formatPrice(service.price)} • {service.duration} min</CardDescription>
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
      )}

      {/* Add Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service for your clients to book.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateService}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-indigo-800">Title</label>
                <Input
                  id="title"
                  name="title"
                  value={newService.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-indigo-800">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-indigo-800">Price ($)</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium text-indigo-800">Duration (minutes)</label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={newService.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-indigo-800">Category</label>
                <Input
                  id="category"
                  name="category"
                  value={newService.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium text-indigo-800">Service Image</label>
                <div className="flex justify-center">
                  <FileUpload
                    onUploadSuccess={handleImageUpload}
                    label="Upload Service Image"
                    className="mt-2"
                  />
                </div>
                {newService.image && (
                  <p className="text-xs text-indigo-600 mt-2">Image uploaded successfully!</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createService.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {createService.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
