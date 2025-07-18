import { ServiceCard } from './ServiceCard';
import type { Service } from '../../api/services';

interface ServicesListProps {
  isLoading: boolean;
  isError: boolean;
  data: Service[] | undefined;
  isProvider: boolean;
  onBookService: (service: Service) => void;
}

export function ServicesList({
  isLoading,
  isError,
  data,
  isProvider,
  onBookService
}: ServicesListProps) {
  if (isLoading) {
    return <div className="col-span-full text-center py-12">Loading services...</div>;
  }
  
  if (isError) {
    return (
      <div className="col-span-full text-center py-12 text-red-500">
        Error loading services. Please try again.
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        No services found. Try a different search term.
      </div>
    );
  }
  
  return (
    <>
      {data.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isProvider={isProvider}
          onBookService={onBookService}
        />
      ))}
    </>
  );
}
