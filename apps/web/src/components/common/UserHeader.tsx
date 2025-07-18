import { useUserStore } from '../../store/userStore';

interface UserHeaderProps {
  title: string;
}

export function UserHeader({ title }: UserHeaderProps) {
  const { user, clearUser } = useUserStore();
  const isProvider = user?.role?.name === 'provider';
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        {isProvider ? 'Your Dashboard' : title}
      </h1>
      
      {/* User profile/logout section */}
      <div className="flex items-center space-x-4">
        <span className="font-medium">
          {user?.firstName} {user?.lastName}
        </span>
        <button
          onClick={clearUser}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
