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

interface ServiceCardProps {
  service: Service;
  isProvider: boolean;
  onBookService: (service: Service) => void;
}

export function ServiceCard({ service, isProvider, onBookService }: ServiceCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
              onClick={() => onBookService(service)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
