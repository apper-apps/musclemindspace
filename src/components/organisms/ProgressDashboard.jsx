import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ProgressRing from '@/components/molecules/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { progressService } from '@/services/api/progressService';
import { workoutService } from '@/services/api/workoutService';

const ProgressDashboard = ({ className = "" }) => {
  const [progressData, setProgressData] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [progress, workouts] = await Promise.all([
        progressService.getAll(),
        workoutService.getAll()
      ]);
      
      setProgressData(progress);
      setWorkoutHistory(workouts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    
    const progressEntry = {
      date: new Date().toISOString(),
      weight: parseFloat(newProgress.weight) || 0,
      measurements: {
        chest: parseFloat(newProgress.chest) || 0,
        waist: parseFloat(newProgress.waist) || 0,
        arms: parseFloat(newProgress.arms) || 0,
        thighs: parseFloat(newProgress.thighs) || 0
      }
    };

    try {
      await progressService.create(progressEntry);
      setProgressData([...progressData, progressEntry]);
      setNewProgress({
        weight: '',
        chest: '',
        waist: '',
        arms: '',
        thighs: ''
      });
      setShowAddProgress(false);
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const getWeightChartData = () => {
    const sortedData = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      series: [{
        name: 'Weight',
        data: sortedData.map(entry => entry.weight)
      }],
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: { show: false }
        },
        colors: ['#2563EB'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: sortedData.map(entry => 
            new Date(entry.date).toLocaleDateString()
          )
        },
        yaxis: {
          title: { text: 'Weight (lbs)' }
        },
        grid: {
          strokeDashArray: 3
        }
      }
    };
  };

  const getCurrentStats = () => {
    if (progressData.length === 0) return null;
    
    const latest = progressData[progressData.length - 1];
    const previous = progressData.length > 1 ? progressData[progressData.length - 2] : null;
    
    return {
      current: latest,
      previous: previous,
      weightChange: previous ? latest.weight - previous.weight : 0
    };
  };

  const getThisWeekWorkouts = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workoutHistory.filter(workout => 
      new Date(workout.date) >= oneWeekAgo
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = getCurrentStats();
  const thisWeekWorkouts = getThisWeekWorkouts();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Progress Dashboard
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowAddProgress(true)}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Log Progress
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="metric-card bg-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekWorkouts.length}
              </p>
              <p className="text-xs text-accent">Workouts</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Activity" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="metric-card bg-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Current Weight</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.current?.weight || 0}
              </p>
              <p className="text-xs text-accent">lbs</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="metric-card bg-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">
                {workoutHistory.length}
              </p>
              <p className="text-xs text-accent">Completed</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-slate-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h4 className="font-display font-semibold text-gray-900 mb-4">
            Weight Progress
          </h4>
          {progressData.length > 0 ? (
            <div className="chart-container">
              <Chart
                options={getWeightChartData().options}
                series={getWeightChartData().series}
                type="line"
                height={300}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="TrendingUp" className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No weight data yet</p>
            </div>
          )}
        </div>

        {/* Weekly Progress Ring */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h4 className="font-display font-semibold text-gray-900 mb-4">
            Weekly Goal
          </h4>
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={(thisWeekWorkouts.length / 5) * 100}
              size={150}
              strokeWidth={12}
              color="#10B981"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {thisWeekWorkouts.length}
                </div>
                <div className="text-sm text-secondary">of 5 workouts</div>
              </div>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h4 className="font-display font-semibold text-gray-900 mb-4">
          Recent Workouts
        </h4>
        {workoutHistory.length > 0 ? (
          <div className="space-y-3">
            {workoutHistory.slice(0, 5).map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Dumbbell" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{workout.name}</p>
                    <p className="text-sm text-secondary">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-secondary">
                  {workout.duration} min
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No workouts logged yet</p>
          </div>
        )}
      </div>

      {/* Add Progress Modal */}
      {showAddProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Log Progress
            </h3>
            
            <form onSubmit={handleAddProgress} className="space-y-4">
              <FormField
                label="Weight (lbs)"
                type="number"
                value={newProgress.weight}
                onChange={(e) => setNewProgress({...newProgress, weight: e.target.value})}
                step="0.1"
              />
              
              <FormField
                label="Chest (inches)"
                type="number"
                value={newProgress.chest}
                onChange={(e) => setNewProgress({...newProgress, chest: e.target.value})}
                step="0.1"
              />
              
              <FormField
                label="Waist (inches)"
                type="number"
                value={newProgress.waist}
                onChange={(e) => setNewProgress({...newProgress, waist: e.target.value})}
                step="0.1"
              />
              
              <FormField
                label="Arms (inches)"
                type="number"
                value={newProgress.arms}
                onChange={(e) => setNewProgress({...newProgress, arms: e.target.value})}
                step="0.1"
              />
              
              <FormField
                label="Thighs (inches)"
                type="number"
                value={newProgress.thighs}
                onChange={(e) => setNewProgress({...newProgress, thighs: e.target.value})}
                step="0.1"
              />
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddProgress(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Save Progress
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;