import { Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import ProviderDashboard from '../../pages/provider/ProviderDashboard';

export default function ProviderRoute() {
  const { user } = useUserStore();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== 'provider') {
    return <Navigate to="/home" />;
  }
  
  return <ProviderDashboard />;
}
