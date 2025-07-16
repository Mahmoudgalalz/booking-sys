import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../lib/utils/api-service';
import { authService } from '../../lib/utils/auth-service';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  duration: number;
  provider: {
    id: number;
    bio: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const user = authService.getCurrentUser();
  const isProvider = user?.role.name === 'provider';
  
  // Fetch services with pagination and search
  const servicesQuery = useQuery({
    queryKey: ['services', currentPage, searchTerm],
    queryFn: () => apiService.get<PaginatedResponse<Service>>(
      `/services?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`
    ),
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Open booking modal for a service
  const openBookingModal = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (!servicesQuery.data) return null;
    
    const { currentPage, lastPage } = servicesQuery.data.meta;
    const pages = [];
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border disabled:opacity-50"
      >
        Previous
      </button>
    );
    
    // Page numbers
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            i === currentPage ? 'bg-blue-600 text-white' : 'border'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-3 py-1 rounded-md border disabled:opacity-50"
      >
        Next
      </button>
    );
    
    return <div className="flex space-x-2 justify-center mt-6">{pages}</div>;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isProvider ? 'Your Dashboard' : 'Available Services'}
        </h1>
        
        {/* User profile/logout section */}
        <div className="flex items-center space-x-4">
          <span className="font-medium">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => authService.logout()}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <span className="absolute left-3 top-3">🔍</span>
        </div>
      </div>
      
      {/* Services listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesQuery.isLoading ? (
          <div className="col-span-full text-center py-12">Loading services...</div>
        ) : servicesQuery.isError ? (
          <div className="col-span-full text-center py-12 text-red-500">
            Error loading services. Please try again.
          </div>
        ) : servicesQuery.data?.data.length === 0 ? (
          <div className="col-span-full text-center py-12">
            No services found. Try a different search term.
          </div>
        ) : (
          servicesQuery.data?.data.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Service image */}
              <div className="h-48 overflow-hidden">
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
              
              {/* Service details */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{service.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {service.category}
                  </span>
                  <span className="font-semibold">${service.price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {service.duration} min • By {service.provider.user.firstName}{' '}
                    {service.provider.user.lastName}
                  </span>
                  
                  {!isProvider && (
                    <button
                      onClick={() => openBookingModal(service)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Booking Modal (placeholder) */}
      {isBookingModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Book {selectedService.title}</h2>
            <p className="mb-4">
              Select a time slot to book this service with {selectedService.provider.user.firstName}{' '}
              {selectedService.provider.user.lastName}.
            </p>
            
            {/* Time slot selection would go here */}
            <div className="border rounded-md p-4 mb-4">
              <p className="text-center text-gray-500">
                Time slot selection component would be implemented here
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Booking logic would go here
                  setIsBookingModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
