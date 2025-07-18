import { useState } from 'react';
import { useServices } from '../../api/services';
import { ServicesList } from './ServicesList';
import { Pagination } from '../common/Pagination';
import { SearchBar } from '../common/SearchBar';
import type { Service } from '../../api/services';

interface ServicesContainerProps {
  isProvider: boolean;
  onBookService: (service: Service) => void;
}

export function ServicesContainer({ isProvider, onBookService }: ServicesContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch services with pagination and search
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
  
  return (
    <>
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
          onBookService={onBookService}
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
    </>
  );
}
