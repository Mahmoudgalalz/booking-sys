import { useUserStore } from '../../store/userStore';
import ProviderDashboard from '../../components/dashboard/ProviderDashboard';
import UserDashboard from '../../components/dashboard/UserDashboard';



export default function HomePage() {
  
  const { user } = useUserStore();
  const isProvider = user?.role === 'provider';
  
  
  return (
    <div className="container mx-auto p-4">
      {isProvider ? <ProviderDashboard /> : <UserDashboard />}
    </div>
  );
}
