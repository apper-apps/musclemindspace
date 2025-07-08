import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MuscleGroup from '@/components/molecules/MuscleGroup';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const MuscleMap = ({ onMuscleSelect, selectedMuscles = [], recoveryData = {}, showRecovery = false }) => {
  const [view, setView] = useState('front');
  const [muscles, setMuscles] = useState([]);
  useEffect(() => {
    // Define muscle groups with SVG paths
    const muscleData = {
      front: [
        { 
          id: 'chest', 
          name: 'Chest', 
          path: 'M180 120 Q200 100 220 120 Q240 140 220 160 Q200 180 180 160 Q160 140 180 120 Z' 
        },
        { 
          id: 'shoulders', 
          name: 'Shoulders', 
          path: 'M140 100 Q160 80 180 100 Q200 80 220 100 Q240 80 260 100 Q240 120 220 100 Q200 120 180 100 Q160 120 140 100 Z' 
        },
        { 
          id: 'biceps', 
          name: 'Biceps', 
          path: 'M120 140 Q140 120 160 140 Q160 180 140 200 Q120 180 120 140 Z M240 140 Q260 120 280 140 Q280 180 260 200 Q240 180 240 140 Z' 
        },
        { 
          id: 'abs', 
          name: 'Abs', 
          path: 'M180 180 Q200 160 220 180 Q220 220 200 240 Q180 220 180 180 Z' 
        },
        { 
          id: 'quadriceps', 
          name: 'Quadriceps', 
          path: 'M160 260 Q180 240 200 260 Q220 240 240 260 Q240 320 220 340 Q200 320 180 340 Q160 320 160 260 Z' 
        },
        { 
          id: 'calves', 
          name: 'Calves', 
          path: 'M170 360 Q185 340 200 360 Q215 340 230 360 Q230 420 215 440 Q200 420 185 440 Q170 420 170 360 Z' 
        }
      ],
      back: [
        { 
          id: 'traps', 
          name: 'Traps', 
          path: 'M180 80 Q200 60 220 80 Q240 100 220 120 Q200 140 180 120 Q160 100 180 80 Z' 
        },
        { 
          id: 'lats', 
          name: 'Lats', 
          path: 'M140 140 Q160 120 180 140 Q200 120 220 140 Q240 120 260 140 Q260 200 240 220 Q220 200 200 220 Q180 200 160 220 Q140 200 140 140 Z' 
        },
        { 
          id: 'triceps', 
          name: 'Triceps', 
          path: 'M120 160 Q140 140 160 160 Q160 200 140 220 Q120 200 120 160 Z M240 160 Q260 140 280 160 Q280 200 260 220 Q240 200 240 160 Z' 
        },
        { 
          id: 'glutes', 
          name: 'Glutes', 
          path: 'M160 240 Q180 220 200 240 Q220 220 240 240 Q240 280 220 300 Q200 280 180 300 Q160 280 160 240 Z' 
        },
        { 
          id: 'hamstrings', 
          name: 'Hamstrings', 
          path: 'M160 300 Q180 280 200 300 Q220 280 240 300 Q240 360 220 380 Q200 360 180 380 Q160 360 160 300 Z' 
        }
      ]
    };

    setMuscles(muscleData[view]);
  }, [view]);

const handleMuscleClick = (muscleId) => {
    const muscle = muscles.find(m => m.id === muscleId);
    if (muscle) {
      if (showRecovery) {
        // In recovery mode, show recovery info instead of selecting
        const recovery = recoveryData[muscle.name] || { intensity: 0, needsRest: false };
        // Could trigger a tooltip or info display
      } else {
        onMuscleSelect(muscle.name);
      }
    }
  };

  const clearSelection = () => {
    onMuscleSelect(null, true);
  };

  const getMuscleRecoveryColor = (muscleName) => {
    if (!showRecovery || !recoveryData[muscleName]) {
      return null;
    }
    
    const intensity = recoveryData[muscleName].intensity;
    if (intensity > 0.6) return 'url(#recoveryHighGradient)';
    if (intensity > 0.3) return 'url(#recoveryMediumGradient)';
    return 'url(#recoveryLowGradient)';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Muscle Selection
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'front' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('front')}
          >
            <ApperIcon name="User" className="w-4 h-4 mr-2" />
            Front
          </Button>
          <Button
            variant={view === 'back' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('back')}
          >
            <ApperIcon name="UserX" className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-center mb-4">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="muscle-diagram"
          >
            <svg
              width="400"
              height="500"
              viewBox="0 0 400 500"
              className="max-w-full h-auto"
            >
<defs>
                <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="unselectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="recoveryLowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="recoveryMediumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="recoveryHighGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              
{muscles.map((muscle) => (
                <MuscleGroup
                  key={muscle.id}
                  id={muscle.id}
                  name={muscle.name}
                  path={muscle.path}
                  isSelected={!showRecovery && selectedMuscles.includes(muscle.name)}
                  onClick={handleMuscleClick}
                  customFill={showRecovery ? getMuscleRecoveryColor(muscle.name) : null}
                  recoveryMode={showRecovery}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary mb-4">
            Click on muscle groups to select them for your workout
          </p>
          {selectedMuscles.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-wrap gap-2">
                {selectedMuscles.map((muscle, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-gradient-to-r from-primary to-blue-600 text-white text-sm rounded-full"
                  >
                    {muscle}
                  </motion.span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuscleMap;