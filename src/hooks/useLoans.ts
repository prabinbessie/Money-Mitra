import { useState, useEffect } from 'react';
import { Loan, LoanPayment } from '../types';
import { loansAPI } from '../services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLoans();
    }
  }, [user]);

  const fetchLoans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await loansAPI.getAll(user.id);
      if (error) {
        toast.error('Failed to fetch loans');
      } else if (data) {
        setLoans(data);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addLoan = async (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await loansAPI.create({
        ...loanData,
        user_id: user.id,
      });
      
      if (error) {
        toast.error('Failed to add loan');
      } else if (data) {
        setLoans(prev => [data, ...prev]);
        toast.success('Loan added successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const updateLoan = async (id: string, updates: Partial<Loan>) => {
    try {
      const { data, error } = await loansAPI.update(id, updates);
      
      if (error) {
        toast.error('Failed to update loan');
      } else if (data) {
        setLoans(prev => prev.map(l => l.id === id ? data : l));
        toast.success('Loan updated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      const { error } = await loansAPI.delete(id);
      
      if (error) {
        toast.error('Failed to delete loan');
      } else {
        setLoans(prev => prev.filter(l => l.id !== id));
        toast.success('Loan deleted successfully!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const addPayment = async (payment: Omit<LoanPayment, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await loansAPI.addPayment(payment);
      
      if (error) {
        toast.error('Failed to add payment');
      } else if (data) {
        toast.success('Payment added successfully!');
        await fetchLoans(); // Refresh loans to get updated amounts
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  return {
    loans,
    loading,
    addLoan,
    updateLoan,
    deleteLoan,
    addPayment,
    refetch: fetchLoans,
  };
};