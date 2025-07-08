import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import waterService from '@/services/api/waterService';

const WaterTracker = () => {
  const navigate = useNavigate();
  const [todayIntake, setTodayIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAmount, setQuickAmount] = useState(250);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toDateString();
      const data = await waterService.getToday();
      setTodayIntake(data.intake);
      setDailyGoal(data.goal);
    } catch (error) {
      console.error('Error loading water data:', error);
      toast.error('Failed to load water tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  const addIntake = async (amount) => {
    try {
      await waterService.addIntake(amount);
      setTodayIntake(prev => prev + amount);
      toast.success(`Added ${amount}ml to your daily intake!`);
    } catch (error) {
      console.error('Error adding intake:', error);
      toast.error('Failed to add water intake');
    }
  };

  const updateGoal = async () => {
    const goalValue = parseInt(newGoal);
    if (goalValue < 500 || goalValue > 5000) {
      toast.error('Goal must be between 500ml and 5000ml');
      return;
    }

    try {
      await waterService.updateGoal(goalValue);
      setDailyGoal(goalValue);
      setShowGoalEdit(false);
      setNewGoal('');
      toast.success('Daily goal updated successfully!');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const progressPercentage = Math.min((todayIntake / dailyGoal) * 100, 100);
  const isGoalReached = todayIntake >= dailyGoal;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Droplets" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Water Intake
            </h3>
            <p className="text-sm text-secondary">
              {todayIntake}ml / {dailyGoal}ml today
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/water')}
          className="text-primary hover:bg-primary/10"
        >
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Water Glass Visualization */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <svg width="60" height="80" viewBox="0 0 60 80" className="water-glass">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(148, 163, 184, 0.2)" />
                  <stop offset="100%" stopColor="rgba(148, 163, 184, 0.1)" />
                </linearGradient>
              </defs>
              
              {/* Glass container */}
              <path
                d="M15 15 L45 15 L45 65 Q45 70 40 70 L20 70 Q15 70 15 65 Z"
                fill="url(#glassGradient)"
                stroke="#94a3b8"
                strokeWidth="2"
                className="glass-container"
              />
              
              {/* Water fill */}
              <motion.path
                d={`M17 ${70 - (progressPercentage * 0.5)} L43 ${70 - (progressPercentage * 0.5)} L43 67 Q43 68 42 68 L18 68 Q17 68 17 67 Z`}
                fill="url(#waterGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: progressPercentage > 0 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="water-fill"
              />
              
              {/* Shine effect */}
              <path
                d="M20 20 L25 20 L25 60 L20 60 Z"
                fill="rgba(255, 255, 255, 0.3)"
                className="glass-shine"
              />
            </svg>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-semibold ${isGoalReached ? 'text-green-600' : 'text-blue-600'}`}>
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-secondary">
              {isGoalReached ? 'Goal Reached!' : 'Progress'}
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Add</h4>
          <div className="grid grid-cols-2 gap-2">
            {[250, 500, 750, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => addIntake(amount)}
                className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                +{amount}ml
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Input
              type="number"
              value={quickAmount}
              onChange={(e) => setQuickAmount(parseInt(e.target.value) || 0)}
              placeholder="Custom amount"
              className="text-sm"
              min="1"
              max="2000"
            />
            <Button
              size="sm"
              onClick={() => addIntake(quickAmount)}
              disabled={quickAmount <= 0}
              className="shrink-0"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Goal Management */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Daily Goal</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-xs p-1"
            >
              <ApperIcon name="Settings" className="w-3 h-3" />
            </Button>
          </div>
          
          {showGoalEdit ? (
            <div className="space-y-2">
              <Input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder={dailyGoal.toString()}
                className="text-sm"
                min="500"
                max="5000"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={updateGoal}
                  disabled={!newGoal}
                  className="text-xs flex-1"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowGoalEdit(false);
                    setNewGoal('');
                  }}
                  className="text-xs flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {dailyGoal}ml
              </div>
              <div className="text-xs text-secondary">
                {Math.max(0, dailyGoal - todayIntake)}ml remaining
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isGoalReached && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <ApperIcon name="CheckCircle" className="w-5 h-5" />
            <span className="font-medium">Congratulations! You've reached your daily goal!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaterTracker;