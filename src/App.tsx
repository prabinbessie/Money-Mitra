import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';

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
import { SettingsProvider } from './contexts/SettingsContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'loans', element: <Loans /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'goals', element: <Goals /> },
      { path: 'budgets', element: <Budgets /> },
      { path: 'reports', element: <Reports /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> },
      { path: '/', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

const AppContent: React.FC = () => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">Loading your financial dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <RouterProvider router={router} />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AppProvider>
  );
};

export default App;
