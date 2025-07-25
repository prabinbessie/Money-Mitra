import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const schema = yup.object({
  goal_name: yup.string().required('Goal name is required'),
  target_amount: yup.number().positive('Amount must be positive').required('Target amount is required'),
  current_amount: yup.number().min(0, 'Current amount cannot be negative').required('Current amount is required'),
  target_date: yup.string().required('Target date is required'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
  monthly_contribution: yup.number().min(0, 'Monthly contribution cannot be negative').required('Monthly contribution is required'),
  description: yup.string(),
});

interface GoalFormData {
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  monthly_contribution: number;
  description?: string;
}

interface GoalFormProps {
  goal?: any;
  onSubmit: (data: GoalFormData & { status: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    resolver: yupResolver(schema),
    defaultValues: goal ? {
      goal_name: goal.goal_name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date,
      category: goal.category,
      priority: goal.priority,
      monthly_contribution: goal.monthly_contribution,
      description: goal.description,
    } : {
      current_amount: 0,
      monthly_contribution: 0,
      priority: 'medium',
      target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    },
  });

  const handleFormSubmit = (data: GoalFormData) => {
    onSubmit({ 
      ...data, 
      status: goal?.status || 'active'
    });
  };

  const categories = [
    'Emergency Fund',
    'House Down Payment',
    'Car Purchase',
    'Vacation',
    'Education',
    'Retirement',
    'Investment',
    'Wedding',
    'Business',
    'Other'
  ];

  return (
    <motion.form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('goal_name')}
          type="text"
          label="Goal Name"
          placeholder="e.g., Emergency Fund, House Down Payment"
          error={errors.goal_name?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            {...register('category')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('target_amount')}
          type="number"
          step="0.01"
          label="Target Amount (₹)"
          placeholder="Enter target amount"
          error={errors.target_amount?.message}
        />

        <Input
          {...register('current_amount')}
          type="number"
          step="0.01"
          label="Current Amount (₹)"
          placeholder="Enter current saved amount"
          error={errors.current_amount?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('target_date')}
          type="date"
          label="Target Date"
          error={errors.target_date?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            {...register('priority')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <Input
        {...register('monthly_contribution')}
        type="number"
        step="0.01"
        label="Monthly Contribution (₹)"
        placeholder="Enter monthly contribution amount"
        error={errors.monthly_contribution?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          placeholder="Add any additional details about your goal..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} size="lg" fullWidth>
          {goal ? 'Update Goal' : 'Add Goal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};