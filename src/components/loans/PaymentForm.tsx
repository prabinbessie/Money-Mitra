import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/calculations';

const schema = yup.object({
  payment_date: yup.string().required('Payment date is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
});

interface PaymentFormData {
  payment_date: string;
  amount: number;
}

interface PaymentFormProps {
  loan: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  loan,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      payment_date: new Date().toISOString().split('T')[0],
      amount: loan.emi_amount,
    },
  });

  const watchAmount = watch('amount');
  const interestAmount = (loan.remaining_amount * (loan.interest_rate / 100 / 12));
  const principalAmount = Math.max(0, watchAmount - interestAmount);
  const newBalance = Math.max(0, loan.remaining_amount - principalAmount);

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit({
      loan_id: loan.id,
      payment_date: data.payment_date,
      amount: data.amount,
      principal_amount: principalAmount,
      interest_amount: interestAmount,
      remaining_balance: newBalance,
      payment_number: loan.payments_made + 1,
      status: 'paid'
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
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">{loan.loan_name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current Balance</p>
            <p className="font-semibold text-red-600">{formatCurrency(loan.remaining_amount)}</p>
          </div>
          <div>
            <p className="text-gray-600">Regular EMI</p>
            <p className="font-semibold text-blue-600">{formatCurrency(loan.emi_amount)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('payment_date')}
          type="date"
          label="Payment Date"
          error={errors.payment_date?.message}
        />

        <Input
          {...register('amount')}
          type="number"
          step="0.01"
          label="Payment Amount (₹)"
          placeholder="Enter payment amount"
          error={errors.amount?.message}
        />
      </div>

      {watchAmount > 0 && (
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-semibold text-blue-900 mb-3">Payment Breakdown</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Principal</p>
              <p className="font-semibold text-blue-800">{formatCurrency(principalAmount)}</p>
            </div>
            <div>
              <p className="text-blue-600">Interest</p>
              <p className="font-semibold text-blue-800">{formatCurrency(interestAmount)}</p>
            </div>
            <div>
              <p className="text-blue-600">New Balance</p>
              <p className="font-semibold text-blue-800">{formatCurrency(newBalance)}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} size="lg" fullWidth>
          Add Payment
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};