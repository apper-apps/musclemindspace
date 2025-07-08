import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MuscleGroup from '@/components/molecules/MuscleGroup';
import MuscleInfoModal from '@/components/molecules/MuscleInfoModal';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { muscleInfoService } from '@/services/api/muscleInfoService';
const MuscleMap = ({ onMuscleSelect, selectedMuscles = [], recoveryData = {}, showRecovery = false }) => {
  const [view, setView] = useState('front');
  const [muscles, setMuscles] = useState([]);
useEffect(() => {
    // Define muscle groups with anatomically accurate SVG paths representing a realistic human figure
    const muscleData = {
      front: [
        { 
          id: 'chest', 
          name: 'Chest (Pectorals)', 
          path: 'M160 120 C150 115 145 125 150 140 L155 160 C160 175 170 185 185 190 L200 195 L215 190 C230 185 240 175 245 160 L250 140 C255 125 250 115 240 120 C230 125 220 130 200 130 C180 130 170 125 160 120 Z M170 140 L170 160 M185 145 L185 165 M200 145 L200 165 M215 145 L215 165 M230 140 L230 160' 
        },
        { 
          id: 'shoulders', 
          name: 'Shoulders (Deltoids)', 
          path: 'M120 95 C110 90 105 100 110 115 C115 130 125 140 140 145 L160 150 C170 155 175 150 170 140 L165 125 C160 110 155 100 150 95 C140 90 130 90 120 95 Z M280 95 C290 90 295 100 290 115 C285 130 275 140 260 145 L240 150 C230 155 225 150 230 140 L235 125 C240 110 245 100 250 95 C260 90 270 90 280 95 Z M140 105 L155 115 M245 105 L260 115' 
        },
        { 
          id: 'biceps', 
          name: 'Biceps', 
          path: 'M140 145 C130 150 125 165 130 180 L135 205 C140 220 150 230 165 235 C175 240 180 235 175 225 L170 200 C165 185 165 170 170 155 C175 150 170 145 160 150 L140 145 Z M260 145 C270 150 275 165 270 180 L265 205 C260 220 250 230 235 235 C225 240 220 235 225 225 L230 200 C235 185 235 170 230 155 C225 150 230 145 240 150 L260 145 Z' 
        },
        { 
          id: 'forearms', 
          name: 'Forearms', 
          path: 'M165 235 C155 240 150 255 155 270 L160 295 C165 310 175 320 190 325 C200 330 205 325 200 315 L195 290 C190 275 190 260 195 245 C200 240 195 235 185 240 L165 235 Z M235 235 C245 240 250 255 245 270 L240 295 C235 310 225 320 210 325 C200 330 195 325 200 315 L205 290 C210 275 210 260 205 245 C200 240 205 235 215 240 L235 235 Z' 
        },
        { 
          id: 'abs', 
          name: 'Abs (Rectus Abdominis)', 
          path: 'M170 195 C165 200 165 215 170 230 L175 255 C180 270 185 285 190 300 L200 315 L210 300 C215 285 220 270 225 255 L230 230 C235 215 235 200 230 195 L170 195 Z M185 210 L185 225 M200 210 L200 225 M215 210 L215 225 M185 240 L185 255 M200 240 L200 255 M215 240 L215 255 M185 270 L185 285 M200 270 L200 285 M215 270 L215 285' 
        },
        { 
          id: 'quadriceps', 
          name: 'Quadriceps', 
          path: 'M155 315 C145 320 140 335 145 350 L150 385 C155 420 165 455 175 485 C180 500 185 505 190 500 L185 475 L180 440 L175 405 C170 385 170 365 175 345 C180 335 175 325 165 330 L155 315 Z M245 315 C255 320 260 335 255 350 L250 385 C245 420 235 455 225 485 C220 500 215 505 210 500 L215 475 L220 440 L225 405 C230 385 230 365 225 345 C220 335 225 325 235 330 L245 315 Z M185 330 C175 335 170 350 175 365 L180 400 C185 435 195 470 205 500 C210 515 215 520 220 515 L215 490 L210 455 L205 420 C200 400 200 380 205 360 C210 350 205 340 195 345 L185 330 Z' 
        },
        { 
          id: 'calves', 
          name: 'Calves', 
          path: 'M175 485 C165 490 160 505 165 520 L170 545 C175 560 185 570 200 575 C210 580 215 575 210 565 L205 540 C200 525 200 510 205 495 C210 490 205 485 195 490 L175 485 Z M225 485 C235 490 240 505 235 520 L230 545 C225 560 215 570 200 575 C190 580 185 575 190 565 L195 540 C200 525 200 510 195 495 C190 490 195 485 205 490 L225 485 Z' 
        }
      ],
      back: [
        { 
          id: 'traps', 
          name: 'Traps (Trapezius)', 
          path: 'M160 80 C150 75 145 85 150 100 L155 125 C160 140 170 150 185 155 L200 160 L215 155 C230 150 240 140 245 125 L250 100 C255 85 250 75 240 80 C230 85 220 90 200 90 C180 90 170 85 160 80 Z M170 100 L170 120 M185 105 L185 125 M200 105 L200 125 M215 105 L215 125 M230 100 L230 120 M180 135 L180 145 M200 135 L200 145 M220 135 L220 145' 
        },
        { 
          id: 'upperback', 
          name: 'Upper Back (Rhomboids)', 
          path: 'M120 155 C110 160 105 175 110 190 L115 215 C120 230 130 240 145 245 L165 250 C175 255 180 250 175 240 L170 215 C165 200 165 185 170 170 C175 165 170 160 160 165 L120 155 Z M280 155 C290 160 295 175 290 190 L285 215 C280 230 270 240 255 245 L235 250 C225 255 220 250 225 240 L230 215 C235 200 235 185 230 170 C225 165 230 160 240 165 L280 155 Z' 
        },
        { 
          id: 'lats', 
          name: 'Lats (Latissimus Dorsi)', 
          path: 'M145 245 C135 250 130 265 135 280 L140 315 C145 350 155 385 165 415 C170 430 175 435 180 430 L175 405 L170 370 L165 335 C160 315 160 295 165 275 C170 265 165 255 155 260 L145 245 Z M255 245 C265 250 270 265 265 280 L260 315 C255 350 245 385 235 415 C230 430 225 435 220 430 L225 405 L230 370 L235 335 C240 315 240 295 235 275 C230 265 235 255 245 260 L255 245 Z' 
        },
        { 
          id: 'triceps', 
          name: 'Triceps', 
          path: 'M140 155 C130 160 125 175 130 190 L135 215 C140 230 150 240 165 245 C175 250 180 245 175 235 L170 210 C165 195 165 180 170 165 C175 160 170 155 160 160 L140 155 Z M260 155 C270 160 275 175 270 190 L265 215 C260 230 250 240 235 245 C225 250 220 245 225 235 L230 210 C235 195 235 180 230 165 C225 160 230 155 240 160 L260 155 Z' 
        },
        { 
          id: 'lowerback', 
          name: 'Lower Back (Erector Spinae)', 
          path: 'M170 285 C165 290 165 305 170 320 L175 345 C180 360 185 375 190 390 L200 405 L210 390 C215 375 220 360 225 345 L230 320 C235 305 235 290 230 285 L170 285 Z M185 300 L185 315 M200 300 L200 315 M215 300 L215 315 M185 330 L185 345 M200 330 L200 345 M215 330 L215 345 M185 360 L185 375 M200 360 L200 375 M215 360 L215 375' 
        },
        { 
          id: 'glutes', 
          name: 'Glutes (Gluteus Maximus)', 
          path: 'M155 405 C145 410 140 425 145 440 L150 465 C155 480 165 490 180 495 L200 500 L220 495 C235 490 245 480 250 465 L255 440 C260 425 255 410 245 405 C235 400 225 395 200 395 C175 395 165 400 155 405 Z M170 420 L170 440 M185 425 L185 445 M200 425 L200 445 M215 425 L215 445 M230 420 L230 440 M175 455 L175 475 M200 455 L200 475 M225 455 L225 475' 
        },
        { 
          id: 'hamstrings', 
          name: 'Hamstrings', 
          path: 'M155 495 C145 500 140 515 145 530 L150 565 C155 600 165 635 175 665 C180 680 185 685 190 680 L185 655 L180 620 L175 585 C170 565 170 545 175 525 C180 515 175 505 165 510 L155 495 Z M245 495 C255 500 260 515 255 530 L250 565 C245 600 235 635 225 665 C220 680 215 685 210 680 L215 655 L220 620 L225 585 C230 565 230 545 225 525 C220 515 225 505 235 510 L245 495 Z M185 510 C175 515 170 530 175 545 L180 580 C185 615 195 650 205 680 C210 695 215 700 220 695 L215 670 L210 635 L205 600 C200 580 200 560 205 540 C210 530 205 520 195 525 L185 510 Z' 
        }
      ]
    };

    setMuscles(muscleData[view]);
  }, [view]);

// Muscle info modal state
  const [showMuscleInfo, setShowMuscleInfo] = useState(false);
  const [selectedMuscleData, setSelectedMuscleData] = useState(null);
  const [muscleInfoLoading, setMuscleInfoLoading] = useState(false);
  const [muscleInfoError, setMuscleInfoError] = useState(null);

  const handleMuscleClick = async (muscleId) => {
    const muscle = muscles.find(m => m.id === muscleId);
    if (muscle) {
      if (showRecovery) {
        // In recovery mode, show recovery info instead of selecting
        const recovery = recoveryData[muscle.name] || { intensity: 0, needsRest: false };
        // Could trigger a tooltip or info display
      } else {
        // Add to selected muscles first
        onMuscleSelect(muscle.name);
        toast.success(`${muscle.name} added to selected muscles!`, {
          position: "bottom-right",
          autoClose: 2000,
        });

        // Then load and show muscle information
        await loadMuscleInfo(muscle.name);
      }
    }
  };

  const loadMuscleInfo = async (muscleName) => {
    setMuscleInfoLoading(true);
    setMuscleInfoError(null);
    setShowMuscleInfo(true);
    
    try {
      const muscleData = await muscleInfoService.getMuscleWithExercises(muscleName);
      setSelectedMuscleData(muscleData);
    } catch (error) {
      setMuscleInfoError(error.message);
      toast.error(`Failed to load muscle information: ${error.message}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setMuscleInfoLoading(false);
    }
  };

  const closeMuscleInfo = () => {
    setShowMuscleInfo(false);
    setSelectedMuscleData(null);
    setMuscleInfoError(null);
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
              height="600"
              viewBox="0 0 400 600"
              className="max-w-full h-auto"
              role="img"
              aria-label="Interactive human anatomy muscle diagram"
            >
              <defs>
                <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="unselectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E57373" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C62828" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8A80" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#D32F2F" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="skeletonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5F5F5" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.6" />
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
              
              {/* Skeletal structure background for anatomical context */}
              <g className="skeleton-structure" opacity="0.3">
                {view === 'front' ? (
                  <>
                    {/* Skull */}
                    <ellipse cx="200" cy="70" rx="35" ry="45" fill="url(#skeletonGradient)" stroke="#BDBDBD" strokeWidth="1"/>
                    {/* Ribcage */}
                    <ellipse cx="200" cy="160" rx="50" ry="70" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                    <path d="M160 130 Q200 125 240 130" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
                    <path d="M165 145 Q200 140 235 145" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
                    <path d="M170 160 Q200 155 230 160" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
                    <path d="M175 175 Q200 170 225 175" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
                    {/* Pelvis */}
                    <ellipse cx="200" cy="300" rx="45" ry="25" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                    {/* Arm bones */}
                    <line x1="150" y1="120" x2="120" y2="200" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="120" y1="200" x2="100" y2="280" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="250" y1="120" x2="280" y2="200" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="280" y1="200" x2="300" y2="280" stroke="#BDBDBD" strokeWidth="3"/>
                    {/* Leg bones */}
                    <line x1="180" y1="315" x2="175" y2="450" stroke="#BDBDBD" strokeWidth="4"/>
                    <line x1="175" y1="450" x2="170" y2="570" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="220" y1="315" x2="225" y2="450" stroke="#BDBDBD" strokeWidth="4"/>
                    <line x1="225" y1="450" x2="230" y2="570" stroke="#BDBDBD" strokeWidth="3"/>
                    {/* Spine */}
                    <line x1="200" y1="90" x2="200" y2="300" stroke="#BDBDBD" strokeWidth="2"/>
                  </>
                ) : (
                  <>
                    {/* Skull back */}
                    <ellipse cx="200" cy="70" rx="35" ry="45" fill="url(#skeletonGradient)" stroke="#BDBDBD" strokeWidth="1"/>
                    {/* Spine detailed */}
                    <line x1="200" y1="90" x2="200" y2="400" stroke="#BDBDBD" strokeWidth="3"/>
                    <circle cx="200" cy="110" r="3" fill="#BDBDBD"/>
                    <circle cx="200" cy="130" r="3" fill="#BDBDBD"/>
                    <circle cx="200" cy="150" r="3" fill="#BDBDBD"/>
                    <circle cx="200" cy="170" r="3" fill="#BDBDBD"/>
                    <circle cx="200" cy="190" r="3" fill="#BDBDBD"/>
                    {/* Shoulder blades */}
                    <ellipse cx="160" cy="140" rx="25" ry="35" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                    <ellipse cx="240" cy="140" rx="25" ry="35" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                    {/* Pelvis back */}
                    <ellipse cx="200" cy="380" rx="45" ry="25" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                    {/* Arm bones */}
                    <line x1="150" y1="120" x2="120" y2="200" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="120" y1="200" x2="100" y2="280" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="250" y1="120" x2="280" y2="200" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="280" y1="200" x2="300" y2="280" stroke="#BDBDBD" strokeWidth="3"/>
                    {/* Leg bones */}
                    <line x1="180" y1="395" x2="175" y2="530" stroke="#BDBDBD" strokeWidth="4"/>
                    <line x1="175" y1="530" x2="170" y2="570" stroke="#BDBDBD" strokeWidth="3"/>
                    <line x1="220" y1="395" x2="225" y2="530" stroke="#BDBDBD" strokeWidth="4"/>
                    <line x1="225" y1="530" x2="230" y2="570" stroke="#BDBDBD" strokeWidth="3"/>
                  </>
                )}
              </g>
              
              {/* Muscle groups */}
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
            {showRecovery 
              ? "View muscle recovery status - hover for details" 
              : "Click on muscle groups to select them and view detailed information"
            }
          </p>
          {selectedMuscles.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-wrap gap-2">
                {selectedMuscles.map((muscle, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-gradient-to-r from-primary to-blue-600 text-white text-sm rounded-full cursor-pointer hover:from-primary hover:to-blue-700 transition-all"
                    onClick={() => loadMuscleInfo(muscle)}
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

        {/* Muscle Information Modal */}
        <MuscleInfoModal
          isOpen={showMuscleInfo}
          onClose={closeMuscleInfo}
          muscleData={selectedMuscleData}
          loading={muscleInfoLoading}
          error={muscleInfoError}
        />
      </div>
    </div>
  );
};

export default MuscleMap;