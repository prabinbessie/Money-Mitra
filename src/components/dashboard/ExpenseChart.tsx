import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/calculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  showTotalInCenter?: boolean;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, showTotalInCenter = false }) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.amount, 0), [data]);

  const chartData = useMemo(() => ({
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        hoverOffset: 8,
        borderRadius: 4,
      },
    ],
  }), [data]);

  const options: ChartOptions<'doughnut'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500',
          },
          color: '#4B5563', 
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const dataset = context.dataset.data;
            const sum = dataset.reduce((a: number, b: number) => a + (typeof b === 'number' ? b : 0), 0);
            const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
    cutout: showTotalInCenter ? '65%' : undefined,
  }), [data, showTotalInCenter]);

  return (
    <Card hover>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Breakdown</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">This Month</div>
      </div>

      {data.length > 0 ? (
        <motion.div
          className="relative h-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ willChange: 'transform' }}
          role="region"
          aria-label="Donut chart showing expense distribution"
        >
          <Doughnut data={chartData} options={options} />
          {showTotalInCenter && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
              aria-hidden="true"
            >
              📊
            </div>
            <p className="font-medium">No expense data available</p>
            <p className="text-sm">Start adding transactions to see your breakdown</p>
          </div>
        </motion.div>
      )}
    </Card>
  );
};
