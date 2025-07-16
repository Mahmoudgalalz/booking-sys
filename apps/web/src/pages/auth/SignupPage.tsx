import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { authService, RegisterData, ProviderData } from '../../lib/utils/auth-service';
import { validateEmail, validatePassword, validateRequired } from '../../lib/utils/form-utils';

enum SignupStep {
  ROLE_SELECTION = 0,
  BASIC_INFO = 1,
  PROVIDER_INFO = 2,
  COMPLETE = 3,
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [basicInfo, setBasicInfo] = useState<Partial<RegisterData>>({});
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      if (selectedRole === 2) { // Provider role ID
        setCurrentStep(SignupStep.PROVIDER_INFO);
      } else {
        setCurrentStep(SignupStep.COMPLETE);
      }
    },
  });
  
  // Provider profile mutation
  const providerProfileMutation = useMutation({
    mutationFn: (data: ProviderData) => authService.completeProviderProfile(data),
    onSuccess: () => {
      setCurrentStep(SignupStep.COMPLETE);
    },
  });
  
  // Basic info form
  const basicInfoForm = useForm<RegisterData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: selectedRole || 1,
    },
    onSubmit: async ({ value }) => {
      setBasicInfo(value);
      await registerMutation.mutateAsync(value);
    },
  });
  
  // Provider info form
  const providerInfoForm = useForm<ProviderData>({
    defaultValues: {
      bio: '',
      specialization: '',
      experience: '',
    },
    onSubmit: async ({ value }) => {
      await providerProfileMutation.mutateAsync(value);
    },
  });
  
  // Handle role selection
  const handleRoleSelect = (roleId: number) => {
    setSelectedRole(roleId);
    setCurrentStep(SignupStep.BASIC_INFO);
  };
  
  // Render step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case SignupStep.ROLE_SELECTION:
        return (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold">Choose your account type</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleRoleSelect(1)}
                className="p-6 border rounded-lg hover:bg-gray-100 flex flex-col items-center"
              >
                <span className="text-xl font-semibold">User</span>
                <p className="text-sm text-gray-600 mt-2">Book services from providers</p>
              </button>
              <button
                onClick={() => handleRoleSelect(2)}
                className="p-6 border rounded-lg hover:bg-gray-100 flex flex-col items-center"
              >
                <span className="text-xl font-semibold">Provider</span>
                <p className="text-sm text-gray-600 mt-2">Offer services to users</p>
              </button>
            </div>
          </div>
        );
        
      case SignupStep.BASIC_INFO:
        return (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create your account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                basicInfoForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <basicInfoForm.Field
                  name="firstName"
                  validators={{ onChange: validateRequired }}
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
                      {field.state.meta.touchedErrors && (
                        <div className="text-red-500 text-sm mt-1">
                          {field.state.meta.touchedErrors}
                        </div>
                      )}
                    </>
                  )}
                </basicInfoForm.Field>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <basicInfoForm.Field
                  name="lastName"
                  validators={{ onChange: validateRequired }}
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
                      {field.state.meta.touchedErrors && (
                        <div className="text-red-500 text-sm mt-1">
                          {field.state.meta.touchedErrors}
                        </div>
                      )}
                    </>
                  )}
                </basicInfoForm.Field>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <basicInfoForm.Field
                  name="email"
                  validators={{
                    onChange: (value) => validateRequired(value) || validateEmail(value),
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
                      {field.state.meta.touchedErrors && (
                        <div className="text-red-500 text-sm mt-1">
                          {field.state.meta.touchedErrors}
                        </div>
                      )}
                    </>
                  )}
                </basicInfoForm.Field>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <basicInfoForm.Field
                  name="password"
                  validators={{
                    onChange: (value) => validateRequired(value) || validatePassword(value),
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
                      {field.state.meta.touchedErrors && (
                        <div className="text-red-500 text-sm mt-1">
                          {field.state.meta.touchedErrors}
                        </div>
                      )}
                    </>
                  )}
                </basicInfoForm.Field>
              </div>
              
              <basicInfoForm.Field name="roleId">
                {(field) => (
                  <input
                    type="hidden"
                    name="roleId"
                    value={selectedRole || 1}
                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                  />
                )}
              </basicInfoForm.Field>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(SignupStep.ROLE_SELECTION)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {registerMutation.isPending ? 'Signing up...' : 'Continue'}
                </button>
              </div>
              
              {registerMutation.isError && (
                <div className="text-red-500 text-sm mt-2">
                  {(registerMutation.error as Error).message || 'An error occurred during signup'}
                </div>
              )}
            </form>
          </div>
        );
        
      case SignupStep.PROVIDER_INFO:
        return (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Complete your provider profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                providerInfoForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="bio" className="block text-sm font-medium">
                  Bio
                </label>
                <providerInfoForm.Field name="bio">
                  {(field) => (
                    <textarea
                      id="bio"
                      name="bio"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Tell us about yourself..."
                    />
                  )}
                </providerInfoForm.Field>
              </div>
              
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium">
                  Specialization
                </label>
                <providerInfoForm.Field name="specialization">
                  {(field) => (
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Your area of expertise"
                    />
                  )}
                </providerInfoForm.Field>
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium">
                  Experience
                </label>
                <providerInfoForm.Field name="experience">
                  {(field) => (
                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Years of experience or relevant background"
                    />
                  )}
                </providerInfoForm.Field>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(SignupStep.COMPLETE)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={providerProfileMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {providerProfileMutation.isPending ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
              
              {providerProfileMutation.isError && (
                <div className="text-red-500 text-sm mt-2">
                  {(providerProfileMutation.error as Error).message || 'An error occurred'}
                </div>
              )}
            </form>
          </div>
        );
        
      case SignupStep.COMPLETE:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Registration Complete!</h2>
            <p className="mb-6">Your account has been successfully created.</p>
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
            >
              Go to Dashboard
            </a>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>
        {renderStep()}
      </div>
      
      {currentStep !== SignupStep.COMPLETE && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
