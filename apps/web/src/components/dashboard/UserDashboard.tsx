import { useState } from 'react';
import { useServices } from '../../api/services';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import { UserHeader } from '../../components/common/UserHeader';
import { ServicesList } from '../../components/services/ServicesList';
import BookingModal from '../../components/booking/BookingModal';
import { useUserStore } from '../../store/userStore';
import type { Service } from '../../api/services';

export default function UserDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { user } = useUserStore();
  const isProvider = user?.role === 'provider';
  
  // Fetch services with pagination and search using our API service
  const servicesQuery = useServices(currentPage, searchTerm);
  
  // Handle search input change with reset to first page
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
  
  // Handle successful booking
  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    // Could refresh services data here if needed
  };
  
  return (
    <div className="container mx-auto p-4">
      <UserHeader title="Available Services" />
      
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          placeholder="Search services..."
        />
      </div>
      
      {/* Services listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServicesList
          isLoading={servicesQuery.isLoading}
          isError={servicesQuery.isError}
          data={servicesQuery.data?.data}
          isProvider={isProvider}
          onBookService={openBookingModal}
        />
      </div>
      
      {/* Pagination */}
      {servicesQuery.data && (
        <Pagination
          currentPage={servicesQuery.data.meta.currentPage}
          lastPage={servicesQuery.data.meta.lastPage}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Booking Modal */}
      {isBookingModalOpen && selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
