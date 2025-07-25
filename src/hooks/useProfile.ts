import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to fetch profile');
      } else if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          phone: null,
          date_of_birth: null,
          occupation: null,
          monthly_income: 0,
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();
          
        if (createError) {
          toast.error('Failed to create profile');
        } else {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        toast.error('Failed to update profile');
      } else if (data) {
        setProfile(data);
        toast.success('Profile updated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return { data: null, error: new Error('Invalid file type') };
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return { data: null, error: new Error('File too large') };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First, try to delete the old avatar if it exists
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`avatars/${oldFileName}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload avatar');
        return { data: null, error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      toast.success('Profile picture updated successfully!');
      
      return { data: publicUrl, error: null };
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
};