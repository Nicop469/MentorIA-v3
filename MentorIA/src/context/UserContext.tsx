import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProfile, DiagnosticResult, PracticeSession } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storageService';

interface UserContextType {
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addDiagnosticResult: (result: DiagnosticResult) => void;
  addPracticeSession: (session: PracticeSession) => void;
  clearProfile: () => void;
  isTeacherMode: boolean;
  toggleTeacherMode: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(userProfile.isTeacher);
  
  useEffect(() => {
    // Load user profile from localStorage on mount
    setUserProfile(getUserProfile());
  }, []);
  
  useEffect(() => {
    // Save user profile to localStorage whenever it changes
    saveUserProfile(userProfile);
    setIsTeacherMode(userProfile.isTeacher);
  }, [userProfile]);
  
  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...profile,
    }));
  };
  
  const addDiagnosticResult = (result: DiagnosticResult) => {
    setUserProfile(prevProfile => {
      const updatedResults = [...prevProfile.diagnosticResults];
      
      // Update or add the result for the course
      const existingIndex = updatedResults.findIndex(r => r.courseId === result.courseId);
      if (existingIndex >= 0) {
        updatedResults[existingIndex] = result;
      } else {
        updatedResults.push(result);
      }
      
      return {
        ...prevProfile,
        diagnosticResults: updatedResults,
      };
    });
  };
  
  const addPracticeSession = (session: PracticeSession) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      practiceSessions: [...prevProfile.practiceSessions, session],
    }));
  };
  
  const clearProfile = () => {
    const emptyProfile: UserProfile = {
      name: '',
      isTeacher: false,
      diagnosticResults: [],
      practiceSessions: [],
    };
    
    setUserProfile(emptyProfile);
  };
  
  const toggleTeacherMode = () => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      isTeacher: !prevProfile.isTeacher,
    }));
  };
  
  return (
    <UserContext.Provider
      value={{
        userProfile,
        updateProfile,
        addDiagnosticResult,
        addPracticeSession,
        clearProfile,
        isTeacherMode,
        toggleTeacherMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};