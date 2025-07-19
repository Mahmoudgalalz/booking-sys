import { useState, useRef } from 'react';
import { uploadApi } from '../../lib/api/upload-api';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: Error) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export function FileUpload({
  onUploadSuccess,
  onUploadError,
  label = 'Upload Photo',
  accept = 'image/*',
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const result = await uploadApi.uploadFile(file);
      onUploadSuccess(result.url);
    } catch (error) {
      console.error('Upload failed:', error);
      if (onUploadError && error instanceof Error) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={accept}
        />
        
        {previewUrl ? (
          <div className="relative mb-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1 rounded-full"
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-indigo-300 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
            disabled={isUploading}
          >
            {isUploading ? (
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        )}
        
        <span className="mt-2 text-sm text-gray-600">
          {isUploading ? 'Uploading...' : label}
        </span>
      </div>
    </div>
  );
}
