import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Auth helpers with improved error handling
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      return { data, error };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Failed to create account' } 
      };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data, error };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Failed to sign in' } 
      };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error: any) {
      return { error: { message: error.message || 'Failed to sign out' } };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error: any) {
      return { user: null, error: { message: error.message || 'Failed to get user' } };
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  updateProfile: async (updates: any) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      return { data, error };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Failed to update profile' } 
      };
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Failed to reset password' } 
      };
    }
  },
};

// Real-time subscriptions
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
};