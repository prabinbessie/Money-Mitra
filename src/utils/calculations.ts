import { format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

export const calculateEMI = (principal: number, rate: number, tenure: number) => {
  const monthlyRate = rate / (12 * 100);
  if (monthlyRate === 0) return principal / tenure;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

export const generateAmortizationSchedule = (
  principal: number,
  rate: number,
  tenure: number
) => {
  const monthlyRate = rate / (12 * 100);
  const emi = calculateEMI(principal, rate, tenure);
  const schedule = [];
  let remainingBalance = principal;

  for (let month = 1; month <= tenure; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = emi - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      emi,
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      remainingBalance: Math.round(remainingBalance),
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMM yyyy');
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yy');
};

export const getPercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const calculateSavingsRate = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

export const getMonthlyData = (transactions: any[], months: number = 6) => {
  const monthlyData = [];
  const currentDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(currentDate, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month: format(monthDate, 'MMM yyyy'),
      income,
      expenses,
      savings: income - expenses,
    });
  }

  return monthlyData;
};

export const getCategoryBreakdown = (transactions: any[], type: 'income' | 'expense') => {
  const categoryTotals = transactions
    .filter(t => t.type === type)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateGoalProgress = (currentAmount: number, targetAmount: number): number => {
  if (targetAmount === 0) return 0;
  return Math.min((currentAmount / targetAmount) * 100, 100);
};

export const calculateMonthsToGoal = (
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number
): number => {
  if (monthlyContribution <= 0) return Infinity;
  const remainingAmount = targetAmount - currentAmount;
  if (remainingAmount <= 0) return 0;
  return Math.ceil(remainingAmount / monthlyContribution);
};

export const generateFinancialInsights = (transactions: any[]) => {
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth);
  });

  const lastMonthTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= startOfMonth(lastMonth) && transactionDate <= endOfMonth(lastMonth);
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
  const expenseChange = getPercentageChange(currentExpenses, lastExpenses);
  if (expenseChange > 20) {
    insights.push({
      type: 'warning',
      title: 'High Spending Alert',
      message: `Your expenses increased by ${expenseChange.toFixed(1)}% this month.`,
    });
  } else if (expenseChange < -10) {
    insights.push({
      type: 'success',
      title: 'Great Savings!',
      message: `You reduced expenses by ${Math.abs(expenseChange).toFixed(1)}% this month.`,
    });
  }

  // Savings rate
  const savingsRate = calculateSavingsRate(currentIncome, currentExpenses);
  if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing expenses.`,
    });
  } else if (savingsRate > 30) {
    insights.push({
      type: 'success',
      title: 'Excellent Savings!',
      message: `Your savings rate is ${savingsRate.toFixed(1)}%. Keep it up!`,
    });
  }

  return insights;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
  }).format(value);
};
