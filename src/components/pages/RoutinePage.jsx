import { useState } from 'react';
import { motion } from 'framer-motion';
import MuscleMap from '@/components/organisms/MuscleMap';
import ExerciseLibrary from '@/components/organisms/ExerciseLibrary';
import RoutineBuilder from '@/components/organisms/RoutineBuilder';

const RoutinePage = () => {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleMuscleSelect = (muscle, clear = false) => {
    if (clear) {
      setSelectedMuscles([]);
      return;
    }

    if (muscle) {
      setSelectedMuscles(prev => 
        prev.includes(muscle) 
          ? prev.filter(m => m !== muscle)
          : [...prev, muscle]
      );
    }
  };

  const handleExerciseSelect = (exercise) => {
    if (!selectedExercises.find(ex => ex.Id === exercise.Id)) {
      setSelectedExercises(prev => [...prev, exercise]);
    }
  };

  const handleExerciseRemove = (exerciseId) => {
    setSelectedExercises(prev => prev.filter(ex => ex.Id !== exerciseId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          My Routine
        </h1>
        <p className="text-secondary">
          Build your workout by selecting muscles and exercises
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Muscle Selection */}
        <div className="lg:col-span-1">
          <MuscleMap 
            onMuscleSelect={handleMuscleSelect}
            selectedMuscles={selectedMuscles}
          />
        </div>

        {/* Exercise Library */}
        <div className="lg:col-span-1">
          <ExerciseLibrary 
            selectedMuscles={selectedMuscles}
            onExerciseSelect={handleExerciseSelect}
          />
        </div>

        {/* Routine Builder */}
        <div className="lg:col-span-1">
          <RoutineBuilder 
            selectedExercises={selectedExercises}
            onExerciseRemove={handleExerciseRemove}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RoutinePage;