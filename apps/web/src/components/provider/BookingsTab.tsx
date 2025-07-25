import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils/cn';
import { bookingsApi, type PaginatedBookingsResponse } from '../../lib/api/bookings-api';

export function BookingsTab() {
  const bookingsQuery = useQuery<PaginatedBookingsResponse>({
    queryKey: ['provider-bookings'],
    queryFn: () => bookingsApi.getProviderBookings(),
  });



  const formatTimeFromISO = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatBookedAt = (bookedAt: string) => {
    const date = new Date(bookedAt);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    };
  };



  const handleUpdateStatus = (bookingId: number, status: string) => {
    // This would normally call the API to update booking status
    console.log(`Updating booking ${bookingId} to status: ${status}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-800">Your Bookings</h2>
      </div>

      {bookingsQuery.isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : bookingsQuery.error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-16 h-16 text-red-400" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Bookings</h3>
                <p className="text-gray-500">There was an error loading your bookings. Please try again.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !bookingsQuery.data?.items || bookingsQuery.data.items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-gray-400">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500">When clients book your services, they'll appear here.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookingsQuery.data.items.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.timeSlot.service.title}</h3>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full",
                          getStatusBadgeClass(booking.status)
                        )}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{booking.user.firstName} {booking.user.lastName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {(() => {
                              const bookedTime = formatBookedAt(booking.bookedAt);
                              return `${bookedTime.date} at ${bookedTime.time}`;
                            })()} 
                            ({formatTimeFromISO(booking.timeSlot.startTime)} - {formatTimeFromISO(booking.timeSlot.endTime)})
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        <span>Service Duration: {booking.timeSlot.service.duration} minutes</span>
                        {booking.timeSlot.service.category && (
                          <span className="ml-3">Category: {booking.timeSlot.service.category}</span>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">Note: {booking.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-800 border-green-300 hover:border-green-400"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800 border-red-300 hover:border-red-400"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-800 border-indigo-300 hover:border-indigo-400"
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}