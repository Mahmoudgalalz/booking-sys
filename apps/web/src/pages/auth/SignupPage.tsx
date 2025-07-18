import { useState } from 'react';
import { useRegister, useCompleteProviderProfile } from '../../api/auth';
import type { RegisterData, ProviderData } from '../../lib/utils/auth-service';
import { RoleSelectionForm } from '../../components/forms/auth/RoleSelectionForm';
import { BasicInfoForm } from '../../components/forms/auth/BasicInfoForm';
import { ProviderInfoForm } from '../../components/forms/auth/ProviderInfoForm';
import { SignupComplete } from '../../components/auth/SignupComplete';

const SignupStep = {
  ROLE_SELECTION: 0,
  BASIC_INFO: 1,
  PROVIDER_INFO: 2,
  COMPLETE: 3,
} as const;

type SignupStep = typeof SignupStep[keyof typeof SignupStep];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  
  // Register mutation with TanStack Query and Better Fetch
  const registerMutation = useRegister();
  
  // Provider profile mutation with TanStack Query and Better Fetch
  const providerProfileMutation = useCompleteProviderProfile();
  
  // Handle role selection
  const handleRoleSelect = (roleId: number) => {
    setSelectedRole(roleId);
    setCurrentStep(SignupStep.BASIC_INFO);
  };
  
  // Handle basic info submission
  const handleBasicInfoSubmit = async (data: RegisterData) => {
    try {
      await registerMutation.mutateAsync(data);
      if (selectedRole === 2) { // Provider role ID
        setCurrentStep(SignupStep.PROVIDER_INFO);
      } else {
        setCurrentStep(SignupStep.COMPLETE);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  // Handle provider info submission
  const handleProviderInfoSubmit = async (data: ProviderData) => {
    try {
      await providerProfileMutation.mutateAsync(data);
      setCurrentStep(SignupStep.COMPLETE);
    } catch (error) {
      console.error('Provider profile update failed:', error);
    }
  };
  
  // Render step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case SignupStep.ROLE_SELECTION:
        return <RoleSelectionForm onRoleSelect={handleRoleSelect} />;
        
      case SignupStep.BASIC_INFO:
        return (
          <BasicInfoForm 
            onSubmit={handleBasicInfoSubmit}
            isLoading={registerMutation.isPending}
            error={registerMutation.error as Error | null}
            selectedRole={selectedRole || 1}
            onBack={() => setCurrentStep(SignupStep.ROLE_SELECTION)}
          />
        );
        
      case SignupStep.PROVIDER_INFO:
        return (
          <ProviderInfoForm 
            onSubmit={handleProviderInfoSubmit}
            isLoading={providerProfileMutation.isPending}
            error={providerProfileMutation.error as Error | null}
            onSkip={() => setCurrentStep(SignupStep.COMPLETE)}
          />
        );
        
      case SignupStep.COMPLETE:
        return <SignupComplete />;
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
