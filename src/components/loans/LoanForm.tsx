import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { calculateEMI } from '../../utils/calculations';

const schema = yup.object({
  loan_name: yup.string().required('Loan name is required'),
  principal_amount: yup.number().positive('Amount must be positive').required('Principal amount is required'),
  interest_rate: yup.number().positive('Interest rate must be positive').required('Interest rate is required'),
  tenure_months: yup.number().positive('Tenure must be positive').required('Tenure is required'),
  start_date: yup.string().required('Start date is required'),
  lender_name: yup.string(),
  loan_type: yup.string().required('Loan type is required'),
});

interface LoanFormData {
  loan_name: string;
  principal_amount: number;
  interest_rate: number;
  tenure_months: number;
  start_date: string;
  lender_name?: string;
  loan_type: string;
}

interface LoanFormProps {
  onSubmit: (data: LoanFormData & { emi_amount: number; remaining_amount: number; payments_made: number; status: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoanFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      start_date: new Date().toISOString().split('T')[0],
      loan_type: 'personal',
    },
  });

  const watchedValues = watch();
  const emiAmount = watchedValues.principal_amount && watchedValues.interest_rate && watchedValues.tenure_months
    ? calculateEMI(watchedValues.principal_amount, watchedValues.interest_rate, watchedValues.tenure_months)
    : 0;

  const handleFormSubmit = (data: LoanFormData) => {
    const emi_amount = calculateEMI(data.principal_amount, data.interest_rate, data.tenure_months);
    onSubmit({ 
      ...data, 
      emi_amount,
      remaining_amount: data.principal_amount,
      payments_made: 0,
      status: 'active'
    });
  };

  const loanTypes = [
    'Personal Loan',
    'Home Loan',
    'Car Loan',
    'Education Loan',
    'Business Loan',
    'Credit Card',
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
          {...register('loan_name')}
          type="text"
          label="Loan Name"
          placeholder="e.g., Home Loan, Car Loan"
          error={errors.loan_name?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
          <select
            {...register('loan_type')}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 px-4 py-3"
          >
            {loanTypes.map(type => (
              <option key={type} value={type.toLowerCase().replace(' ', '_')}>
                {type}
              </option>
            ))}
          </select>
          {errors.loan_type && (
            <p className="mt-1 text-sm text-red-600">{errors.loan_type.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('principal_amount')}
          type="number"
          step="0.01"
          label="Principal Amount (₹)"
          placeholder="Enter loan amount"
          error={errors.principal_amount?.message}
        />

        <Input
          {...register('interest_rate')}
          type="number"
          step="0.01"
          label="Interest Rate (% per annum)"
          placeholder="Enter annual interest rate"
          error={errors.interest_rate?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('tenure_months')}
          type="number"
          label="Tenure (Months)"
          placeholder="Enter tenure in months"
          error={errors.tenure_months?.message}
        />

        <Input
          {...register('start_date')}
          type="date"
          label="Start Date"
          error={errors.start_date?.message}
        />
      </div>

      <Input
        {...register('lender_name')}
        type="text"
        label="Lender Name (Optional)"
        placeholder="e.g., SBI, HDFC Bank"
        error={errors.lender_name?.message}
      />

      {emiAmount > 0 && (
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-medium mb-2">Monthly EMI</p>
            <p className="text-3xl font-bold text-emerald-800">
              ₹{emiAmount.toLocaleString('en-IN')}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-600">Total Payment</p>
                <p className="font-semibold text-emerald-800">
                  ₹{(emiAmount * watchedValues.tenure_months).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-emerald-600">Total Interest</p>
                <p className="font-semibold text-emerald-800">
                  ₹{((emiAmount * watchedValues.tenure_months) - watchedValues.principal_amount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} size="lg" fullWidth>
          Add Loan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};