import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Dashboard from "@/components/pages/Dashboard";
import ProgressRing from "@/components/molecules/ProgressRing";
import FormField from "@/components/molecules/FormField";
import { progressService } from "@/services/api/progressService";
import { workoutService } from "@/services/api/workoutService";

const ProgressDashboard = ({ className = "" }) => {
  const [progressData, setProgressData] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [showRecoveryMap, setShowRecoveryMap] = useState(false);
  const [muscleRecoveryData, setMuscleRecoveryData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState('3months');
  const [selectedMetrics, setSelectedMetrics] = useState(['weight', 'chest', 'waist']);
const [newProgress, setNewProgress] = useState({
    weight: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    beforePhoto: null,
    afterPhoto: null
  });
  const [photoFiles, setPhotoFiles] = useState({
    beforePhoto: null,
    afterPhoto: null
  });
  const [photoPreviews, setPhotoPreviews] = useState({
    beforePhoto: null,
    afterPhoto: null
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

const handleFileUpload = (file, type) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setPhotoFiles(prev => ({ ...prev, [type]: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setPhotoPreviews(prev => ({ ...prev, [type]: base64Data }));
      setNewProgress(prev => ({ ...prev, [type]: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (type) => {
    setPhotoFiles(prev => ({ ...prev, [type]: null }));
    setPhotoPreviews(prev => ({ ...prev, [type]: null }));
    setNewProgress(prev => ({ ...prev, [type]: null }));
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
        beforePhoto: null,
        afterPhoto: null
      });
      setPhotoFiles({
        beforePhoto: null,
        afterPhoto: null
      });
      setPhotoPreviews({
        beforePhoto: null,
        afterPhoto: null
      });
      setShowAddProgress(false);
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

const getFilteredData = () => {
    const now = new Date();
    const ranges = {
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
      'all': null
    };
    
    const daysBack = ranges[selectedDateRange];
    if (!daysBack) return progressData;
    
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    return progressData.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const getWeightChartData = () => {
    const filteredData = getFilteredData();
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      series: [{
        name: 'Weight',
        data: sortedData.map(entry => entry.weight)
      }],
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#2563EB'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: sortedData.map(entry => 
            new Date(entry.date).toLocaleDateString()
          ),
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        yaxis: {
          title: { 
            text: 'Weight (lbs)',
            style: {
              fontSize: '12px',
              color: '#64748B'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        grid: {
          strokeDashArray: 3,
          borderColor: '#E2E8F0'
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => `${value} lbs`
          }
        }
      }
    };
  };

  const getBodyMeasurementsChartData = () => {
    const filteredData = getFilteredData();
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const series = [];
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const measurements = ['chest', 'waist', 'arms', 'thighs'];
    
    measurements.forEach((measurement, index) => {
      if (selectedMetrics.includes(measurement)) {
        series.push({
          name: measurement.charAt(0).toUpperCase() + measurement.slice(1),
          data: sortedData.map(entry => entry.measurements[measurement] || 0)
        });
      }
    });

    return {
      series,
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: colors.slice(0, series.length),
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          categories: sortedData.map(entry => 
            new Date(entry.date).toLocaleDateString()
          ),
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        yaxis: {
          title: { 
            text: 'Measurements (inches)',
            style: {
              fontSize: '12px',
              color: '#64748B'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        grid: {
          strokeDashArray: 3,
          borderColor: '#E2E8F0'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => `${value}"`
          }
        }
      }
    };
  };

  const getWorkoutFrequencyChartData = () => {
    const now = new Date();
    const weeks = [];
    const workoutCounts = [];
    
    // Get last 12 weeks of data
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      
      const weekWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });
      
      weeks.push(`Week ${12 - i}`);
      workoutCounts.push(weekWorkouts.length);
    }

    return {
      series: [{
        name: 'Workouts',
        data: workoutCounts
      }],
      options: {
        chart: {
          type: 'column',
          height: 300,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#10B981'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        xaxis: {
          categories: weeks,
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        yaxis: {
          title: { 
            text: 'Number of Workouts',
            style: {
              fontSize: '12px',
              color: '#64748B'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              colors: '#64748B'
            }
          }
        },
        grid: {
          strokeDashArray: 3,
          borderColor: '#E2E8F0'
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => `${value} workout${value !== 1 ? 's' : ''}`
          }
        }
      }
    };
  };

  const generateProgressInsights = () => {
    const filteredData = getFilteredData();
    if (filteredData.length < 2) return [];

    const insights = [];
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sortedData[sortedData.length - 1];
    const earliest = sortedData[0];

    // Weight trend analysis
    const weightChange = latest.weight - earliest.weight;
    if (Math.abs(weightChange) > 0.5) {
      insights.push({
        type: weightChange > 0 ? 'warning' : 'success',
        icon: weightChange > 0 ? 'TrendingUp' : 'TrendingDown',
        title: `Weight ${weightChange > 0 ? 'Gain' : 'Loss'}`,
        description: `You've ${weightChange > 0 ? 'gained' : 'lost'} ${Math.abs(weightChange).toFixed(1)} lbs over the selected period`,
        value: `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs`
      });
    }

    // Measurement improvements
    const measurements = ['chest', 'waist', 'arms', 'thighs'];
    measurements.forEach(measurement => {
      const change = latest.measurements[measurement] - earliest.measurements[measurement];
      if (Math.abs(change) > 0.2) {
        const isPositive = (measurement === 'waist') ? change < 0 : change > 0;
        insights.push({
          type: isPositive ? 'success' : 'info',
          icon: isPositive ? 'TrendingUp' : 'TrendingDown',
          title: `${measurement.charAt(0).toUpperCase() + measurement.slice(1)} Progress`,
          description: `${Math.abs(change).toFixed(1)}" ${change > 0 ? 'increase' : 'decrease'} in ${measurement} measurement`,
          value: `${change > 0 ? '+' : ''}${change.toFixed(1)}"`
        });
      }
    });

    // Workout consistency
    const recentWeeks = 4;
    const recentWorkouts = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      const weeksAgo = new Date(Date.now() - (recentWeeks * 7 * 24 * 60 * 60 * 1000));
      return workoutDate >= weeksAgo;
    });
    
    const avgWorkoutsPerWeek = recentWorkouts.length / recentWeeks;
    if (avgWorkoutsPerWeek >= 3) {
      insights.push({
        type: 'success',
        icon: 'Activity',
        title: 'Great Consistency!',
        description: `Averaging ${avgWorkoutsPerWeek.toFixed(1)} workouts per week`,
        value: `${avgWorkoutsPerWeek.toFixed(1)}/week`
      });
    } else if (avgWorkoutsPerWeek < 2) {
      insights.push({
        type: 'warning',
        icon: 'AlertCircle',
        title: 'Consistency Opportunity',
        description: 'Consider increasing workout frequency for better results',
        value: `${avgWorkoutsPerWeek.toFixed(1)}/week`
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
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
            {progressData.filter(p => p.beforePhotoUrl || p.afterPhotoUrl).length > 0 ? (
              progressData.filter(p => p.beforePhotoUrl || p.afterPhotoUrl).slice(-3).map((entry, index) => (
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
                      Progress Entry
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entry.beforePhotoUrl && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Before</p>
                        <img 
                          src={entry.beforePhotoUrl} 
                          alt="Before" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {entry.afterPhotoUrl && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">After</p>
                        <img 
                          src={entry.afterPhotoUrl} 
                          alt="After" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Camera" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No progress photos available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Muscle Recovery Heat Map */}
      {workoutHistory.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-gray-900">
              Muscle Recovery Status
            </h4>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRecoveryMap(!showRecoveryMap)}
            >
              {showRecoveryMap ? 'Hide' : 'Show'} Recovery Map
            </Button>
          </div>
          
          {showRecoveryMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
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
            </motion.div>
          )}
        </div>
      )}
      {/* Quick Stats */}
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

{/* Chart Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Detailed Progress Charts
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            {/* Metric Selection */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Measurements:</label>
              <div className="flex space-x-2">
                {['chest', 'waist', 'arms', 'thighs'].map(metric => (
                  <button
                    key={metric}
                    onClick={() => {
                      setSelectedMetrics(prev => 
                        prev.includes(metric) 
                          ? prev.filter(m => m !== metric)
                          : [...prev, metric]
                      );
                    }}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      selectedMetrics.includes(metric)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      {progressData.length > 1 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h4 className="font-display font-semibold text-gray-900 mb-4">
            Progress Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {generateProgressInsights().map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-success bg-green-50' :
                  insight.type === 'warning' ? 'border-warning bg-amber-50' :
                  insight.type === 'error' ? 'border-error bg-red-50' :
                  'border-info bg-blue-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'success' ? 'bg-success text-white' :
                    insight.type === 'warning' ? 'bg-warning text-white' :
                    insight.type === 'error' ? 'bg-error text-white' :
                    'bg-info text-white'
                  }`}>
                    <ApperIcon name={insight.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm font-bold text-gray-900 mt-2">{insight.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
<div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-gray-900">
              Weight Progress
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span>Weight tracking</span>
            </div>
          </div>
          <div className="chart-container" style={{ minHeight: '300px', width: '100%' }}>
            {(() => {
              const chartData = getWeightChartData();
              return chartData && chartData.series && chartData.series.length > 0 ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="line"
                  height={300}
                  width="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No weight data available</p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Body Measurements Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-gray-900">
              Body Measurements
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Activity" className="w-4 h-4" />
              <span>Selected metrics</span>
            </div>
          </div>
          <div className="chart-container" style={{ minHeight: '300px', width: '100%' }}>
            {(() => {
              const chartData = getBodyMeasurementsChartData();
              return chartData && chartData.series && chartData.series.length > 0 ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="line"
                  height={300}
                  width="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No measurement data available</p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Workout Frequency Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-gray-900">
              Workout Frequency
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="BarChart" className="w-4 h-4" />
              <span>Weekly breakdown</span>
            </div>
          </div>
          <div className="chart-container" style={{ minHeight: '300px', width: '100%' }}>
            {(() => {
              const chartData = getWorkoutFrequencyChartData();
              return chartData && chartData.series && chartData.series.length > 0 ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="column"
                  height={300}
                  width="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No workout frequency data available</p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Weekly Progress Ring */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-gray-900">
              Weekly Goal Progress
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Target" className="w-4 h-4" />
              <span>This week</span>
            </div>
          </div>
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
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((thisWeekWorkouts.length / 5) * 100)}% complete
                </div>
              </div>
            </ProgressRing>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {thisWeekWorkouts.length >= 5 
                ? '🎉 Weekly goal achieved!' 
                : `${5 - thisWeekWorkouts.length} more workout${5 - thisWeekWorkouts.length !== 1 ? 's' : ''} to reach your goal`
              }
            </p>
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
              
{/* Photo Upload Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Progress Photos</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Photo Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Before Photo
                    </label>
                    
                    {photoPreviews.beforePhoto ? (
                      <div className="relative">
                        <img 
                          src={photoPreviews.beforePhoto} 
                          alt="Before preview" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto('beforePhoto')}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files[0], 'beforePhoto')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="beforePhoto"
                        />
                        <label 
                          htmlFor="beforePhoto"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                        >
                          <ApperIcon name="Camera" className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                          <span className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</span>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* After Photo Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      After Photo
                    </label>
                    
                    {photoPreviews.afterPhoto ? (
                      <div className="relative">
                        <img 
                          src={photoPreviews.afterPhoto} 
                          alt="After preview" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto('afterPhoto')}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files[0], 'afterPhoto')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="afterPhoto"
                        />
                        <label 
                          htmlFor="afterPhoto"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                        >
                          <ApperIcon name="Camera" className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                          <span className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
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