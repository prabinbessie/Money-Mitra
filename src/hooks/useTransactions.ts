import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { transactionsAPI } from '../services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await transactionsAPI.getAll(user.id);
      if (error) {
        toast.error('Failed to fetch transactions');
      } else if (data) {
        setTransactions(data);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await transactionsAPI.create({
        ...transactionData,
        user_id: user.id,
      });
      
      if (error) {
        toast.error('Failed to add transaction');
      } else if (data) {
        setTransactions(prev => [data, ...prev]);
        toast.success('Transaction added successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await transactionsAPI.update(id, updates);
      
      if (error) {
        toast.error('Failed to update transaction');
      } else if (data) {
        setTransactions(prev => prev.map(t => t.id === id ? data : t));
        toast.success('Transaction updated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await transactionsAPI.delete(id);
      
      if (error) {
        toast.error('Failed to delete transaction');
      } else {
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast.success('Transaction deleted successfully!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};