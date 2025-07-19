export interface UploadResponse {
  url: string;
  filename: string;
}

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We need to use fetch directly here since FormData can't be JSON stringified
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:3005/upload/file', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const result = await response.json();
    return result.data;
  }
};
