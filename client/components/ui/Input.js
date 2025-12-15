import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Input Component
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-lg
    placeholder-gray-500 text-gray-900 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${baseClasses}
            ${errorClasses}
            ${icon ? 'pl-10' : ''}
          `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <motion.p 
          className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;