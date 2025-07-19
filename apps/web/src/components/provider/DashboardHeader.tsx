import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate({ href: '/login' });
  };

  return (
    <div className="flex justify-between items-center pb-6 mb-6 border-b">
      <div>
        <h1 className="text-2xl font-bold text-indigo-800">Provider Dashboard</h1>
        <p className="text-gray-600">Welcome back, <span className="text-indigo-600 font-medium">{userName}</span></p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
