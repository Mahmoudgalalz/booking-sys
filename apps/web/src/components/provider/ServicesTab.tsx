import { useState } from 'react';
import { useProviderServices, useCreateService, useDeleteService, type Service } from '../../api/services';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    duration: 30,
    image: '',
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
    // Ensure price and duration are valid numbers
    const serviceData = {
      ...newService,
      price: Number(newService.price) || 0, // Convert to number and default to 0 if NaN
      duration: Number(newService.duration) || 30, // Convert to number and default to 30 if NaN
    };
    
    createServiceMutation.mutateAsync(serviceData)
      .then(() => {
        setIsAddServiceModalOpen(false);
        setNewService({
          title: '',
          description: '',
          price: 0,
          category: '',
          duration: 30,
          image: '',
        });
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newService.price}
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
                  required
                />
              </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <FileUpload onUploadSuccess={handleImageUpload} />
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
