// Root layout component for router
import { Outlet } from '@tanstack/react-router';
import MainLayout from './MainLayout';
import { ToastProvider } from '../ui/ToastProvider';

// This component wraps MainLayout and handles the outlet from TanStack Router
export default function RootLayout() {
  return (
    <MainLayout>
      <ToastProvider />
      <Outlet />
    </MainLayout>
  );
}
