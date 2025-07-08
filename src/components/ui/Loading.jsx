import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Loading Your Workout
          </h3>
          <p className="text-secondary text-sm">
            Preparing your fitness journey...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;