import { useBookableIntervals } from '../../lib/api/timeslots-api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, Calendar, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface BookableIntervalsProps {
  serviceId: number;
  date: string;
  onBookInterval?: (intervalId: string) => void;
  showBookingButton?: boolean;
}

export function BookableIntervals({ 
  serviceId, 
  date, 
  onBookInterval,
  showBookingButton = true 
}: BookableIntervalsProps) {
  const { 
    data: intervals = [], 
    isLoading, 
    error, 
    isRefetching,
    refetch 
  } = useBookableIntervals(serviceId, date);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Loading Available Time Slots...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Error Loading Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Failed to load available time slots. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (intervals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            No Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            No time slots are available for {formatDate(date)}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const service = intervals[0]?.service;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Available Time Slots
            {isRefetching && (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        {service && (
          <div className="text-sm text-gray-600">
            <p><strong>{service.title}</strong> • {service.duration} minutes</p>
            <p className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              {formatDate(date)}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {intervals.map((interval) => (
            <div
              key={interval.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                interval.booked
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {interval.booked ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <div className="font-medium">
                    {formatTime(interval.startTime)} - {formatTime(interval.endTime)}
                  </div>
                  <div className="text-xs opacity-75">
                    {interval.booked ? 'Booked' : 'Available'}
                  </div>
                </div>
              </div>
              
              {showBookingButton && !interval.booked && onBookInterval && (
                <Button
                  onClick={() => onBookInterval(interval.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Book Now
                </Button>
              )}
              
              {interval.booked && (
                <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex items-center justify-between">
          <span>
            {intervals.filter(i => !i.booked).length} of {intervals.length} slots available
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Updates every 10 seconds
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
