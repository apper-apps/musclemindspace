import { motion } from 'framer-motion';
import ProgressDashboard from '@/components/organisms/ProgressDashboard';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-secondary">
            Track your fitness journey and stay motivated
          </p>
        </div>
      </div>

      <ProgressDashboard />
    </motion.div>
  );
};

export default Dashboard;