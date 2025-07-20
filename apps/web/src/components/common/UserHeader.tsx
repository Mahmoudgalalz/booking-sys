import { useUserStore } from '../../store/userStore';

interface UserHeaderProps {
  title: string;
}

export function UserHeader({ title }: UserHeaderProps) {
  const { isProvider } = useUserStore();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        {isProvider ? 'Your Dashboard' : title}
      </h1>
    </div>
  );
}
