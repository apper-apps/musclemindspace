import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const MobileNav = ({ isOpen, onClose }) => {
const navItems = [
    { name: 'Dashboard', path: '/', icon: 'Home' },
    { name: 'Muscle Map', path: '/muscle-map', icon: 'Target' },
    { name: 'My Routine', path: '/routine', icon: 'Dumbbell' },
    { name: 'Water Tracker', path: '/water', icon: 'Droplets' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Navigation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold text-gray-900">
              MuscleMind
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default MobileNav;