import { useForm } from '@tanstack/react-form';
import type { RegisterData } from '../../../lib/utils/auth-service';

interface BasicInfoFormProps {
  onSubmit: (data: RegisterData) => void;
  isLoading: boolean;
  error: Error | null;
  selectedRole: number;
  onBack: () => void;
}

export function BasicInfoForm({
  onSubmit,
  isLoading,
  error,
  selectedRole,
  onBack,
}: BasicInfoFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: selectedRole || 1,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">Create your account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'First name is required';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Last name is required';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Email is required';
                const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                if (!emailRegex.test(value)) return 'Invalid email format';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return undefined;
              }
            }}
          >
            {(field) => (
              <>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
        
        <form.Field name="roleId">
          {(field) => (
            <input
              type="hidden"
              name="roleId"
              value={selectedRole || 1}
              onChange={(e) => field.handleChange(parseInt(e.target.value))}
            />
          )}
        </form.Field>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Signing up...' : 'Continue'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message || 'An error occurred during signup'}
          </div>
        )}
      </form>
    </div>
  );
}
