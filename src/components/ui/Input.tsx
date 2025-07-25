import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}, ref) => {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'block w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm placeholder-gray-400 bg-white',
            icon && 'pl-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
            'hover:border-gray-300 focus:outline-none',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="mt-2 text-sm text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';