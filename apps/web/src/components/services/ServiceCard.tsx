import { Clock, User, Star } from 'lucide-react';
import type { Service, TimeSlot } from '../../api/services';

interface ServiceCardProps {
  service: Service;
  isProvider: boolean;
  onBookService: (service: Service, timeSlot?: TimeSlot) => void;
}

export function ServiceCard({ service, isProvider, onBookService }: ServiceCardProps) {

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
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
        <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
            {service.category}
          </span>
          {service.price && (
            <span className="font-semibold text-green-600">${service.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Provider info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{service.provider.bio}</span>
          {service.provider.isVerified && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{service.duration} minutes</span>
        </div>
        
        {/* Book Service Button */}
        {!isProvider && (
          <button
            onClick={() => onBookService(service)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Book Service
          </button>
        )}
      </div>
    </div>
  );
}
