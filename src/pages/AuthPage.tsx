import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Shield, Smartphone } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Get insights into your spending patterns and financial health',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with bank-level security',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your finances anywhere with our responsive design',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
              <Wallet className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold">MoneyMitra</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Take Control of Your Financial Future
          </h2>
          <p className="text-xl text-emerald-100 mb-12">
            The most comprehensive personal finance management platform designed for modern life.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-emerald-100">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full opacity-10 -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full opacity-10 translate-y-24 -translate-x-24" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-emerald-600">MoneyMitra</h1>
              </div>
              <p className="text-gray-600">Your Personal Finance Companion</p>
            </div>

            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
          
          <motion.div 
            className="text-center mt-8 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>© 2025 MoneyMitra. All rights reserved.</p>
            <p className="mt-2">Secure • Private • Reliable</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};