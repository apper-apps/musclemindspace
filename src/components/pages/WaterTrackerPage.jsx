import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import waterService from '@/services/api/waterService';

const WaterTrackerPage = () => {
  const [todayIntake, setTodayIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [intakeHistory, setIntakeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      setIsLoading(true);
      const todayData = await waterService.getToday();
      const history = await waterService.getHistory();
      
      setTodayIntake(todayData.intake);
      setDailyGoal(todayData.goal);
      setIntakeHistory(history);
    } catch (error) {
      console.error('Error loading water data:', error);
      toast.error('Failed to load water data');
    } finally {
      setIsLoading(false);
    }
  };

  const addIntake = async (amount) => {
    try {
      const newEntry = await waterService.addIntake(amount);
      setTodayIntake(prev => prev + amount);
      setIntakeHistory(prev => [newEntry, ...prev]);
      setCustomAmount('');
      toast.success(`Added ${amount}ml to your daily intake!`);
    } catch (error) {
      console.error('Error adding intake:', error);
      toast.error('Failed to add water intake');
    }
  };

  const removeIntake = async (id) => {
    try {
      const entry = intakeHistory.find(h => h.Id === id);
      if (!entry) return;

      await waterService.delete(id);
      setTodayIntake(prev => Math.max(0, prev - entry.amount));
      setIntakeHistory(prev => prev.filter(h => h.Id !== id));
      toast.success('Water intake entry removed');
    } catch (error) {
      console.error('Error removing intake:', error);
      toast.error('Failed to remove intake entry');
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

  const resetDay = async () => {
    if (!confirm('Are you sure you want to reset today\'s water intake? This cannot be undone.')) {
      return;
    }

    try {
      await waterService.resetDay();
      setTodayIntake(0);
      setIntakeHistory(prev => prev.filter(h => h.date !== new Date().toDateString()));
      toast.success('Today\'s water intake has been reset');
    } catch (error) {
      console.error('Error resetting day:', error);
      toast.error('Failed to reset day');
    }
  };

  const progressPercentage = Math.min((todayIntake / dailyGoal) * 100, 100);
  const isGoalReached = todayIntake >= dailyGoal;
  const todaysEntries = intakeHistory.filter(h => h.date === new Date().toDateString());

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Water Tracker
          </h1>
          <p className="text-secondary">
            Stay hydrated and track your daily water intake
          </p>
        </div>
        <Button
          variant="outline"
          onClick={resetDay}
          className="text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Reset Day
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Visualization */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            Today's Progress
          </h3>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <svg width="120" height="160" viewBox="0 0 120 160" className="water-glass-large">
                <defs>
                  <linearGradient id="waterGradientLarge" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                  <linearGradient id="glassGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(148, 163, 184, 0.2)" />
                    <stop offset="100%" stopColor="rgba(148, 163, 184, 0.1)" />
                  </linearGradient>
                  <pattern id="wavePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0,10 Q5,5 10,10 T20,10" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                
                {/* Glass container */}
                <path
                  d="M30 30 L90 30 L90 130 Q90 140 80 140 L40 140 Q30 140 30 130 Z"
                  fill="url(#glassGradientLarge)"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  className="glass-container"
                />
                
                {/* Water fill */}
                <motion.path
                  d={`M34 ${136 - (progressPercentage * 1.0)} L86 ${136 - (progressPercentage * 1.0)} L86 134 Q86 136 84 136 L36 136 Q34 136 34 134 Z`}
                  fill="url(#waterGradientLarge)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progressPercentage > 0 ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="water-fill-animated"
                />
                
                {/* Wave animation */}
                {progressPercentage > 0 && (
                  <motion.rect
                    x="34"
                    y={136 - (progressPercentage * 1.0) - 5}
                    width="52"
                    height="10"
                    fill="url(#wavePattern)"
                    animate={{ x: [34, 44, 34] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                {/* Shine effect */}
                <path
                  d="M40 40 L50 40 L50 120 L40 120 Z"
                  fill="rgba(255, 255, 255, 0.4)"
                  className="glass-shine"
                />
              </svg>
            </div>
            
            <div className="text-center space-y-2">
              <div className={`text-3xl font-bold ${isGoalReached ? 'text-green-600' : 'text-blue-600'}`}>
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-gray-600">
                {todayIntake}ml / {dailyGoal}ml
              </div>
              <div className="text-sm text-secondary">
                {isGoalReached ? '🎉 Goal Reached!' : `${dailyGoal - todayIntake}ml remaining`}
              </div>
            </div>
          </div>
        </div>

        {/* Add Water */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            Add Water Intake
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[250, 500, 750, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => addIntake(amount)}
                  className="py-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                >
                  <div className="text-center">
                    <div className="font-semibold">{amount}ml</div>
                    <div className="text-xs text-gray-500">
                      {amount === 250 ? 'Glass' : 
                       amount === 500 ? 'Bottle' : 
                       amount === 750 ? 'Large' : 'XL'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Custom Amount</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount in ml"
                  min="1"
                  max="2000"
                />
                <Button
                  onClick={() => addIntake(parseInt(customAmount))}
                  disabled={!customAmount || parseInt(customAmount) <= 0}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Goal Management */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Daily Goal</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGoalEdit(!showGoalEdit)}
                >
                  <ApperIcon name="Settings" className="w-4 h-4" />
                </Button>
              </div>
              
              {showGoalEdit ? (
                <div className="space-y-3">
                  <Input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder={dailyGoal.toString()}
                    min="500"
                    max="5000"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={updateGoal}
                      disabled={!newGoal}
                      className="flex-1"
                    >
                      Save Goal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowGoalEdit(false);
                        setNewGoal('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-700">
                    {dailyGoal}ml
                  </div>
                  <div className="text-sm text-blue-600">
                    Current daily goal
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's History */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            Today's Intake
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {todaysEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Droplets" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No water intake recorded today</p>
                <p className="text-sm">Start by adding your first glass!</p>
              </div>
            ) : (
              todaysEntries.map((entry) => (
                <motion.div
                  key={entry.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="Droplets" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.amount}ml
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIntake(entry.Id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
          
          {todaysEntries.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total entries:</span>
                <span className="font-medium">{todaysEntries.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average per entry:</span>
                <span className="font-medium">
                  {Math.round(todayIntake / todaysEntries.length)}ml
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WaterTrackerPage;