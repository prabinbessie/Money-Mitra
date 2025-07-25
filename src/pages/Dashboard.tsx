import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/dashboard/StatCard';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { Card } from '../components/ui/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import { categoriesAPI } from '../services/api';
import { formatCurrency, formatDate, getMonthlyData, getCategoryBreakdown } from '../utils/calculations';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  const categories = categoriesAPI.getDefault();
  const expensesByCategory = getCategoryBreakdown(currentMonthTransactions, 'expense')
    .map(item => {
      const category = categories.find(cat => cat.name === item.category);
      return {
        category: item.category,
        amount: item.amount,
        color: category?.color || '#6B7280',
      };
    })
    .slice(0, 8); // Top 8 categories

  const recentTransactions = transactions.slice(0, 5);
  const monthlyData = getMonthlyData(transactions, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}! 👋
        </motion.h1>
        <motion.p 
          className="text-gray-600 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Balance"
          amount={balance}
          icon={DollarSign}
          color="emerald"
          index={0}
        />
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          color="green"
          index={1}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          color="red"
          index={2}
        />
        <StatCard
          title="Savings Rate"
          amount={`${savingsRate.toFixed(1)}%`}
          icon={PiggyBank}
          color="blue"
          index={3}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Chart */}
        <ExpenseChart data={expensesByCategory} />

        {/* Recent Transactions */}
        <Card hover>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <motion.div 
              className="text-sm text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
              whileHover={{ scale: 1.05 }}
            >
              View All
            </motion.div>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <motion.div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`text-right font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📊
                </div>
                <p className="text-gray-500 text-lg">No transactions yet</p>
                <p className="text-gray-400">Start by adding your first transaction</p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <Card hover>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">6-Month Trend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyData.map((month, index) => (
              <motion.div
                key={month.month}
                className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-medium text-gray-600 mb-2">{month.month}</p>
                <p className="text-lg font-bold text-green-600">+{formatCurrency(month.income)}</p>
                <p className="text-lg font-bold text-red-600">-{formatCurrency(month.expenses)}</p>
                <p className={`text-sm font-medium mt-1 ${
                  month.savings >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  Net: {formatCurrency(month.savings)}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};