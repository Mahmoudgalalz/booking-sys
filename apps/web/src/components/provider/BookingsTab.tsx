import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../lib/api/bookings-api';
import { useBookingMutations } from '../../lib/hooks/useBookingMutations';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils/cn';

export function BookingsTab() {
  const { updateBookingStatus } = useBookingMutations();

  const bookingsQuery = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: () => bookingsApi.getProviderBookings(),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = (bookingId: number, status: string) => {
    updateBookingStatus.mutate({ bookingId, status });
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-800">Your Bookings</h2>
      </div>

      {bookingsQuery.isLoading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : bookingsQuery.error ? (
        <div className="text-center py-8 text-red-500">
          Error loading bookings. Please try again.
        </div>
      ) : bookingsQuery.data?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">You don't have any bookings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Date</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Time</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Client</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Service</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Status</th>
                <th className="py-3 text-left font-medium text-sm text-indigo-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsQuery.data?.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="py-4">
                    {formatDate(booking.timeSlot.startTime)}
                  </td>
                  <td className="py-4">
                    {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                  </td>
                  <td className="py-4">
                    {booking.user.firstName} {booking.user.lastName}
                  </td>
                  <td className="py-4">{booking.service.title}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusBadgeClass(booking.status)
                      )}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            disabled={updateBookingStatus.isPending}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            disabled={updateBookingStatus.isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          disabled={updateBookingStatus.isPending}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
