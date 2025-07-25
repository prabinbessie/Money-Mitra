import React, { useState } from 'react';
import { Plus, Wallet, TrendingUp, AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency, formatDate } from '../utils/calculations';

export const Budgets: React.FC = () => {
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const handleAddBudget = async (formData: any) => {
    await addBudget(formData);
    setIsModalOpen(false);
  };

  const handleEditBudget = async (formData: any) => {
    if (editingBudget) {
      await updateBudget(editingBudget.id, formData);
      setEditingBudget(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  const getUsagePercentage = (spent: number, budget: number) => {
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'red';
    if (percentage >= 80) return 'yellow';
    return 'green';
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent_amount, 0);
  const activeBudgets = budgets.filter(b => new Date(b.end_date) >= new Date()).length;
  const overBudgetCount = budgets.filter(b => getUsagePercentage(b.spent_amount, b.amount) >= 100).length;

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Budget Planning
          </motion.h1>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Set and track your spending limits with smart alerts
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button onClick={() => setIsModalOpen(true)} size="lg" icon={<Plus className="h-5 w-5" />}>
            Create Budget
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-gray-900">{activeBudgets}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Over Budget</p>
              <p className="text-2xl font-bold text-gray-900">{overBudgetCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budgets Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {budgets.map((budget, index) => {
              const usagePercentage = getUsagePercentage(budget.spent_amount, budget.amount);
              const statusColor = getStatusColor(usagePercentage);
              const isExpired = new Date(budget.end_date) < new Date();
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{budget.category}</h3>
                        <p className="text-sm text-gray-600 capitalize">{budget.period} Budget</p>
                      </div>
                      <div className="flex gap-2">
                        {isExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            Expired
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColor === 'green' ? 'bg-green-100 text-green-700' :
                          statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {usagePercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Budget Amount</span>
                        <span className="font-medium">{formatCurrency(budget.amount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Spent</span>
                        <span className={`font-medium ${
                          usagePercentage >= 100 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {formatCurrency(budget.spent_amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Remaining</span>
                        <span className={`font-medium ${
                          budget.amount - budget.spent_amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(Math.max(0, budget.amount - budget.spent_amount))}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            className={`h-3 rounded-full ${
                              statusColor === 'green' ? 'bg-green-500' :
                              statusColor === 'yellow' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Period</span>
                        <span className="font-medium">
                          {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                        </span>
                      </div>

                      {usagePercentage >= budget.alert_threshold && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            <p className="text-sm text-yellow-800">
                              You've reached {budget.alert_threshold}% of your budget limit
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingBudget(budget);
                            setIsModalOpen(true);
                          }}
                          icon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteBudget(budget.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets created yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first budget to track your spending</p>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
              Create Your First Budget
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
        size="lg"
      >
        <BudgetForm
          budget={editingBudget}
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};