import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MuscleGroup from '@/components/molecules/MuscleGroup';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const MuscleMap = ({ onMuscleSelect, selectedMuscles = [], recoveryData = {}, showRecovery = false }) => {
  const [view, setView] = useState('front');
  const [muscles, setMuscles] = useState([]);
useEffect(() => {
    // Define muscle groups with anatomically accurate SVG paths representing a realistic human figure
    const muscleData = {
      front: [
        { 
          id: 'chest', 
          name: 'Chest', 
          path: 'M170 110 C165 105 165 100 170 95 C175 90 185 90 190 95 L200 95 C205 90 215 90 220 95 C225 100 225 105 220 110 L220 125 C220 135 215 145 200 150 L190 150 C175 145 170 135 170 125 Z M180 115 L180 135 M190 115 L190 135 M200 115 L200 135 M210 115 L210 135' 
        },
        { 
          id: 'shoulders', 
          name: 'Shoulders', 
          path: 'M130 85 C125 80 125 75 130 70 C140 65 150 70 155 80 C160 85 165 90 170 95 L170 110 C165 115 160 115 155 110 C150 105 145 100 140 100 C135 100 130 95 130 85 Z M270 85 C275 80 275 75 270 70 C260 65 250 70 245 80 C240 85 235 90 230 95 L230 110 C235 115 240 115 245 110 C250 105 255 100 260 100 C265 100 270 95 270 85 Z' 
        },
        { 
          id: 'biceps', 
          name: 'Biceps', 
          path: 'M155 110 C150 115 145 125 145 135 L145 160 C145 170 150 180 155 185 C160 190 165 185 170 180 C175 175 175 165 170 160 L170 135 C170 125 165 115 160 110 C158 108 157 108 155 110 Z M245 110 C250 115 255 125 255 135 L255 160 C255 170 250 180 245 185 C240 190 235 185 230 180 C225 175 225 165 230 160 L230 135 C230 125 235 115 240 110 C242 108 243 108 245 110 Z' 
        },
        { 
          id: 'forearms', 
          name: 'Forearms', 
          path: 'M155 185 C150 190 145 200 145 210 L145 235 C145 245 150 250 155 255 C160 260 165 255 170 250 C175 245 175 235 170 230 L170 210 C170 200 165 190 160 185 C158 186 157 186 155 185 Z M245 185 C250 190 255 200 255 210 L255 235 C255 245 250 250 245 255 C240 260 235 255 230 250 C225 245 225 235 230 230 L230 210 C230 200 235 190 240 185 C242 186 243 186 245 185 Z' 
        },
        { 
          id: 'abs', 
          name: 'Abs', 
          path: 'M175 150 C170 155 170 165 175 170 L175 180 C175 190 175 200 175 210 C175 220 180 230 185 235 L200 235 L215 235 C220 230 225 220 225 210 C225 200 225 190 225 180 L225 170 C230 165 230 155 225 150 L175 150 Z M185 160 L185 175 M200 160 L200 175 M215 160 L215 175 M185 185 L185 200 M200 185 L200 200 M215 185 L215 200 M185 210 L185 225 M200 210 L200 225 M215 210 L215 225' 
        },
        { 
          id: 'quadriceps', 
          name: 'Quadriceps', 
          path: 'M165 235 C160 240 160 250 165 260 L165 290 C165 310 165 330 170 345 C175 360 180 365 185 360 C190 355 190 345 185 340 L185 320 L185 300 L185 280 C185 270 185 260 185 250 C185 245 180 240 175 235 L165 235 Z M235 235 C240 240 240 250 235 260 L235 290 C235 310 235 330 230 345 C225 360 220 365 215 360 C210 355 210 345 215 340 L215 320 L215 300 L215 280 C215 270 215 260 215 250 C215 245 220 240 225 235 L235 235 Z M200 240 C195 245 195 255 200 265 L200 295 C200 315 200 335 200 350 C200 365 205 370 210 365 C215 360 215 350 210 345 L210 325 L210 305 L210 285 C210 275 210 265 210 255 C210 250 205 245 200 240 Z' 
        },
        { 
          id: 'calves', 
          name: 'Calves', 
          path: 'M175 360 C170 365 170 375 175 385 L175 410 C175 425 175 440 180 450 C185 460 190 465 195 460 C200 455 200 445 195 440 L195 425 L195 410 L195 395 C195 385 195 375 195 365 C195 362 190 360 185 360 L175 360 Z M225 360 C230 365 230 375 225 385 L225 410 C225 425 225 440 220 450 C215 460 210 465 205 460 C200 455 200 445 205 440 L205 425 L205 410 L205 395 C205 385 205 375 205 365 C205 362 210 360 215 360 L225 360 Z' 
        }
      ],
      back: [
        { 
          id: 'traps', 
          name: 'Traps', 
          path: 'M175 60 C170 55 170 50 175 45 C180 40 185 40 190 45 L200 45 L210 45 C215 40 220 40 225 45 C230 50 230 55 225 60 L225 75 C225 85 225 95 220 105 L215 115 L200 120 L185 115 L180 105 C175 95 175 85 175 75 L175 60 Z M185 70 L185 85 M200 70 L200 85 M215 70 L215 85 M190 95 L190 110 M200 95 L200 110 M210 95 L210 110' 
        },
        { 
          id: 'upperback', 
          name: 'Upper Back', 
          path: 'M140 95 C135 100 135 110 140 120 L140 140 C140 150 145 160 150 165 L160 170 L170 175 L175 150 L175 130 L170 110 C165 105 160 100 155 95 L140 95 Z M260 95 C265 100 265 110 260 120 L260 140 C260 150 255 160 250 165 L240 170 L230 175 L225 150 L225 130 L230 110 C235 105 240 100 245 95 L260 95 Z' 
        },
        { 
          id: 'lats', 
          name: 'Lats', 
          path: 'M150 165 C145 170 140 180 140 190 L140 210 C140 220 140 230 145 240 L150 250 L160 255 L170 250 L175 240 L180 230 L185 220 L190 210 L190 200 L185 190 L180 180 L175 175 L170 175 L160 170 L150 165 Z M250 165 C255 170 260 180 260 190 L260 210 C260 220 260 230 255 240 L250 250 L240 255 L230 250 L225 240 L220 230 L215 220 L210 210 L210 200 L215 190 L220 180 L225 175 L230 175 L240 170 L250 165 Z' 
        },
        { 
          id: 'triceps', 
          name: 'Triceps', 
          path: 'M155 120 C150 125 145 135 145 145 L145 170 C145 180 150 190 155 195 C160 200 165 195 170 190 C175 185 175 175 170 170 L170 145 C170 135 165 125 160 120 C158 118 157 118 155 120 Z M245 120 C250 125 255 135 255 145 L255 170 C255 180 250 190 245 195 C240 200 235 195 230 190 C225 185 225 175 230 170 L230 145 C230 135 235 125 240 120 C242 118 243 118 245 120 Z' 
        },
        { 
          id: 'lowerback', 
          name: 'Lower Back', 
          path: 'M175 250 C170 255 170 265 175 275 L175 295 C175 305 175 315 180 325 L185 335 L200 340 L215 335 L220 325 C225 315 225 305 225 295 L225 275 C230 265 230 255 225 250 L175 250 Z M185 265 L185 280 M200 265 L200 280 M215 265 L215 280 M185 290 L185 305 M200 290 L200 305 M215 290 L215 305' 
        },
        { 
          id: 'glutes', 
          name: 'Glutes', 
          path: 'M165 340 C160 345 160 355 165 365 L165 385 C165 395 170 405 175 410 L185 415 L200 415 L215 415 L225 410 C230 405 235 395 235 385 L235 365 C240 355 240 345 235 340 L165 340 Z M180 355 L180 370 M200 355 L200 370 M220 355 L220 370 M180 380 L180 395 M200 380 L200 395 M220 380 L220 395' 
        },
        { 
          id: 'hamstrings', 
          name: 'Hamstrings', 
          path: 'M165 415 C160 420 160 430 165 440 L165 470 C165 490 165 510 170 525 C175 540 180 545 185 540 C190 535 190 525 185 520 L185 500 L185 480 L185 460 C185 450 185 440 185 430 C185 425 180 420 175 415 L165 415 Z M235 415 C240 420 240 430 235 440 L235 470 C235 490 235 510 230 525 C225 540 220 545 215 540 C210 535 210 525 215 520 L215 500 L215 480 L215 460 C215 450 215 440 215 430 C215 425 220 420 225 415 L235 415 Z M200 420 C195 425 195 435 200 445 L200 475 C200 495 200 515 200 530 C200 545 205 550 210 545 C215 540 215 530 210 525 L210 505 L210 485 L210 465 C210 455 210 445 210 435 C210 430 205 425 200 420 Z' 
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