import type { ReactNode } from 'react';
import { authService } from '../../lib/utils/auth-service';

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
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const isProvider = user?.role?.name === 'provider';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-blue-600">BookingApp</a>
              
              {isAuthenticated && (
                <nav className="hidden md:flex space-x-6">
                  <a 
                    href="/" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Home
                  </a>
                  {isProvider ? (
                    <>
                      <a 
                        href="/provider" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Dashboard
                      </a>
                      <a 
                        href="/provider/services" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        My Services
                      </a>
                    </>
                  ) : (
                    <a 
                      href="/bookings" 
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      My Bookings
                    </a>
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
                    onClick={() => authService.logout()}
                    className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/login"
                    className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Log in
                  </a>
                  <a
                    href="/signup"
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign up
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
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} BookingApp. All rights reserved.
                </p>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
