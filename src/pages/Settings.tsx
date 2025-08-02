import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Trash2,
  Moon,
  Sun,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
  });
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
  });
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('NPR');
  const [language, setLanguage] = useState('ne');

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  const exportData = () => {
    toast.success('Data export initiated. You will receive an email shortly.');
  };

  const deleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      toast.error('Account deletion is not implemented in this demo');
    }
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      color: 'blue',
      settings: [
        {
          key: 'email',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
        },
        {
          key: 'push',
          label: 'Push Notifications',
          description: 'Receive browser push notifications',
        },
        {
          key: 'budgetAlerts',
          label: 'Budget Alerts',
          description: 'Get notified when approaching budget limits',
        },
        {
          key: 'goalReminders',
          label: 'Goal Reminders',
          description: 'Reminders for financial goals',
        },
        {
          key: 'weeklyReports',
          label: 'Weekly Reports',
          description: 'Receive weekly financial summaries',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      color: 'green',
      settings: [
        {
          key: 'dataSharing',
          label: 'Data Sharing',
          description: 'Share anonymized data for improvements',
        },
        {
          key: 'analytics',
          label: 'Usage Analytics',
          description: 'Help improve the app with usage data',
        },
        {
          key: 'marketing',
          label: 'Marketing Communications',
          description: 'Receive product updates and tips',
        },
      ],
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-gray-700" />
        <motion.h1
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Settings
        </motion.h1>
      </div>
      <motion.p
        className="text-gray-600 mt-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Customize your MoneyMitra experience
      </motion.p>

      {/* Appearance Settings */}
      <Card hover>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Appearance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="theme-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Theme
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                localStorage.setItem('theme', e.target.value);
                // Apply theme to document
                if (e.target.value === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (e.target.value === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Auto mode - check system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
                toast.success('Theme updated');
              }}
              className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
            >
              <option value="light">
                <span role="img" aria-label="sun">
                  🌞
                </span>{' '}
                Light <Sun className="inline h-4 w-4 ml-1" />
              </option>
              <option value="dark">
                <span role="img" aria-label="moon">
                  🌙
                </span>{' '}
                Dark <Moon className="inline h-4 w-4 ml-1" />
              </option>
              <option value="auto">🔄 Auto</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="currency-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                localStorage.setItem('currency', e.target.value);
                toast.success('Currency updated');
              }}
              className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
            >
              <option value="NPR">🇳🇵 Nepali Rupee (रू)</option>
              <option value="INR">🇮🇳 Indian Rupee (₹)</option>
              <option value="USD">🇺🇸 US Dollar ($)</option>
              <option value="EUR">🇪🇺 Euro (€)</option>
              <option value="GBP">🇬🇧 British Pound (£)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem('language', e.target.value);
                toast.success('Language updated');
              }}
              className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
            >
              <option value="ne">🇳🇵 नेपाली (Nepali)</option>
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Dynamic Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <Card key={section.title} hover>
          <div className="flex items-center mb-6">
            <div
              className={`p-2 rounded-lg mr-3 bg-${section.color}-100`}
              // Tailwind classes with dynamic colors require a workaround:
              // We'll use inline style or a small helper class in real projects,
              // but here, just keep it simple:
              style={{
                backgroundColor:
                  section.color === 'blue'
                    ? 'rgba(191, 219, 254, 0.5)'
                    : section.color === 'green'
                    ? 'rgba(187, 247, 208, 0.5)'
                    : undefined,
              }}
            >
              <section.icon
                className={`h-5 w-5 text-${section.color}-600`}
                style={{
                  color:
                    section.color === 'blue'
                      ? '#2563eb'
                      : section.color === 'green'
                      ? '#22c55e'
                      : undefined,
                }}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
          </div>

          <div className="space-y-4">
            {section.settings.map((setting, index) => (
              <motion.div
                key={setting.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 + index * 0.05 }}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{setting.label}</h4>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={
                      section.title === 'Notifications'
                        ? notifications[setting.key as keyof typeof notifications]
                        : privacy[setting.key as keyof typeof privacy]
                    }
                    onChange={(e) => {
                      if (section.title === 'Notifications') {
                        handleNotificationChange(setting.key, e.target.checked);
                      } else {
                        handlePrivacyChange(setting.key, e.target.checked);
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </Card>
      ))}

      {/* Data Management */}
      <Card hover>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Database className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Data Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={exportData}
            icon={<Download className="h-5 w-5" />}
            fullWidth
          >
            Export My Data
          </Button>

          <Button
            variant="danger"
            onClick={deleteAccount}
            icon={<Trash2 className="h-5 w-5" />}
            fullWidth
          >
            Delete Account
          </Button>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Exporting your data will include all transactions,
            goals, budgets, and personal information. Account deletion is permanent and
            cannot be undone.
          </p>
        </div>
      </Card>

      {/* Account Actions */}
      <Card hover>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Actions</h3>
            <p className="text-gray-600">Manage your account and session</p>
          </div>
          <Button variant="outline" onClick={signOut} size="lg">
            Sign Out
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
