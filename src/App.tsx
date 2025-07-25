import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Loans } from './pages/Loans';
import { Calculator } from './pages/Calculator';
import { Goals } from './pages/Goals';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AppProvider, useApp } from './contexts/AppContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
            <LoadingSpinner size="lg" />
          </div>
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            MoneyMitra
          </motion.h2>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
