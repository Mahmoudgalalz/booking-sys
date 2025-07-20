import { Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import BookingsPage from '../../pages/bookings/BookingsPage';

export default function BookingsRoute() {
  const { user } = useUserStore();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <BookingsPage />;
}
