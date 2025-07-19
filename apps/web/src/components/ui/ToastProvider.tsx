import { Toaster } from 'sonner';
import type { ToasterProps } from 'sonner';

export function ToastProvider() {
  // Define custom toast options
  const toastOptions: ToasterProps['toastOptions'] = {
    style: {
      background: 'white',
      color: '#4338ca', // indigo-800
      border: '1px solid #e0e7ff', // indigo-100
    },
    // Custom class names for different toast types
    classNames: {
      success: 'bg-blue-50 text-indigo-800 border border-indigo-100',
      error: 'bg-rose-50 text-rose-600 border border-rose-100',
    }
  };
  
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={toastOptions}
    />
  );
}
