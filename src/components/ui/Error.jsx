import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h3>
        
        <p className="text-secondary text-sm mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;