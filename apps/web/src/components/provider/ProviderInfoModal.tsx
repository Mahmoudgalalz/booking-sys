import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ProviderInfoForm } from '../forms/auth/ProviderInfoForm';
import { useProvider } from '../../contexts/ProviderContext';
import type { ProviderData } from '../../lib/types/auth';

export const ProviderInfoModal: React.FC = () => {
  const { 
    showProviderInfoModal, 
    setShowProviderInfoModal, 
    completeProfile 
  } = useProvider();

  const handleSubmit = async (data: ProviderData) => {
    try {
      await completeProfile({
        bio: data.bio,
        specialization: data.specialization,
        experience: data.experience ? Number(data.experience) : undefined,
        profileImage: data.profileImage,
      });
    } catch (error) {
      console.error('Failed to complete provider profile:', error);
      // Error will be handled by the form component
    }
  };

  const handleSkip = () => {
    setShowProviderInfoModal(false);
  };

  return (
    <Dialog open={showProviderInfoModal} onOpenChange={setShowProviderInfoModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-indigo-800">
            Complete Your Provider Profile
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Help clients learn more about your services and expertise
          </p>
        </DialogHeader>
        
        <div className="mt-4">
          <ProviderInfoForm 
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            isLoading={false}
            error={null}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
