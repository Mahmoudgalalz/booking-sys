import { Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import HomePage from '../../pages/home/HomePage';

export default function HomeRoute() {
  const { user } = useUserStore();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <HomePage />;
}
