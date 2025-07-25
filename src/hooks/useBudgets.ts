import { useState, useEffect } from 'react';
import { Budget } from '../types';
import { budgetsAPI } from '../services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useBudgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await budgetsAPI.getAll(user.id);
      if (error) {
        toast.error('Failed to fetch budgets');
      } else if (data) {
        setBudgets(data);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await budgetsAPI.create({
        ...budgetData,
        user_id: user.id,
      });
      
      if (error) {
        toast.error('Failed to add budget');
      } else if (data) {
        setBudgets(prev => [data, ...prev]);
        toast.success('Budget added successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await budgetsAPI.update(id, updates);
      
      if (error) {
        toast.error('Failed to update budget');
      } else if (data) {
        setBudgets(prev => prev.map(b => b.id === id ? data : b));
        toast.success('Budget updated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await budgetsAPI.delete(id);
      
      if (error) {
        toast.error('Failed to delete budget');
      } else {
        setBudgets(prev => prev.filter(b => b.id !== id));
        toast.success('Budget deleted successfully!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
};