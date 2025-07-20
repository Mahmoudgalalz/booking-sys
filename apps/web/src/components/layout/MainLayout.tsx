import type { ReactNode } from 'react';
import { useUserStore } from '../../store/userStore';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) {
  const user = useUserStore.getState().user;
  const isAuthenticated = user !== null;
  const isProvider = user?.role === 'provider';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-indigo-600">BookingApp</a>
              
              {isAuthenticated && (
                <nav className="hidden md:flex space-x-6">
                  {isProvider ? (
                    <>
                      <a 
                        href="/provider" 
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        Dashboard
                      </a>
                      <a 
                        href="/provider/services" 
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        My Services
                      </a>
                    </>
                  ) : (
                    <>
                      <a 
                        href="/home" 
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        Home
                      </a>
                      <a 
                        href="/bookings" 
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        My Bookings
                      </a>
                    </>
                  )}
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={() => useUserStore.getState().clearUser()}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <a 
                    href="/login" 
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Login
                  </a>
                  <a 
                    href="/signup" 
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && (
        <footer className="mt-auto bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} BookingApp. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">Terms</a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">Privacy</a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
