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
// Enhanced muscle data with realistic anatomical proportions and detailed muscle fiber patterns
    const muscleData = {
      front: [
        { 
          id: 'chest', 
          name: 'Chest (Pectorals)', 
          path: 'M160 115 C148 108 142 118 148 135 L152 155 C158 172 168 182 185 188 L200 192 L215 188 C232 182 242 172 248 155 L252 135 C258 118 252 108 240 115 C228 122 218 127 200 127 C182 127 172 122 160 115 Z M172 135 L172 155 C173 158 175 160 177 160 M187 140 L187 160 C188 163 190 165 192 165 M200 140 L200 160 C201 163 203 165 205 165 M213 140 L213 160 C214 163 216 165 218 165 M228 135 L228 155 C229 158 231 160 233 160 M165 120 Q185 125 200 125 Q215 125 235 120' 
        },
        { 
          id: 'shoulders', 
          name: 'Shoulders (Deltoids)', 
          path: 'M118 92 C106 85 98 95 105 112 C112 128 122 138 138 143 L158 148 C168 153 173 148 168 138 L163 123 C158 108 153 98 148 92 C138 85 128 85 118 92 Z M282 92 C294 85 302 95 295 112 C288 128 278 138 262 143 L242 148 C232 153 227 148 232 138 L237 123 C242 108 247 98 252 92 C262 85 272 85 282 92 Z M138 102 L153 112 C155 114 157 116 159 118 M247 102 L262 112 C264 114 266 116 268 118 M125 105 Q140 108 155 108 M275 105 Q260 108 245 108' 
        },
        { 
          id: 'biceps', 
          name: 'Biceps', 
          path: 'M138 143 C126 148 120 163 126 178 L132 203 C138 218 148 228 163 233 C173 238 178 233 173 223 L168 198 C163 183 163 168 168 153 C173 148 168 143 158 148 L138 143 Z M262 143 C274 148 280 163 274 178 L268 203 C262 218 252 228 237 233 C227 238 222 233 227 223 L232 198 C237 183 237 168 232 153 C227 148 232 143 242 148 L262 143 Z M148 155 Q158 160 165 165 M252 155 Q242 160 235 165 M145 170 C147 175 150 180 155 185 M255 170 C253 175 250 180 245 185' 
        },
        { 
          id: 'forearms', 
          name: 'Forearms', 
          path: 'M163 233 C151 238 145 253 151 268 L157 293 C163 308 173 318 188 323 C198 328 203 323 198 313 L193 288 C188 273 188 258 193 243 C198 238 193 233 183 238 L163 233 Z M237 233 C249 238 255 253 249 268 L243 293 C237 308 227 318 212 323 C202 328 197 323 202 313 L207 288 C212 273 212 258 207 243 C202 238 207 233 217 238 L237 233 Z M168 245 Q178 250 185 255 M232 245 Q222 250 215 255 M173 260 L173 275 L178 290 M227 260 L227 275 L222 290' 
        },
        { 
          id: 'abs', 
          name: 'Abs (Rectus Abdominis)', 
          path: 'M168 193 C162 198 162 213 168 228 L173 253 C178 268 183 283 188 298 L200 313 L212 298 C217 283 222 268 227 253 L232 228 C238 213 238 198 232 193 L168 193 Z M183 208 L183 223 C184 225 186 226 188 226 M200 208 L200 223 C201 225 203 226 205 226 M217 208 L217 223 C218 225 220 226 222 226 M183 238 L183 253 C184 255 186 256 188 256 M200 238 L200 253 C201 255 203 256 205 256 M217 238 L217 253 C218 255 220 256 222 256 M183 268 L183 283 C184 285 186 286 188 286 M200 268 L200 283 C201 285 203 286 205 286 M217 268 L217 283 C218 285 220 286 222 286 M175 200 Q200 195 225 200' 
        },
        { 
          id: 'quadriceps', 
          name: 'Quadriceps', 
          path: 'M153 313 C141 318 135 333 141 348 L147 383 C153 418 163 453 173 483 C178 498 183 503 188 498 L183 473 L178 438 L173 403 C168 383 168 363 173 343 C178 333 173 323 163 328 L153 313 Z M247 313 C259 318 265 333 259 348 L253 383 C247 418 237 453 227 483 C222 498 217 503 212 498 L217 473 L222 438 L227 403 C232 383 232 363 227 343 C222 333 227 323 237 328 L247 313 Z M183 328 C171 333 165 348 171 363 L177 398 C183 433 193 468 203 498 C208 513 213 518 218 513 L213 488 L208 453 L203 418 C198 398 198 378 203 358 C208 348 203 338 193 343 L183 328 Z M158 335 Q168 340 175 345 M242 335 Q232 340 225 345 M188 350 Q198 355 205 360' 
        },
        { 
          id: 'calves', 
          name: 'Calves', 
          path: 'M173 483 C161 488 155 503 161 518 L167 543 C173 558 183 568 198 573 C208 578 213 573 208 563 L203 538 C198 523 198 508 203 493 C208 488 203 483 193 488 L173 483 Z M227 483 C239 488 245 503 239 518 L233 543 C227 558 217 568 202 573 C192 578 187 573 192 563 L197 538 C202 523 202 508 197 493 C192 488 197 483 207 488 L227 483 Z M178 495 Q188 500 195 505 M222 495 Q212 500 205 505 M183 510 L183 525 L188 540 M217 510 L217 525 L212 540' 
        }
      ],
      back: [
        { 
          id: 'traps', 
          name: 'Traps (Trapezius)', 
          path: 'M158 78 C146 71 140 81 146 98 L151 123 C157 138 167 148 183 153 L200 158 L217 153 C233 148 243 138 249 123 L254 98 C260 81 254 71 242 78 C230 85 220 90 200 90 C180 90 170 85 158 78 Z M168 98 L168 118 C169 121 171 123 173 123 M183 103 L183 123 C184 126 186 128 188 128 M200 103 L200 123 C201 126 203 128 205 128 M217 103 L217 123 C218 126 220 128 222 128 M232 98 L232 118 C233 121 235 123 237 123 M178 133 L178 143 C179 145 181 146 183 146 M200 133 L200 143 C201 145 203 146 205 146 M222 133 L222 143 C223 145 225 146 227 146 M165 85 Q200 80 235 85' 
        },
        { 
          id: 'upperback', 
          name: 'Upper Back (Rhomboids)', 
          path: 'M118 153 C106 158 100 173 106 188 L112 213 C118 228 128 238 143 243 L163 248 C173 253 178 248 173 238 L168 213 C163 198 163 183 168 168 C173 163 168 158 158 163 L118 153 Z M282 153 C294 158 300 173 294 188 L288 213 C282 228 272 238 257 243 L237 248 C227 253 222 248 227 238 L232 213 C237 198 237 183 232 168 C227 163 232 158 242 163 L282 153 Z M128 165 Q143 170 155 170 M272 165 Q257 170 245 170 M135 180 C137 185 140 190 145 195 M265 180 C263 185 260 190 255 195' 
        },
        { 
          id: 'lats', 
          name: 'Lats (Latissimus Dorsi)', 
          path: 'M143 243 C131 248 125 263 131 278 L137 313 C143 348 153 383 163 413 C168 428 173 433 178 428 L173 403 L168 368 L163 333 C158 313 158 293 163 273 C168 263 163 253 153 258 L143 243 Z M257 243 C269 248 275 263 269 278 L263 313 C257 348 247 383 237 413 C232 428 227 433 222 428 L227 403 L232 368 L237 333 C242 313 242 293 237 273 C232 263 237 253 247 258 L257 243 Z M148 255 Q158 260 165 265 M252 255 Q242 260 235 265 M153 280 C155 285 158 290 163 295 M247 280 C245 285 242 290 237 295' 
        },
        { 
          id: 'triceps', 
          name: 'Triceps', 
          path: 'M138 153 C126 158 120 173 126 188 L132 213 C138 228 148 238 163 243 C173 248 178 243 173 233 L168 208 C163 193 163 178 168 163 C173 158 168 153 158 158 L138 153 Z M262 153 C274 158 280 173 274 188 L268 213 C262 228 252 238 237 243 C227 248 222 243 227 233 L232 208 C237 193 237 178 232 163 C227 158 232 153 242 158 L262 153 Z M148 165 Q158 170 165 175 M252 165 Q242 170 235 175 M145 180 C147 185 150 190 155 195 M255 180 C253 185 250 190 245 195' 
        },
        { 
          id: 'lowerback', 
          name: 'Lower Back (Erector Spinae)', 
          path: 'M168 283 C162 288 162 303 168 318 L173 343 C178 358 183 373 188 388 L200 403 L212 388 C217 373 222 358 227 343 L232 318 C238 303 238 288 232 283 L168 283 Z M183 298 L183 313 C184 315 186 316 188 316 M200 298 L200 313 C201 315 203 316 205 316 M217 298 L217 313 C218 315 220 316 222 316 M183 328 L183 343 C184 345 186 346 188 346 M200 328 L200 343 C201 345 203 346 205 346 M217 328 L217 343 C218 345 220 346 222 346 M183 358 L183 373 C184 375 186 376 188 376 M200 358 L200 373 C201 375 203 376 205 376 M217 358 L217 373 C218 375 220 376 222 376 M175 290 Q200 285 225 290' 
        },
        { 
          id: 'glutes', 
          name: 'Glutes (Gluteus Maximus)', 
          path: 'M153 403 C141 408 135 423 141 438 L147 463 C153 478 163 488 178 493 L200 498 L222 493 C237 488 247 478 253 463 L259 438 C265 423 259 408 247 403 C235 398 225 393 200 393 C175 393 165 398 153 403 Z M168 418 L168 438 C169 441 171 443 173 443 M183 423 L183 443 C184 446 186 448 188 448 M200 423 L200 443 C201 446 203 448 205 448 M217 423 L217 443 C218 446 220 448 222 448 M232 418 L232 438 C233 441 235 443 237 443 M173 453 L173 473 C174 475 176 476 178 476 M200 453 L200 473 C201 475 203 476 205 476 M227 453 L227 473 C228 475 230 476 232 476 M165 408 Q200 403 235 408' 
        },
        { 
          id: 'hamstrings', 
          name: 'Hamstrings', 
          path: 'M153 493 C141 498 135 513 141 528 L147 563 C153 598 163 633 173 663 C178 678 183 683 188 678 L183 653 L178 618 L173 583 C168 563 168 543 173 523 C178 513 173 503 163 508 L153 493 Z M247 493 C259 498 265 513 259 528 L253 563 C247 598 237 633 227 663 C222 678 217 683 212 678 L217 653 L222 618 L227 583 C232 563 232 543 227 523 C222 513 227 503 237 508 L247 493 Z M183 508 C171 513 165 528 171 543 L177 578 C183 613 193 648 203 678 C208 693 213 698 218 693 L213 668 L208 633 L203 598 C198 578 198 558 203 538 C208 528 203 518 193 523 L183 508 Z M158 505 Q168 510 175 515 M242 505 Q232 510 225 515 M188 530 Q198 535 205 540' 
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
          {/* Mobile-friendly zoom container with pinch-to-zoom support */}
          <div className="muscle-diagram-container touch-manipulation overflow-hidden rounded-lg" 
               style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="muscle-diagram relative"
            >
              <svg
                width="400"
                height="600"
                viewBox="0 0 400 600"
                className="max-w-full h-auto cursor-pointer select-none"
                role="img"
                aria-label="Interactive human anatomy muscle diagram"
                style={{ minHeight: '400px', userSelect: 'none' }}
              >
                <defs>
                  {/* Enhanced gradient definitions for better muscle visualization */}
                  <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="unselectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#6B7280" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.85" />
                    <stop offset="30%" stopColor="#F87171" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#EF4444" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="skeletonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.6" />
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
                  {/* Muscle fiber texture pattern for realism */}
                  <pattern id="muscleTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                    <rect width="4" height="4" fill="transparent"/>
                    <path d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2" stroke="#000" strokeWidth="0.5" opacity="0.1"/>
                  </pattern>
                </defs>
                
                {/* Enhanced skeletal structure background for anatomical context */}
                <g className="skeleton-structure" opacity="0.25">
                  {view === 'front' ? (
                    <>
                      {/* Skull with more detail */}
                      <ellipse cx="200" cy="68" rx="38" ry="48" fill="url(#skeletonGradient)" stroke="#BDBDBD" strokeWidth="1"/>
                      <circle cx="190" cy="62" r="3" fill="#BDBDBD" opacity="0.6"/>
                      <circle cx="210" cy="62" r="3" fill="#BDBDBD" opacity="0.6"/>
                      {/* Enhanced ribcage */}
                      <ellipse cx="200" cy="155" rx="52" ry="72" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      <path d="M158 125 Q200 120 242 125" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      <path d="M163 142 Q200 137 237 142" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      <path d="M168 159 Q200 154 232 159" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      <path d="M173 176 Q200 171 227 176" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      <path d="M178 193 Q200 188 222 193" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      {/* Sternum */}
                      <line x1="200" y1="125" x2="200" y2="195" stroke="#BDBDBD" strokeWidth="2"/>
                      {/* Enhanced pelvis */}
                      <ellipse cx="200" cy="295" rx="48" ry="28" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      <path d="M152 295 Q200 285 248 295" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      {/* Arm bones with joints */}
                      <circle cx="150" cy="120" r="4" fill="#BDBDBD"/>
                      <line x1="150" y1="120" x2="118" y2="198" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="118" cy="198" r="3" fill="#BDBDBD"/>
                      <line x1="118" y1="198" x2="98" y2="278" stroke="#BDBDBD" strokeWidth="3"/>
                      <circle cx="250" cy="120" r="4" fill="#BDBDBD"/>
                      <line x1="250" y1="120" x2="282" y2="198" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="282" cy="198" r="3" fill="#BDBDBD"/>
                      <line x1="282" y1="198" x2="302" y2="278" stroke="#BDBDBD" strokeWidth="3"/>
                      {/* Leg bones with joints */}
                      <circle cx="178" cy="315" r="4" fill="#BDBDBD"/>
                      <line x1="178" y1="315" x2="173" y2="448" stroke="#BDBDBD" strokeWidth="4.5"/>
                      <circle cx="173" cy="448" r="3" fill="#BDBDBD"/>
                      <line x1="173" y1="448" x2="168" y2="565" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="222" cy="315" r="4" fill="#BDBDBD"/>
                      <line x1="222" y1="315" x2="227" y2="448" stroke="#BDBDBD" strokeWidth="4.5"/>
                      <circle cx="227" cy="448" r="3" fill="#BDBDBD"/>
                      <line x1="227" y1="448" x2="232" y2="565" stroke="#BDBDBD" strokeWidth="3.5"/>
                      {/* Enhanced spine */}
                      <line x1="200" y1="88" x2="200" y2="295" stroke="#BDBDBD" strokeWidth="2.5"/>
                      <circle cx="200" cy="100" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="120" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="140" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="160" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="180" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="200" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="220" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="240" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="260" r="2" fill="#BDBDBD"/>
                      <circle cx="200" cy="280" r="2" fill="#BDBDBD"/>
                    </>
                  ) : (
                    <>
                      {/* Skull back with detail */}
                      <ellipse cx="200" cy="68" rx="38" ry="48" fill="url(#skeletonGradient)" stroke="#BDBDBD" strokeWidth="1"/>
                      {/* Enhanced spine detailed */}
                      <line x1="200" y1="88" x2="200" y2="395" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="200" cy="105" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="125" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="145" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="165" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="185" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="205" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="225" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="245" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="265" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="285" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="305" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="325" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="345" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="365" r="3.5" fill="#BDBDBD"/>
                      {/* Enhanced shoulder blades */}
                      <ellipse cx="158" cy="138" rx="28" ry="38" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      <ellipse cx="242" cy="138" rx="28" ry="38" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      {/* Pelvis back enhanced */}
                      <ellipse cx="200" cy="375" rx="48" ry="28" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      {/* Arm bones with joints */}
                      <circle cx="150" cy="118" r="4" fill="#BDBDBD"/>
                      <line x1="150" y1="118" x2="118" y2="198" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="118" cy="198" r="3" fill="#BDBDBD"/>
                      <line x1="118" y1="198" x2="98" y2="278" stroke="#BDBDBD" strokeWidth="3"/>
                      <circle cx="250" cy="118" r="4" fill="#BDBDBD"/>
                      <line x1="250" y1="118" x2="282" y2="198" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="282" cy="198" r="3" fill="#BDBDBD"/>
                      <line x1="282" y1="198" x2="302" y2="278" stroke="#BDBDBD" strokeWidth="3"/>
                      {/* Leg bones with joints */}
                      <circle cx="178" cy="390" r="4" fill="#BDBDBD"/>
                      <line x1="178" y1="390" x2="173" y2="525" stroke="#BDBDBD" strokeWidth="4.5"/>
                      <circle cx="173" cy="525" r="3" fill="#BDBDBD"/>
                      <line x1="173" y1="525" x2="168" y2="565" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="222" cy="390" r="4" fill="#BDBDBD"/>
                      <line x1="222" y1="390" x2="227" y2="525" stroke="#BDBDBD" strokeWidth="4.5"/>
                      <circle cx="227" cy="525" r="3" fill="#BDBDBD"/>
                      <line x1="227" y1="525" x2="232" y2="565" stroke="#BDBDBD" strokeWidth="3.5"/>
                    </>
                  )}
                </g>
                
                {/* Enhanced muscle groups with better touch targets */}
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