// Root layout component for router
import { Outlet } from '@tanstack/react-router';
import MainLayout from './MainLayout';

// This component wraps MainLayout and handles the outlet from TanStack Router
export default function RootLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
