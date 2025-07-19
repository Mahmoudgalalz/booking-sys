import { useForm } from '@tanstack/react-form';
import type { ProviderData } from '../../../lib/types/auth';
import { FileUpload } from '../../ui/FileUpload';

interface ProviderInfoFormProps {
  onSubmit: (data: ProviderData) => void;
  isLoading: boolean;
  error: Error | null;
  onSkip: () => void;
}

export function ProviderInfoForm({
  onSubmit,
  isLoading,
  error,
  onSkip,
}: ProviderInfoFormProps) {
  const form = useForm({
    defaultValues: {
      bio: '',
      specialization: '',
      experience: '',
      profileImage: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Complete your provider profile</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-indigo-800 mb-2">
          Profile Photo
        </label>
        <form.Field
          name="profileImage"
        >
          {(field) => (
            <>
              <FileUpload
                label="Upload Profile Photo"
                onUploadSuccess={(url) => field.handleChange(url)}
                className="w-full"
              />
              {field.state.value && (
                <div className="mt-2 text-sm text-indigo-600">
                  Profile photo uploaded successfully
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-indigo-800">
            Bio
          </label>
          <form.Field 
            name="bio"
            validators={{
              onChange: ({ value }) => {
                if (value && value.length > 500) return 'Bio must be less than 500 characters';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <textarea
                  id="bio"
                  name="bio"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Tell us about yourself..."
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(', ')}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-indigo-800">
            Specialization
          </label>
          <form.Field 
            name="specialization"
            validators={{
              onChange: ({ value }) => {
                if (value && value.length > 100) return 'Specialization must be less than 100 characters';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Your area of expertise"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(', ')}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-indigo-800">
            Experience
          </label>
          <form.Field 
            name="experience"
            validators={{
              onChange: ({ value }) => {
                if (value && value.length > 100) return 'Experience must be less than 100 characters';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="experience"
                  name="experience"
                  type="text"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Years of experience or relevant background"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(', ')}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 border border-indigo-300 rounded-md hover:bg-indigo-50 text-indigo-700 transition-colors"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Complete Profile'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message || 'An error occurred'}
          </div>
        )}
      </form>
    </div>
  );
}
