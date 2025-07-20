import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegister, useCompleteProviderProfile, useLogin } from '../../api/auth';
import { RoleSelectionForm } from '../../components/forms/auth/RoleSelectionForm';
import { BasicInfoForm } from '../../components/forms/auth/BasicInfoForm';
import { ProviderInfoForm } from '../../components/forms/auth/ProviderInfoForm';
import { SignupComplete } from '../../components/auth/SignupComplete';
import type { ProviderData, RegisterData, LoginCredentials, Role } from '../../lib/types/auth';

const SignupStep = {
  ROLE_SELECTION: 0,
  BASIC_INFO: 1,
  PROVIDER_INFO: 2,
  COMPLETE: 3,
} as const;

type SignupStep = typeof SignupStep[keyof typeof SignupStep];

export default function SignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [registrationData, setRegistrationData] = useState<RegisterData | null>(null);
  
  const registerMutation = useRegister();
  
  const providerProfileMutation = useCompleteProviderProfile();
  
  const loginMutation = useLogin();
  
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep(SignupStep.BASIC_INFO);
  };
  
  // Handle basic info submission
  const handleBasicInfoSubmit = async (data: RegisterData) => {
    try {
      setRegistrationData(data);
      await registerMutation.mutateAsync(data);
      
      // Explicitly login after registration
      const loginCredentials: LoginCredentials = {
        email: data.email,
        password: data.password
      };
      
      await loginMutation.mutateAsync(loginCredentials);
      
      // Skip provider info step during registration - handle it conditionally in the UI
      setCurrentStep(SignupStep.COMPLETE);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  // Handle provider info submission
  const handleProviderInfoSubmit = async (data: ProviderData) => {
    try {
      await providerProfileMutation.mutateAsync(data);
      
      // If we have registration data and somehow lost login state, login again
      if (registrationData) {
        try {
          const loginCredentials: LoginCredentials = {
            email: registrationData.email,
            password: registrationData.password
          };
          await loginMutation.mutateAsync(loginCredentials);
        } catch (loginError) {
          console.error('Auto-login after provider profile completion failed:', loginError);
        }
      }
      
      setCurrentStep(SignupStep.COMPLETE);
    } catch (error) {
      console.error('Provider profile update failed:', error);
    }
  };
  
  // Render step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case SignupStep.ROLE_SELECTION:
        return (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <RoleSelectionForm onRoleSelect={handleRoleSelect} />
            </div>
          </div>
        );
        
      case SignupStep.BASIC_INFO:
        return (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <BasicInfoForm 
                onSubmit={handleBasicInfoSubmit}
                isLoading={registerMutation.isPending}
                error={registerMutation.error as Error | null}
                selectedRole={selectedRole || 'user'}
                onBack={() => setCurrentStep(SignupStep.ROLE_SELECTION)}
              />
            </div>
          </div>
        );
        
      case SignupStep.PROVIDER_INFO:
        return (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-800">
                Complete your provider profile
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <ProviderInfoForm 
                onSubmit={handleProviderInfoSubmit}
                isLoading={providerProfileMutation.isPending}
                error={providerProfileMutation.error as Error | null}
                onSkip={() => setCurrentStep(SignupStep.COMPLETE)}
              />
            </div>
          </div>
        );
        
      case SignupStep.COMPLETE:
        return (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-800">
                Registration Complete
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <SignupComplete onContinue={() => navigate({ to: '/home' })} />
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Sign Up</h1>
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
