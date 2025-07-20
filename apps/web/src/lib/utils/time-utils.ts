/**
 * Utility functions for time formatting and manipulation
 */

/**
 * Format time from a timestamp string, extracting only hours and minutes
 * Handles backend timestamps where only the time portion is relevant
 * @param timeString - ISO timestamp string (e.g., "1970-01-01T00:00:00.010Z")
 * @returns Formatted time string (e.g., "12:30 PM")
 */
export const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    
    // Extract hours and minutes from the timestamp
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    // Create a new date with just the time portion for formatting
    const timeOnly = new Date();
    timeOnly.setHours(hours, minutes, 0, 0);
    
    return timeOnly.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

/**
 * Format time in 24-hour format
 * @param timeString - ISO timestamp string
 * @returns Formatted time string (e.g., "14:30")
 */
export const formatTime24 = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

/**
 * Get time duration between two timestamps
 * @param startTime - Start time timestamp
 * @param endTime - End time timestamp
 * @returns Duration in minutes
 */
export const getTimeDuration = (startTime: string, endTime: string): number => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes();
    const endMinutes = end.getUTCHours() * 60 + end.getUTCMinutes();
    
    return endMinutes - startMinutes;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};
