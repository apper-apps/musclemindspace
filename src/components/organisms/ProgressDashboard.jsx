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
  const [showRecoveryMap, setShowRecoveryMap] = useState(false);
  const [muscleRecoveryData, setMuscleRecoveryData] = useState({});
const [newProgress, setNewProgress] = useState({
    weight: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    beforePhoto: '',
    afterPhoto: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (workoutHistory.length > 0) {
      calculateMuscleRecovery();
    }
  }, [workoutHistory]);
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
      },
      beforePhotoUrl: newProgress.beforePhoto || null,
      afterPhotoUrl: newProgress.afterPhoto || null
    };

    try {
      await progressService.create(progressEntry);
      setProgressData([...progressData, progressEntry]);
      setNewProgress({
        weight: '',
        chest: '',
        waist: '',
        arms: '',
        thighs: '',
        beforePhoto: '',
        afterPhoto: ''
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

  const calculateMuscleRecovery = () => {
    const muscleGroupMapping = {
      'Bench Press': ['Chest', 'Triceps', 'Shoulders'],
      'Push-ups': ['Chest', 'Triceps', 'Shoulders'],
      'Squats': ['Quadriceps', 'Glutes'],
      'Deadlifts': ['Hamstrings', 'Glutes', 'Traps'],
      'Pull-ups': ['Lats', 'Biceps'],
      'Lunges': ['Quadriceps', 'Glutes'],
      'Overhead Press': ['Shoulders', 'Triceps'],
      'Rows': ['Lats', 'Biceps'],
      'Calf Raises': ['Calves']
    };

    const recoveryData = {};
    const now = new Date();
    
    // Initialize all muscle groups
    ['Chest', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Lats', 'Traps', 
     'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'].forEach(muscle => {
      recoveryData[muscle] = { intensity: 0, lastWorked: null, needsRest: false };
    });

    // Calculate recovery intensity based on recent workouts
    workoutHistory.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const daysSince = Math.floor((now - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysSince <= 7) { // Only consider workouts from last week
        workout.exercises.forEach(exercise => {
          const musclesWorked = muscleGroupMapping[exercise.name] || [];
          
          musclesWorked.forEach(muscle => {
            if (recoveryData[muscle]) {
              // Higher intensity for more recent workouts
              const workoutIntensity = Math.max(0, 1 - (daysSince / 7));
              recoveryData[muscle].intensity = Math.min(1, 
                recoveryData[muscle].intensity + workoutIntensity * 0.3
              );
              
              if (!recoveryData[muscle].lastWorked || workoutDate > recoveryData[muscle].lastWorked) {
                recoveryData[muscle].lastWorked = workoutDate;
              }
              
              // Mark as needing rest if worked within 48 hours
              if (daysSince < 2) {
                recoveryData[muscle].needsRest = true;
              }
            }
          });
        });
      }
    });

    setMuscleRecoveryData(recoveryData);
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

      {/* Photo Comparison Slider */}
      {progressData.some(p => p.beforePhotoUrl || p.afterPhotoUrl) && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-display font-semibold text-gray-900">
              Progress Photos
            </h4>
            <div className="text-sm text-secondary">
              Before & After Comparison
            </div>
          </div>
          
          <div className="photo-comparison-container">
            {progressData.filter(p => p.beforePhotoUrl || p.afterPhotoUrl).slice(-3).map((entry, index) => (
              <motion.div
                key={entry.Id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-6 last:mb-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-secondary">
                    Weight: {entry.weight} lbs
                  </p>
                </div>
                
                <div className="photo-comparison-slider relative bg-gray-100 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Before Photo */}
                    <div className="photo-container">
                      <div className="text-xs font-medium text-gray-600 mb-2 text-center">
<h4 className="font-semibold text-gray-900 mb-4">Before</h4>
                      {entry.beforePhotoUrl ? (
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={entry.beforePhotoUrl}
                            alt="Before progress photo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'none';
                              }
                            }}
                          />
                          <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                            <div className="text-center text-gray-500">
                              <ApperIcon name="Image" className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-xs">Photo unavailable</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <ApperIcon name="Image" className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">No photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">After</h4>
                      {entry.afterPhotoUrl ? (
<div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={entry.afterPhotoUrl}
                            alt="After progress photo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'none';
                              }
                            }}
                          />
                          <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                            <div className="text-center text-gray-500">
                              <ApperIcon name="Image" className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-xs">Photo unavailable</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <ApperIcon name="Image" className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">No photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Weight:</strong> {entry.weight}lbs</p>
                    <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  </div>
                  
                  {/* Comparison Stats */}
                  {entry.beforePhotoUrl && entry.afterPhotoUrl && (
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-t border-gray-200">
                      <div className="flex justify-center space-x-6 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">Chest</p>
                          <p className="text-secondary">{entry.measurements.chest}"</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">Waist</p>
                          <p className="text-secondary">{entry.measurements.waist}"</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">Arms</p>
                          <p className="text-secondary">{entry.measurements.arms}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {progressData.filter(p => p.beforePhotoUrl || p.afterPhotoUrl).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ApperIcon name="Camera" className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium mb-2">No progress photos yet</p>
                <p className="text-sm">Add photos when logging your progress to see visual comparisons</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Muscle Recovery Map */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-semibold text-gray-900">
            Muscle Recovery Status
          </h4>
          <Button
            variant={showRecoveryMap ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowRecoveryMap(!showRecoveryMap)}
          >
            <ApperIcon name="Activity" className="w-4 h-4 mr-2" />
            {showRecoveryMap ? 'Hide Recovery' : 'Show Recovery'}
          </Button>
        </div>
        
        {showRecoveryMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="recovery-overlay"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-medium text-gray-700">Recovery Heat Map</h5>
                <div className="recovery-muscle-map bg-gray-50 rounded-lg p-4">
                  <svg width="200" height="300" viewBox="0 0 200 300" className="mx-auto">
                    <defs>
                      <linearGradient id="recoveryLow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="recoveryMedium" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="recoveryHigh" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Simplified muscle regions with recovery colors */}
                    <rect x="80" y="40" width="40" height="30" rx="5" 
                          fill={muscleRecoveryData.Chest?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Chest?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <text x="100" y="58" textAnchor="middle" className="text-xs font-medium">Chest</text>
                    
                    <rect x="60" y="25" width="25" height="20" rx="3"
                          fill={muscleRecoveryData.Shoulders?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Shoulders?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <rect x="115" y="25" width="25" height="20" rx="3"
                          fill={muscleRecoveryData.Shoulders?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Shoulders?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <text x="100" y="38" textAnchor="middle" className="text-xs font-medium">Shoulders</text>
                    
                    <rect x="85" y="80" width="30" height="40" rx="5"
                          fill={muscleRecoveryData.Abs?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Abs?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <text x="100" y="103" textAnchor="middle" className="text-xs font-medium">Abs</text>
                    
                    <rect x="75" y="140" width="50" height="50" rx="8"
                          fill={muscleRecoveryData.Quadriceps?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Quadriceps?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <text x="100" y="168" textAnchor="middle" className="text-xs font-medium">Quads</text>
                    
                    <rect x="85" y="210" width="30" height="40" rx="5"
                          fill={muscleRecoveryData.Calves?.intensity > 0.6 ? "url(#recoveryHigh)" : 
                                muscleRecoveryData.Calves?.intensity > 0.3 ? "url(#recoveryMedium)" : "url(#recoveryLow)"} 
                          className="muscle-recovery-region" />
                    <text x="100" y="233" textAnchor="middle" className="text-xs font-medium">Calves</text>
                  </svg>
                </div>
                
                <div className="recovery-legend flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-400 opacity-30"></div>
                    <span className="text-gray-600">Recovered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-amber-400 opacity-60"></div>
                    <span className="text-gray-600">Moderate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-red-400 opacity-80"></div>
                    <span className="text-gray-600">Needs Rest</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h5 className="font-medium text-gray-700">Recovery Details</h5>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {Object.entries(muscleRecoveryData).map(([muscle, data]) => (
                    <motion.div
                      key={muscle}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          data.intensity > 0.6 ? 'bg-red-500' :
                          data.intensity > 0.3 ? 'bg-amber-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{muscle}</p>
                          <p className="text-xs text-gray-500">
                            {data.lastWorked ? 
                              `Last worked: ${Math.floor((new Date() - data.lastWorked) / (1000 * 60 * 60 * 24))} days ago` : 
                              'Not recently worked'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {data.needsRest ? 'Rest' : 'Ready'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(data.intensity * 100)}% intensity
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Before Photo URL"
                  type="url"
                  value={newProgress.beforePhoto}
                  onChange={(e) => setNewProgress({...newProgress, beforePhoto: e.target.value})}
                  placeholder="https://example.com/before-photo.jpg"
                />
                
                <FormField
                  label="After Photo URL"
                  type="url"
                  value={newProgress.afterPhoto}
                  onChange={(e) => setNewProgress({...newProgress, afterPhoto: e.target.value})}
                  placeholder="https://example.com/after-photo.jpg"
                />
              </div>
              
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