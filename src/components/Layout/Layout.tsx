import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          className="p-4 sm:p-6 lg:p-8 min-h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer Credit */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            Developed by <span className="font-semibold text-emerald-600">Prabin Bhandari</span>
          </p>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};
