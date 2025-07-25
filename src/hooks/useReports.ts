import { useState, useEffect } from 'react';
import { Report } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useTransactions } from './useTransactions';
import toast from 'react-hot-toast';

export const useReports = () => {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to fetch reports');
      } else if (data) {
        setReports(data);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'monthly' | 'yearly' | 'custom', startDate: string, endDate: string) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      // Filter transactions for the date range
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      });

      const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const netSavings = totalIncome - totalExpenses;

      // Calculate top categories
      const categoryTotals = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const topCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      const reportData = {
        user_id: user.id,
        report_type: type,
        period_start: startDate,
        period_end: endDate,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_savings: netSavings,
        top_categories: topCategories,
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();
      
      if (error) {
        toast.error('Failed to generate report');
      } else if (data) {
        setReports(prev => [data, ...prev]);
        toast.success('Report generated successfully!');
      }
      
      return { data, error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { data: null, error };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Failed to delete report');
      } else {
        setReports(prev => prev.filter(r => r.id !== id));
        toast.success('Report deleted successfully!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const getFinancialInsights = () => {
    if (transactions.length === 0) return [];

    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth.getMonth() && 
             transactionDate.getFullYear() === currentMonth.getFullYear();
    });

    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === lastMonth.getMonth() && 
             transactionDate.getFullYear() === lastMonth.getFullYear();
    });

    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastIncome = lastMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const insights = [];

    // Spending trend
    if (lastExpenses > 0) {
      const expenseChange = ((currentExpenses - lastExpenses) / lastExpenses) * 100;
      if (expenseChange > 20) {
        insights.push({
          type: 'warning',
          title: 'High Spending Alert',
          message: `Your expenses increased by ${expenseChange.toFixed(1)}% this month.`,
          icon: '⚠️',
        });
      } else if (expenseChange < -10) {
        insights.push({
          type: 'success',
          title: 'Great Savings!',
          message: `You reduced expenses by ${Math.abs(expenseChange).toFixed(1)}% this month.`,
          icon: '🎉',
        });
      }
    }

    // Savings rate
    const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing expenses.`,
        icon: '💰',
      });
    } else if (savingsRate > 30) {
      insights.push({
        type: 'success',
        title: 'Excellent Savings!',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Keep it up!`,
        icon: '🏆',
      });
    }

    return insights;
  };

  return {
    reports,
    loading,
    generateReport,
    deleteReport,
    getFinancialInsights,
    refetch: fetchReports,
  };
};