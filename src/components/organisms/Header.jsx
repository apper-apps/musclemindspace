import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MobileNav from './MobileNav';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Dumbbell" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-display font-bold text-gray-900">
                  MuscleMind
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-secondary">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
};

export default Header;