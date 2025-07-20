import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetProviderProfile, useCreateProviderProfile } from '../api/providers';
import { useUserStore } from '../store/userStore';
import type { Provider, CreateProviderProfileData } from '../api/providers';

interface ProviderContextType {
  provider: Provider | null;
  hasCompletedProfile: boolean;
  isLoadingProfile: boolean;
  showProviderInfoModal: boolean;
  setShowProviderInfoModal: (show: boolean) => void;
  completeProfile: (data: CreateProviderProfileData) => Promise<void>;
  refetchProfile: () => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
};

interface ProviderProviderProps {
  children: React.ReactNode;
}

export const ProviderProvider: React.FC<ProviderProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useUserStore();
  const [showProviderInfoModal, setShowProviderInfoModal] = useState(false);
  
  const { 
    data: provider, 
    isLoading: isLoadingProfile, 
    refetch: refetchProfile 
  } = useGetProviderProfile();
  
  const createProfileMutation = useCreateProviderProfile();

  // Check if user is a provider and doesn't have a completed profile
  useEffect(() => {
    if (isAuthenticated && user?.role === 'provider' && !isLoadingProfile) {
      const hasProfile = provider !== null;
      const isProfileComplete = hasProfile && provider?.bio && provider?.specialization;
      
      // Show modal if provider doesn't have a complete profile
      if (!isProfileComplete) {
        setShowProviderInfoModal(true);
      }
    }
  }, [user, provider, isLoadingProfile, isAuthenticated]);

  const completeProfile = async (data: CreateProviderProfileData) => {
    try {
      await createProfileMutation.mutateAsync(data);
      await refetchProfile();
      setShowProviderInfoModal(false);
    } catch (error) {
      console.error('Failed to complete provider profile:', error);
      throw error;
    }
  };

  const hasCompletedProfile = provider !== null && 
    Boolean(provider?.bio) && 
    Boolean(provider?.specialization);

  const value: ProviderContextType = {
    provider: provider ?? null,
    hasCompletedProfile,
    isLoadingProfile,
    showProviderInfoModal,
    setShowProviderInfoModal,
    completeProfile,
    refetchProfile,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
};
