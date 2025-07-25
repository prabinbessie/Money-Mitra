import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { categoriesAPI } from '../../services/api';

const schema = yup.object({
  category: yup.string().required('Category is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  period: yup.string().required('Period is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  alert_threshold: yup.number().min(1, 'Threshold must be at least 1%').max(100, 'Threshold cannot exceed 100%').required('Alert threshold is required'),
});

interface BudgetFormData {
  category: string;
  amount: number;
  period: 'monthly' | 'yearly' | 'weekly';
  start_date: string;
  end_date: string;
  alert_threshold: number;
}

interface BudgetFormProps {
  budget?: any;
  onSubmit: (data: BudgetFormData & { spent_amount: number }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const categories = categoriesAPI.getDefault().filter(cat => cat.type === 'expense');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BudgetFormData>({
    resolver: yupResolver(schema),
    defaultValues: budget ? {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date,
      alert_threshold: budget.alert_threshold,
    } : {
      period: 'monthly',
      alert_threshold: 80,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    },
  });

  const handleFormSubmit = (data: BudgetFormData) => {
    onSubmit({ 
      ...data, 
      spent_amount: budget?.spent_amount || 0
    });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            {...register('category')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <Input
          {...register('amount')}
          type="number"
          step="0.01"
          label="Budget Amount (₹)"
          placeholder="Enter budget amount"
          error={errors.amount?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <select
            {...register('period')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          >
            <option value="weekly">📅 Weekly</option>
            <option value="monthly">🗓️ Monthly</option>
            <option value="yearly">📆 Yearly</option>
          </select>
          {errors.period && (
            <p className="mt-1 text-sm text-red-600">{errors.period.message}</p>
          )}
        </div>

        <Input
          {...register('start_date')}
          type="date"
          label="Start Date"
          error={errors.start_date?.message}
        />

        <Input
          {...register('end_date')}
          type="date"
          label="End Date"
          error={errors.end_date?.message}
        />
      </div>

      <Input
        {...register('alert_threshold')}
        type="number"
        min="1"
        max="100"
        label="Alert Threshold (%)"
        placeholder="Enter alert threshold (e.g., 80)"
        helperText="Get notified when you reach this percentage of your budget"
        error={errors.alert_threshold?.message}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} size="lg" fullWidth>
          {budget ? 'Update Budget' : 'Create Budget'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};