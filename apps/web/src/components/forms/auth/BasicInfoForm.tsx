import { useForm } from '@tanstack/react-form';
import type { RegisterData, Role } from '../../../lib/types/auth';

interface BasicInfoFormProps {
  onSubmit: (data: RegisterData) => void;
  isLoading: boolean;
  error: Error | null;
  selectedRole: Role;
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
      role: selectedRole,
    },
    onSubmit: async ({ value }) => {
      onSubmit({ ...value });
    },
  });

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-indigo-800">Create your account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-indigo-800">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <label htmlFor="lastName" className="block text-sm font-medium text-indigo-800">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <label htmlFor="email" className="block text-sm font-medium text-indigo-800">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <label htmlFor="password" className="block text-sm font-medium text-indigo-800">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
        
        <form.Field name="role">
          {(field) => (
            <input
              type="hidden"
              name="role"
              value={selectedRole || 'user'}
              onChange={(e) => field.handleChange(e.target.value as Role)}
            />
          )}
        </form.Field>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex w-1/3 justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-2/3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4">
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
