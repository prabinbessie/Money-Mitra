import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      icon: '✅',
      style: {
        background: '#10B981',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      icon: '❌',
      style: {
        background: '#EF4444',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showInfo,
      showWarning,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};