import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useUserBookings, useProviderBookings, useCancelBooking } from '../../api/bookings';
import type { Booking } from '../../api/bookings';
import { formatTime } from '../../lib/utils/time-utils';

export default function BookingsPage() {
  const { isProvider } = useUserStore();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Use different query based on user role
  const userBookingsQuery = useUserBookings(page, limit);
  const providerBookingsQuery = useProviderBookings(page, limit);
  
  // Use the appropriate query based on user role
  const bookingsQuery = isProvider ? providerBookingsQuery : userBookingsQuery;
  const cancelBookingMutation = useCancelBooking();
  
  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      // Refetch bookings after cancellation
      bookingsQuery.refetch();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Loading state
  if (bookingsQuery.isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {isProvider ? 'Customer Bookings' : 'My Bookings'}
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (bookingsQuery.isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {isProvider ? 'Customer Bookings' : 'My Bookings'}
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load bookings. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  const bookings = bookingsQuery.data?.data || [];
  const meta = bookingsQuery.data?.meta;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isProvider ? 'Customer Bookings' : 'My Bookings'}
      </h1>
      
      {bookings.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">
            {isProvider 
              ? 'No customer bookings found.' 
              : 'You have no bookings yet. Book a service to get started!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Service</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Time</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                {!isProvider && (
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: Booking) => {
                // Format date and time using the new time utility
                const startTimeStr = booking.slot?.startTime || '';
                const endTimeStr = booking.slot?.endTime || '';
                const date = booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : 'N/A';
                const time = `${formatTime(startTimeStr)} - ${formatTime(endTimeStr)}`;
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{booking.id}</td>
                    <td className="py-2 px-4 border-b">{
                      // @ts-expect-error - Handle potential missing service property
                      booking.slot?.service?.title || 'N/A'
                    }</td>
                    <td className="py-2 px-4 border-b">{date}</td>
                    <td className="py-2 px-4 border-b">{time}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    {!isProvider && booking.status === 'confirmed' && (
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                        >
                          {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </td>
                    )}
                    {!isProvider && booking.status !== 'confirmed' && (
                      <td className="py-2 px-4 border-b">-</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {meta && meta.lastPage > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`mx-1 px-3 py-1 rounded ${
                page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`mx-1 px-3 py-1 rounded ${
                  pageNum === page 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === meta.lastPage}
              className={`mx-1 px-3 py-1 rounded ${
                page === meta.lastPage 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
