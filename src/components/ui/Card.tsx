import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = true,
  hover = false,
  gradient = false
}) => {
  return (
    <motion.div 
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 w-full',
        padding && 'p-6',
        hover && 'hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-1',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        y: -2, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      } : {}}
    >
      {children}
    </motion.div>
  );
};