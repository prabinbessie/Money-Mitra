export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  occupation?: string;
  monthly_income?: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  payment_method?: string;
  tags?: string[];
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  budget_limit?: number;
  is_custom: boolean;
}

export interface Loan {
  id: string;
  user_id: string;
  loan_name: string;
  principal_amount: number;
  interest_rate: number;
  tenure_months: number;
  emi_amount: number;
  start_date: string;
  status: 'active' | 'completed' | 'defaulted' | 'paused';
  remaining_amount: number;
  payments_made: number;
  next_payment_date: string;
  lender_name?: string;
  loan_type: string;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  payment_date: string;
  amount: number;
  principal_amount: number;
  interest_amount: number;
  remaining_balance: number;
  payment_number: number;
  status: 'paid' | 'pending' | 'overdue';
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly' | 'weekly';
  start_date: string;
  end_date: string;
  spent_amount: number;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  monthly_contribution: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  report_type: 'monthly' | 'yearly' | 'custom';
  period_start: string;
  period_end: string;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  top_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  created_at: string;
}