import { motion } from 'framer-motion';

/**
 * Loading Spinner Component
 * @param {object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg)
 * @param {string} props.color - Color of spinner
 * @param {string} props.text - Loading text
 * @param {boolean} props.overlay - Whether to show as overlay
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = 'Loading...', 
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${overlay ? 'p-8' : 'p-4'}`}>
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-4 
          ${colorClasses[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
      {text && (
        <motion.p 
          className={`mt-3 ${textSizeClasses[size]} ${overlay ? 'text-white' : 'text-gray-600'} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {spinner}
      </motion.div>
    );
  }

  return spinner;
};

export default LoadingSpinner;