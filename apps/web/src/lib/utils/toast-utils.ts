import { toast } from 'sonner';

interface ApiResponse {
  message?: string;
  messages?: string[];
  error?: string;
  errors?: string[];
  [key: string]: unknown;
}

export const showResponseToast = (response: unknown, isError = false): void => {
  if (!response) return;
  
  const apiResponse = response as ApiResponse;
  
  // Try to extract a message from the response
  const message = extractFirstMessage(apiResponse);
  
  if (!message) return;
  
  if (isError) {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

export const extractFirstMessage = (response: ApiResponse): string | undefined => {
  // Check for direct message property
  if (typeof response.message === 'string' && response.message) {
    return response.message;
  }
  
  // Check for messages array
  if (Array.isArray(response.messages) && response.messages.length > 0) {
    return response.messages[0];
  }
  
  // Check for error property
  if (typeof response.error === 'string' && response.error) {
    return response.error;
  }
  
  // Check for errors array
  if (Array.isArray(response.errors) && response.errors.length > 0) {
    return response.errors[0];
  }
  
  // If response is a string itself
  if (typeof response === 'string') {
    return response;
  }
  
  return undefined;
};
