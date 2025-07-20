import { Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import SignupPage from '../../pages/auth/SignupPage';

export default function IndexRoute() {
  const { user } = useUserStore();
  
  if (!user) {
    return <SignupPage />;
  }
  
  // Redirect providers to provider dashboard, regular users to home
  if (user.role === 'provider') {
    return <Navigate to="/provider" />;
  } else {
    return <Navigate to="/home" />;
  }
}
