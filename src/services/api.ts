import { supabase } from './supabase';
import { Transaction, Loan, Budget, FinancialGoal, Category, LoanPayment, Notification } from '../types';

// Performance optimization: Generic caching layer and invalidation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const cachedFetch = async <T>(
  cacheKey: string,
  fetcher: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> => {
  const cached = getCachedData(cacheKey);
  if (cached) return { data: cached, error: null };

  const { data, error } = await fetcher();
  if (data && !error) {
    setCachedData(cacheKey, data);
  }
  return { data, error };
};

const invalidateCache = (keyPattern: string) => {
  for (const key of cache.keys()) {
    if (key.startsWith(keyPattern)) {
      cache.delete(key);
    }
  }
};

// -----------------------------------
// Transactions API
// -----------------------------------
export const transactionsAPI = {
  getAll: (userId: string) =>
    cachedFetch(`transactions_${userId}`, () =>
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
    ),

  create: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    invalidateCache(`transactions_${transaction.user_id}`);
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Transaction>) => {
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingTransaction?.user_id) {
      invalidateCache(`transactions_${existingTransaction.user_id}`);
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingTransaction?.user_id) {
      invalidateCache(`transactions_${existingTransaction.user_id}`);
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    return { error };
  },

  getByDateRange: async (userId: string, startDate: string, endDate: string) => {
    return supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
  },

  getByCategory: async (userId: string, category: string) => {
    return supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('date', { ascending: false });
  },
};

// -----------------------------------
// Loans API
// -----------------------------------
export const loansAPI = {
  getAll: (userId: string) =>
    cachedFetch(`loans_${userId}`, () =>
      supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ),

  create: async (loan: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
    invalidateCache(`loans_${loan.user_id}`);
    const { data, error } = await supabase
      .from('loans')
      .insert([loan])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Loan>) => {
    const { data: existingLoan } = await supabase
      .from('loans')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingLoan?.user_id) {
      invalidateCache(`loans_${existingLoan.user_id}`);
    }

    const { data, error } = await supabase
      .from('loans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { data: existingLoan } = await supabase
      .from('loans')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingLoan?.user_id) {
      invalidateCache(`loans_${existingLoan.user_id}`);
    }

    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id);
    return { error };
  },

  getPayments: async (loanId: string) => {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('*')
      .eq('loan_id', loanId)
      .order('payment_number', { ascending: true });
    return { data, error };
  },

  addPayment: async (payment: Omit<LoanPayment, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('loan_payments')
      .insert([payment])
      .select()
      .single();
    return { data, error };
  },
};

// -----------------------------------
// Budgets API
// -----------------------------------
export const budgetsAPI = {
  getAll: (userId: string) =>
    cachedFetch(`budgets_${userId}`, () =>
      supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ),

  create: async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    invalidateCache(`budgets_${budget.user_id}`);
    const { data, error } = await supabase
      .from('budgets')
      .insert([budget])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Budget>) => {
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingBudget?.user_id) {
      invalidateCache(`budgets_${existingBudget.user_id}`);
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingBudget?.user_id) {
      invalidateCache(`budgets_${existingBudget.user_id}`);
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// -----------------------------------
// Financial Goals API
// -----------------------------------
export const goalsAPI = {
  getAll: (userId: string) =>
    cachedFetch(`goals_${userId}`, () =>
      supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ),

  create: async (goal: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) => {
    invalidateCache(`goals_${goal.user_id}`);
    const { data, error } = await supabase
      .from('financial_goals')
      .insert([goal])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<FinancialGoal>) => {
    const { data: existingGoal } = await supabase
      .from('financial_goals')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingGoal?.user_id) {
      invalidateCache(`goals_${existingGoal.user_id}`);
    }

    const { data, error } = await supabase
      .from('financial_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { data: existingGoal } = await supabase
      .from('financial_goals')
      .select('user_id')
      .eq('id', id)
      .single();

    if (existingGoal?.user_id) {
      invalidateCache(`goals_${existingGoal.user_id}`);
    }

    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// -----------------------------------
// Categories API
// -----------------------------------
export const categoriesAPI = {
  getDefault: (): Category[] => [
    { id: '1', name: 'Food & Dining', type: 'expense', color: '#EF4444', icon: 'UtensilsCrossed', is_custom: false },
    { id: '2', name: 'Transportation', type: 'expense', color: '#3B82F6', icon: 'Car', is_custom: false },
    { id: '3', name: 'Shopping', type: 'expense', color: '#8B5CF6', icon: 'ShoppingBag', is_custom: false },
    { id: '4', name: 'Entertainment', type: 'expense', color: '#EC4899', icon: 'Music', is_custom: false },
    { id: '5', name: 'Bills & Utilities', type: 'expense', color: '#F59E0B', icon: 'FileText', is_custom: false },
    { id: '6', name: 'Healthcare', type: 'expense', color: '#10B981', icon: 'Heart', is_custom: false },
    { id: '7', name: 'Education', type: 'expense', color: '#06B6D4', icon: 'GraduationCap', is_custom: false },
    { id: '8', name: 'Travel', type: 'expense', color: '#F97316', icon: 'Plane', is_custom: false },
    { id: '9', name: 'Insurance', type: 'expense', color: '#84CC16', icon: 'Shield', is_custom: false },
    { id: '10', name: 'Salary', type: 'income', color: '#10B981', icon: 'Banknote', is_custom: false },
    { id: '11', name: 'Freelance', type: 'income', color: '#8B5CF6', icon: 'Briefcase', is_custom: false },
    { id: '12', name: 'Investment', type: 'income', color: '#F59E0B', icon: 'TrendingUp', is_custom: false },
    { id: '13', name: 'Business', type: 'income', color: '#3B82F6', icon: 'Building', is_custom: false },
    { id: '14', name: 'Rental', type: 'income', color: '#EC4899', icon: 'Home', is_custom: false },
    { id: '15', name: 'Others', type: 'expense', color: '#6B7280', icon: 'MoreHorizontal', is_custom: false },
  ],

  getAll: (userId: string) =>
    cachedFetch(`categories_${userId}`, () =>
      supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
    ),

  create: async (category: Omit<Category, 'id'>) => {
    if (!category.user_id) throw new Error('user_id required in category');
    invalidateCache(`categories_${category.user_id}`);
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    return { data, error };
  },
};

// -----------------------------------
// Notifications API
// -----------------------------------
export const notificationsAPI = {
  getAll: (userId: string) =>
    cachedFetch(`notifications_${userId}`, () =>
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ),

  markAsRead: async (id: string, userId: string) => {
    invalidateCache(`notifications_${userId}`);
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  create: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    if (!notification.user_id) throw new Error('user_id required in notification');
    invalidateCache(`notifications_${notification.user_id}`);
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();
    return { data, error };
  },
};
