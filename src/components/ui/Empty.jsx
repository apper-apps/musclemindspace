import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding some content",
  action,
  actionLabel = "Get Started",
  icon = "Database"
}) => {
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
          className="w-20 h-20 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={icon} className="w-10 h-10 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-secondary text-sm mb-8 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-accent to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;