import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  language: string;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
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
    welcome: 'Welcome back',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netBalance: 'Net Balance',
    savingsRate: 'Savings Rate',
    addTransaction: 'Add Transaction',
    addLoan: 'Add Loan',
    addGoal: 'Add Goal',
    createBudget: 'Create Budget',
    generateReport: 'Generate Report',
  },
  ne: {
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
    welcome: 'फिर्ता स्वागत छ',
    totalIncome: 'कुल आम्दानी',
    totalExpenses: 'कुल खर्च',
    netBalance: 'शुद्ध ब्यालेन्स',
    savingsRate: 'बचत दर',
    addTransaction: 'लेनदेन थप्नुहोस्',
    addLoan: 'ऋण थप्नुहोस्',
    addGoal: 'लक्ष्य थप्नुहोस्',
    createBudget: 'बजेट बनाउनुहोस्',
    generateReport: 'रिपोर्ट उत्पन्न गर्नुहोस्',
  },
  hi: {
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
    welcome: 'वापस स्वागत है',
    totalIncome: 'कुल आय',
    totalExpenses: 'कुल व्यय',
    netBalance: 'शुद्ध शेष',
    savingsRate: 'बचत दर',
    addTransaction: 'लेन-देन जोड़ें',
    addLoan: 'ऋण जोड़ें',
    addGoal: 'लक्ष्य जोड़ें',
    createBudget: 'बजट बनाएं',
    generateReport: 'रिपोर्ट जेनरेट करें',
  },
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  const [currency, setCurrencyState] = useState('NPR');
  const [language, setLanguageState] = useState('en');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'light';
    const savedCurrency = localStorage.getItem('currency') || 'NPR';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setThemeState(savedTheme);
    setCurrencyState(savedCurrency);
    setLanguageState(savedLanguage);
    
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - check system preference
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
  };

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
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
      // Fallback for unsupported locales
      return `${config.symbol}${amount.toLocaleString()}`;
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      currency,
      language,
      setTheme,
      setCurrency,
      setLanguage,
      formatCurrency,
      t,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};