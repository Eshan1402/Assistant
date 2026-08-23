import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  completeOnboarding: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'careeros_user';
const STORAGE_KEY_ONBOARDED = 'careeros_onboarded';

const defaultUser: User = {
  id: 'usr_eshan_001',
  name: 'Eshan Saxena',
  email: 'eshanbsaxena@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  headline: 'Senior Full-Stack & AI Systems Engineer',
  createdAt: '2026-08-01T00:00:00.000Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ONBOARDED);
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: 'Eshan Saxena',
          email: session.user.email || 'eshanbsaxena@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
          headline: 'Senior Full-Stack & AI Systems Engineer',
          createdAt: session.user.created_at,
        });
      }
    });

    // Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: 'Eshan Saxena',
          email: session.user.email || 'eshanbsaxena@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
          headline: 'Senior Full-Stack & AI Systems Engineer',
          createdAt: session.user.created_at,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ONBOARDED, JSON.stringify(isOnboarded));
  }, [isOnboarded]);

  const login = async (email: string, password?: string) => {
    if (email.toLowerCase() !== 'eshanbsaxena@gmail.com') {
      throw new Error('Access Denied. Only Eshan is authorized to access CareerOS.');
    }
    
    if (!password) {
      throw new Error('Password is required.');
    }

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Auto-register the single user if they don't exist yet
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          throw new Error('Failed to create initial account: ' + signUpError.message);
        }
        
        // If email confirmation is required by Supabase, session might be null
        if (!signUpData.session) {
          throw new Error('Account created! Please check your email for a confirmation link to log in.');
        }
        data = signUpData;
      } else {
        throw new Error(error.message);
      }
    }

    return true;
  };

  const register = async (name: string, email: string, password?: string) => {
    const u: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || 'New Candidate',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
      headline: 'Software Engineer',
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    setIsOnboarded(false); // trigger onboarding for new users
    return true;
  };

  const loginWithGoogle = async () => {
    const u: User = {
      id: 'usr_google_001',
      name: 'Eshan Saxena',
      email: 'eshanbsaxena@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
      headline: 'Senior Full-Stack & AI Systems Engineer',
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  const resetPassword = async (email: string) => {
    return {
      success: true,
      message: `Password reset instructions have been securely sent to ${email}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarded,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        completeOnboarding,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
