import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SetLogger from "@/components/molecules/SetLogger";
import exercises from "@/services/mockData/exercises.json";
import workouts from "@/services/mockData/workouts.json";
import routines from "@/services/mockData/routines.json";
import progress from "@/services/mockData/progress.json";
import water from "@/services/mockData/water.json";
import { exerciseService } from "@/services/api/exerciseService";
import { routineService } from "@/services/api/routineService";

const RoutineBuilder = ({ 
  selectedExercises = [], 
  onExerciseRemove,
  onRoutineSave,
  className = "" 
}) => {
  const [routineName, setRoutineName] = useState('');
  const [exerciseSets, setExerciseSets] = useState({});
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (isWorkoutActive && workoutStartTime) {
      interval = setInterval(() => {
        setWorkoutDuration(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, workoutStartTime]);

  const handleDrop = (e) => {
    e.preventDefault();
    const exerciseData = e.dataTransfer.getData('text/plain');
    if (exerciseData) {
      try {
        const exercise = JSON.parse(exerciseData);
        // Exercise is already added through parent component
      } catch (error) {
        console.error('Error parsing dropped exercise:', error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSetsChange = (exerciseId, sets) => {
    setExerciseSets(prev => ({
      ...prev,
      [exerciseId]: sets
    }));
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(Date.now());
    setWorkoutDuration(0);
  };

  const stopWorkout = async () => {
    setIsWorkoutActive(false);
    
    // Save workout log
    const workoutData = {
      routineName: routineName || 'Untitled Workout',
      exercises: selectedExercises.map(exercise => ({
        exerciseId: exercise.Id,
        name: exercise.name,
        sets: exerciseSets[exercise.Id] || []
      })),
      duration: workoutDuration,
      completedAt: new Date().toISOString()
    };

    console.log('Workout completed:', workoutData);
    
    // Reset workout state
    setWorkoutStartTime(null);
    setWorkoutDuration(0);
  };

  const saveRoutine = async () => {
    if (!routineName.trim()) {
      alert('Please enter a routine name');
      return;
    }

const routineData = {
      name: routineName,
      exercises: selectedExercises || [],
      targetMuscles: [...new Set((selectedExercises || []).flatMap(ex => ex?.primaryMuscles || []))],
      createdAt: new Date().toISOString()
    };

    try {
      await routineService.create(routineData);
      if (onRoutineSave) {
        onRoutineSave(routineData);
      }
      setRoutineName('');
      alert('Routine saved successfully!');
    } catch (error) {
      console.error('Error saving routine:', error);
      alert('Error saving routine. Please try again.');
    }
  };

const getTotalSets = () => {
    return Object.values(exerciseSets || {}).reduce((total, sets) => total + (Array.isArray(sets) ? sets.length : 0), 0);
  };

  const getCompletedSets = () => {
    return Object.values(exerciseSets || {}).reduce((total, sets) => 
      total + (Array.isArray(sets) ? sets.filter(set => set?.completed).length : 0), 0
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Routine Builder
        </h3>
        {isWorkoutActive && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="font-mono text-primary">{formatDuration(workoutDuration)}</span>
            </div>
            <span className="text-sm text-secondary">
              {getCompletedSets()}/{getTotalSets()} sets
            </span>
          </div>
        )}
      </div>

      {/* Routine Name Input */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Enter routine name..."
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="accent"
            onClick={saveRoutine}
            disabled={!routineName.trim() || selectedExercises.length === 0}
          >
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
            Save Routine
          </Button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className="routine-drop-zone bg-white rounded-lg p-6 shadow-md border-2 border-dashed border-gray-300 min-h-[200px]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedExercises.length > 0 ? (
          <div className="space-y-6">
            {/* Workout Controls */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{selectedExercises.length}</span> exercises
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{getTotalSets()}</span> total sets
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isWorkoutActive ? (
                  <Button
                    variant="primary"
                    onClick={startWorkout}
                    disabled={selectedExercises.length === 0}
                  >
                    <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={stopWorkout}
                  >
                    <ApperIcon name="Square" className="w-4 h-4 mr-2" />
                    Finish Workout
                  </Button>
                )}
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
              <AnimatePresence>
                {selectedExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-gray-900 mb-1">
                          {index + 1}. {exercise.name}
                        </h4>
                        <p className="text-sm text-secondary">
                          {exercise.equipment} • {exercise.primaryMuscles.join(', ')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExerciseRemove(exercise.Id)}
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </Button>
                    </div>

                    <SetLogger
                      sets={exerciseSets[exercise.Id] || []}
                      onSetsChange={(sets) => handleSetsChange(exercise.Id, sets)}
                      exerciseName={exercise.name}
                    />
</motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* AI Suggestion Panel */}
            {selectedExercises.length > 0 && (
              <AISuggestionPanel 
                selectedExercises={selectedExercises}
                onExerciseSelect={onExerciseSelect}
              />
            )}
          </div>
        ) : (
          <Empty
            title="No exercises in routine"
            description="Drag exercises from the library to build your workout routine"
            icon="Target"
          />
        )}
      </div>
    </div>
  );
};

// AI Suggestion Panel Component
const AISuggestionPanel = ({ selectedExercises, onExerciseSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (selectedExercises.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const smartSuggestions = await exerciseService.getSmartSuggestions(selectedExercises);
        setSuggestions(smartSuggestions);
      } catch (err) {
        setError('Failed to load exercise suggestions');
        console.error('Error loading suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [selectedExercises]);

  const handleAddExercise = (exercise) => {
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Brain" className="w-4 h-4 text-white" />
          </div>
          <h4 className="font-display font-semibold text-gray-900">AI Exercise Suggestions</h4>
        </div>
        <Loading />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border border-red-200"
      >
        <div className="flex items-center space-x-3">
          <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="Brain" className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="font-display font-semibold text-gray-900">AI Exercise Suggestions</h4>
          <p className="text-sm text-gray-600">Recommended to complement your routine</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.exercise.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h5 className="font-display font-medium text-gray-900">
                    {suggestion.exercise.name}
                  </h5>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {suggestion.score}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {suggestion.exercise.equipment} • {suggestion.exercise.primaryMuscles.join(', ')}
                </p>
                <div className="flex items-start space-x-2">
                  <ApperIcon name="Lightbulb" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{suggestion.reason}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddExercise(suggestion.exercise)}
                className="ml-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="flex items-start space-x-2">
          <ApperIcon name="Info" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            These suggestions are based on muscle group balance and complementary movement patterns.
          </p>
        </div>
      </div>
    </motion.div>
);
};

export default RoutineBuilder;