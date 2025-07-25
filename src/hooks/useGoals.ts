import { useState, useEffect } from 'react';
import { FinancialGoal } from '../types';
import { goalsAPI } from '../services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await goalsAPI.getAll(user.id);
      if (error) {
        toast.error('Failed to fetch goals');
      } else if (data) {
        setGoals(data);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await goalsAPI.create({
        ...goalData,
        user_id: user.id,
      });
      
      if (error) {
        toast.error('Failed to add goal');
      } else if (data) {
        setGoals(prev => [data, ...prev]);
        toast.success('Goal added successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    try {
      const { data, error } = await goalsAPI.update(id, updates);
      
      if (error) {
        toast.error('Failed to update goal');
      } else if (data) {
        setGoals(prev => prev.map(g => g.id === id ? data : g));
        toast.success('Goal updated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await goalsAPI.delete(id);
      
      if (error) {
        toast.error('Failed to delete goal');
      } else {
        setGoals(prev => prev.filter(g => g.id !== id));
        toast.success('Goal deleted successfully!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
};