import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, ProfileResponse } from '../services/apiService';

interface ProfileContextType {
  profile: ProfileResponse['profile'] | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfileImage: (imageUri: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileResponse['profile'] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      setProfile(response.profile);
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      // Don't set profile to null on error, keep existing data
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const updateProfileImage = (imageUri: string) => {
    if (profile) {
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          profile_image: imageUri
        }
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const value: ProfileContextType = {
    profile,
    loading,
    refreshProfile,
    updateProfileImage,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
