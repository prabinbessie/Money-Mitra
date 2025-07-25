import React, { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/calculations';

interface StatCardProps {
  title: string;
  amount: number | string;
  icon: LucideIcon;
  change?: number;
  changeType?: 'increase' | 'decrease';
  color: 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'green';
  index?: number;
}

const StatCardComponent: React.FC<StatCardProps> = ({
  title,
  amount,
  icon: Icon,
  change,
  changeType,
  color,
  index = 0
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
  };

  const gradientClass = useMemo(() => {
    return colorClasses[color] || colorClasses['blue'];
  }, [color]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card hover gradient className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <motion.p 
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
              {typeof amount === 'number' ? formatCurrency(amount) : amount}
            </motion.p>

            {change !== undefined && (
              <motion.div 
                className={`flex items-center mt-2 text-sm ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <span className="flex items-center">
                  {changeType === 'increase' ? '↗' : '↘'} 
                  <span className="ml-1 font-medium">{Math.abs(change).toFixed(1)}%</span>
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </motion.div>
            )}
          </div>

          <motion.div 
            className={`p-4 rounded-2xl bg-gradient-to-r ${gradientClass} shadow-lg`}
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-hidden="true"
            style={{ willChange: 'transform' }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50 pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export const StatCard = React.memo(StatCardComponent);
