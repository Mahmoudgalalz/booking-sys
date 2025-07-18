import { Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import SignupPage from '../../pages/auth/SignupPage';

export default function SignupRoute() {
  const { user } = useUserStore();
  
  if (user) {
    return <Navigate to="/home" />;
  }
  
  return <SignupPage />;
}
