import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useUserBookings, useCancelBooking } from '../../api/bookings';
import type { Booking } from '../../api/bookings';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export default function BookingsPage() {
  const { isProvider } = useUserStore();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const userBookingsQuery = useUserBookings(page, limit);
  const bookingsQuery = userBookingsQuery;
  const cancelBookingMutation = useCancelBooking();
  
  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      bookingsQuery.refetch();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Loading state
  if (bookingsQuery.isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isProvider ? 'Customer Bookings' : 'My Bookings'}
          </h1>
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (bookingsQuery.isError) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isProvider ? 'Customer Bookings' : 'My Bookings'}
          </h1>
        </div>
        
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Failed to load bookings</p>
            </div>
            <p className="text-red-500 mt-2">Please try again later or contact support if the problem persists.</p>
            <Button 
              onClick={() => bookingsQuery.refetch()} 
              variant="outline" 
              className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Extract bookings and pagination info
  const bookings = bookingsQuery.data?.data || [];
  const meta = bookingsQuery.data?.meta;
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isProvider ? 'Customer Bookings' : 'My Bookings'}
          </h1>
        </div>
        
        {meta && (
          <p className="text-sm text-gray-600">
            Showing {bookings.length} of {meta?.total || 0} bookings
          </p>
        )}
      </div>
      
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProvider ? 'No customer bookings yet' : 'No bookings yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isProvider 
                ? 'When customers book your services, they\'ll appear here.' 
                : 'Book a service to get started! Your upcoming appointments will be displayed here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: Booking) => {
            const timeSlot = booking.timeSlot;
            const service = timeSlot?.service;
            
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service?.title || 'Service'}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            Booking #{booking.id}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn('font-medium', getStatusColor(booking.status))}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      {/* Service Description */}
                      {service?.description && (
                        <p className="text-gray-600 text-sm">
                          {service.description}
                        </p>
                      )}
                      
                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(booking.bookedAt)}
                            </p>
                            <p className="text-gray-600">
                              {formatTime(timeSlot?.startTime || '')} - {formatTime(timeSlot?.endTime || '')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Duration */}
                        {service?.duration && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Duration</p>
                              <p className="text-gray-600">{service.duration} minutes</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Category */}
                        {service?.category && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Category</p>
                              <p className="text-gray-600">{service.category}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Notes */}
                      {booking.notes && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Notes</p>
                            <p className="text-gray-600">{booking.notes}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Booking Date */}
                      <div className="text-xs text-gray-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {!isProvider && booking.status === 'confirmed' && (
                      <div className="ml-6">
                        <Button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Pagination */}
      {meta && meta.lastPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, meta.lastPage) }, (_, i) => {
              const pageNum = i + Math.max(1, page - 2);
              if (pageNum > meta.lastPage) return null;
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.lastPage}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
