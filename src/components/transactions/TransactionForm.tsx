import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { categoriesAPI } from '../../services/api';

const schema = yup.object({
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  date: yup.string().required('Date is required'),
  payment_method: yup.string(),
});

interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  payment_method?: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const categories = categoriesAPI.getDefault();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TransactionFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchType = watch('type');
  const filteredCategories = categories.filter(cat => cat.type === watchType);

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Esewa',
    'Other Digital Wallet',
    'Cheque',
  ];

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <motion.select
            {...register('type')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
          </motion.select>
        </div>

        <Input
          {...register('amount')}
          type="number"
          step="0.01"
          label="Amount"
          placeholder="Enter amount"
          error={errors.amount?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <motion.select
            {...register('category')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select category</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </motion.select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <Input
          {...register('date')}
          type="date"
          label="Date"
          error={errors.date?.message}
        />
      </div>

      <Input
        {...register('description')}
        type="text"
        label="Description"
        placeholder="Enter description"
        error={errors.description?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method (Optional)</label>
        <motion.select
          {...register('payment_method')}
          className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">Select payment method</option>
          {paymentMethods.map(method => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </motion.select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} size="lg">
          Add Transaction
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};