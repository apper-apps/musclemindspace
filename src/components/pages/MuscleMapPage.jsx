import { useState } from 'react';
import { motion } from 'framer-motion';
import MuscleMap from '@/components/organisms/MuscleMap';
import ExerciseLibrary from '@/components/organisms/ExerciseLibrary';

const MuscleMapPage = () => {
  const [selectedMuscles, setSelectedMuscles] = useState([]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Muscle Map
        </h1>
        <p className="text-secondary">
          Select muscle groups to find targeted exercises
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MuscleMap 
            onMuscleSelect={handleMuscleSelect}
            selectedMuscles={selectedMuscles}
          />
        </div>
        
        <div>
          <ExerciseLibrary 
            selectedMuscles={selectedMuscles}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MuscleMapPage;