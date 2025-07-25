import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { GoalForm } from '../components/goals/GoalForm';
import { useGoals } from '../hooks/useGoals';
import { formatCurrency, formatDate, calculateGoalProgress, calculateMonthsToGoal } from '../utils/calculations';

export const Goals: React.FC = () => {
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const handleAddGoal = async (formData: any) => {
    await addGoal(formData);
    setIsModalOpen(false);
  };

  const handleEditGoal = async (formData: any) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, formData);
      setEditingGoal(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.current_amount, 0);

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
            Financial Goals
          </motion.h1>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Set, track, and achieve your financial milestones
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button onClick={() => setIsModalOpen(true)} size="lg" icon={<Plus className="h-5 w-5" />}>
            Add Goal
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{activeGoals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.map((goal, index) => {
              const progress = calculateGoalProgress(goal.current_amount, goal.target_amount);
              const monthsToGoal = calculateMonthsToGoal(goal.current_amount, goal.target_amount, goal.monthly_contribution);
              const isOverdue = new Date(goal.target_date) < new Date() && goal.status !== 'completed';
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.goal_name}</h3>
                        <p className="text-sm text-gray-600">{goal.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Target Amount</span>
                        <span className="font-medium">{formatCurrency(goal.target_amount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Amount</span>
                        <span className="font-medium text-green-600">{formatCurrency(goal.current_amount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly Contribution</span>
                        <span className="font-medium">{formatCurrency(goal.monthly_contribution)}</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            className={`h-3 rounded-full ${
                              progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Target Date</span>
                        <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(goal.target_date)}
                        </span>
                      </div>

                      {monthsToGoal !== Infinity && goal.status === 'active' && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-700">
                            <strong>{monthsToGoal}</strong> months to reach your goal at current contribution rate
                          </p>
                        </div>
                      )}

                      {goal.description && (
                        <p className="text-sm text-gray-600 italic">{goal.description}</p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGoal(goal);
                            setIsModalOpen(true);
                          }}
                          icon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteGoal(goal.id)}
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
              <Target className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No financial goals yet</h3>
            <p className="text-gray-600 mb-6">Start by setting your first financial goal to track your progress</p>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
              Set Your First Goal
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
        size="lg"
      >
        <GoalForm
          goal={editingGoal}
          onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};