import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../services/supabase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        toast.success('Welcome back!', {
          duration: 3000,
          icon: '👋',
        });
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully', {
          duration: 3000,
          icon: '👋',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in', {
          duration: 4000,
          icon: '❌',
        });
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error: any) {
      const errorMessage = 'An unexpected error occurred';
      toast.error(errorMessage, {
        duration: 4000,
        icon: '❌',
      });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, fullName);
      
      if (error) {
        toast.error(error.message || 'Failed to create account', {
          duration: 4000,
          icon: '❌',
        });
        return { data: null, error };
      }

      toast.success('Account created successfully!', {
        duration: 4000,
        icon: '🎉',
      });
      
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = 'An unexpected error occurred';
      toast.error(errorMessage, {
        duration: 4000,
        icon: '❌',
      });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      
      if (error) {
        toast.error(error.message || 'Failed to sign out', {
          duration: 4000,
          icon: '❌',
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = 'An unexpected error occurred';
      toast.error(errorMessage, {
        duration: 4000,
        icon: '❌',
      });
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      setLoading(true);
      const { data, error } = await auth.updateProfile(updates);
      
      if (error) {
        toast.error(error.message || 'Failed to update profile', {
          duration: 4000,
          icon: '❌',
        });
        return { data: null, error };
      }

      toast.success('Profile updated successfully!', {
        duration: 4000,
        icon: '✅',
      });
      
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = 'An unexpected error occurred';
      toast.error(errorMessage, {
        duration: 4000,
        icon: '❌',
      });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};