import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';

interface AppContextType {
  // Auth
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  
  // Settings
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  language: string;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  
  // Notifications
  notifications: any[];
  unreadCount: number;
  addNotification: (notification: any) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced translations with more comprehensive coverage
const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    loans: 'Loans',
    calculator: 'Calculator',
    goals: 'Goals',
    budgets: 'Budgets',
    reports: 'Reports',
    notifications: 'Notifications',
    settings: 'Settings',
    profile: 'Profile',
    
    // Dashboard
    welcome: 'Welcome back',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netBalance: 'Net Balance',
    savingsRate: 'Savings Rate',
    
    // Actions
    addTransaction: 'Add Transaction',
    addLoan: 'Add Loan',
    addGoal: 'Add Goal',
    createBudget: 'Create Budget',
    generateReport: 'Generate Report',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
  },
  ne: {
    // Navigation
    dashboard: 'ड्यासबोर्ड',
    transactions: 'लेनदेन',
    loans: 'ऋण',
    calculator: 'क्यालकुलेटर',
    goals: 'लक्ष्यहरू',
    budgets: 'बजेट',
    reports: 'रिपोर्टहरू',
    notifications: 'सूचनाहरू',
    settings: 'सेटिङहरू',
    profile: 'प्रोफाइल',
    
    // Dashboard
    welcome: 'फिर्ता स्वागत छ',
    totalIncome: 'कुल आम्दानी',
    totalExpenses: 'कुल खर्च',
    netBalance: 'शुद्ध ब्यालेन्स',
    savingsRate: 'बचत दर',
    
    // Actions
    addTransaction: 'लेनदेन थप्नुहोस्',
    addLoan: 'ऋण थप्नुहोस्',
    addGoal: 'लक्ष्य थप्नुहोस्',
    createBudget: 'बजेट बनाउनुहोस्',
    generateReport: 'रिपोर्ट उत्पन्न गर्नुहोस्',
    
    // Common
    save: 'सेभ गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    loading: 'लोड हुँदै...',
    success: 'सफल',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    transactions: 'लेन-देन',
    loans: 'ऋण',
    calculator: 'कैलकुलेटर',
    goals: 'लक्ष्य',
    budgets: 'बजट',
    reports: 'रिपोर्ट',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    
    // Dashboard
    welcome: 'वापस स्वागत है',
    totalIncome: 'कुल आय',
    totalExpenses: 'कुल व्यय',
    netBalance: 'शुद्ध शेष',
    savingsRate: 'बचत दर',
    
    // Actions
    addTransaction: 'लेन-देन जोड़ें',
    addLoan: 'ऋण जोड़ें',
    addGoal: 'लक्ष्य जोड़ें',
    createBudget: 'बजट बनाएं',
    generateReport: 'रिपोर्ट जेनरेट करें',
    
    // Common
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'डिलीट करें',
    edit: 'एडिट करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  const [currency, setCurrencyState] = useState('NPR');
  const [language, setLanguageState] = useState('en');
  
  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load settings from localStorage
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'light';
      const savedCurrency = localStorage.getItem('currency') || 'NPR';
      const savedLanguage = localStorage.getItem('language') || 'en';
      
      setThemeState(savedTheme);
      setCurrencyState(savedCurrency);
      setLanguageState(savedLanguage);
      applyTheme(savedTheme);

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            toast.success('Welcome back! 👋', {
              duration: 3000,
              style: {
                background: '#10B981',
                color: 'white',
                borderRadius: '12px',
                padding: '16px',
              },
            });
            await loadUserNotifications(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setNotifications([]);
            toast.success('Signed out successfully', {
              duration: 3000,
              style: {
                background: '#6B7280',
                color: 'white',
                borderRadius: '12px',
                padding: '16px',
              },
            });
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserNotifications = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Auth Methods
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Settings Methods
  const applyTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`, {
      duration: 2000,
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '12px',
        padding: '12px',
      },
    });
  };

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
    const currencyNames = {
      NPR: 'Nepali Rupee (रू)',
      INR: 'Indian Rupee (₹)',
      USD: 'US Dollar ($)',
      EUR: 'Euro (€)',
      GBP: 'British Pound (£)'
    };
    toast.success(`Currency changed to ${currencyNames[newCurrency as keyof typeof currencyNames]}`, {
      duration: 2000,
      style: {
        background: '#10B981',
        color: 'white',
        borderRadius: '12px',
        padding: '12px',
      },
    });
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    const languageNames = {
      en: 'English',
      ne: 'नेपाली (Nepali)',
      hi: 'हिंदी (Hindi)'
    };
    toast.success(`Language changed to ${languageNames[newLanguage as keyof typeof languageNames]}`, {
      duration: 2000,
      style: {
        background: '#8B5CF6',
        color: 'white',
        borderRadius: '12px',
        padding: '12px',
      },
    });
  };

  const formatCurrency = (amount: number): string => {
    const currencyMap: Record<string, { locale: string; currency: string; symbol: string }> = {
      NPR: { locale: 'ne-NP', currency: 'NPR', symbol: 'रू' },
      INR: { locale: 'en-IN', currency: 'INR', symbol: '₹' },
      USD: { locale: 'en-US', currency: 'USD', symbol: '$' },
      EUR: { locale: 'de-DE', currency: 'EUR', symbol: '€' },
      GBP: { locale: 'en-GB', currency: 'GBP', symbol: '£' },
    };

    const config = currencyMap[currency] || currencyMap.NPR;
    
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${config.symbol}${amount.toLocaleString()}`;
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  // Notification Methods
  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      // Auth
      user,
      loading,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      
      // Settings
      theme,
      currency,
      language,
      setTheme,
      setCurrency,
      setLanguage,
      formatCurrency,
      t,
      
      // Notifications
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      clearNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};