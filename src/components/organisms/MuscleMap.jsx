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
          path: 'M158 88 C146 82 140 92 146 108 L151 133 C157 148 167 158 183 163 L200 168 L217 163 C233 158 243 148 249 133 L254 108 C260 92 254 82 242 88 C230 95 220 100 200 100 C180 100 170 95 158 88 Z M138 118 C128 115 123 125 128 138 L133 158 C138 173 148 183 163 188 L183 193 C193 198 198 193 193 183 L188 163 C183 148 183 133 188 118 C193 113 188 108 178 113 L138 118 Z M262 118 C272 115 277 125 272 138 L267 158 C262 173 252 183 237 188 L217 193 C207 198 202 193 207 183 L212 163 C217 148 217 133 212 118 C207 113 212 108 222 113 L262 118 Z M168 108 L168 128 C169 131 171 133 173 133 M183 113 L183 133 C184 136 186 138 188 138 M200 113 L200 133 C201 136 203 138 205 138 M217 113 L217 133 C218 136 220 138 222 138 M232 108 L232 128 C233 131 235 133 237 133 M148 128 Q158 133 165 138 M252 128 Q242 133 235 138 M165 95 Q200 90 235 95 M145 135 C147 140 150 145 155 150 M255 135 C253 140 250 145 245 150' 
        },
        { 
          id: 'upperback', 
          name: 'Upper Back (Rhomboids)', 
          path: 'M163 188 C151 193 145 208 151 223 L157 248 C163 263 173 273 188 278 L208 283 C218 288 223 283 218 273 L213 248 C208 233 208 218 213 203 C218 198 213 193 203 198 L163 188 Z M237 188 C249 193 255 208 249 223 L243 248 C237 263 227 273 212 278 L192 283 C182 288 177 283 182 273 L187 248 C192 233 192 218 187 203 C182 198 187 193 197 198 L237 188 Z M178 203 C166 208 160 223 166 238 L172 263 C178 278 188 288 203 293 C213 298 218 293 213 283 L208 258 C203 243 203 228 208 213 C213 208 208 203 198 208 L178 203 Z M168 200 Q178 205 185 210 M232 200 Q222 205 215 210 M173 215 C175 220 178 225 183 230 M227 215 C225 220 222 225 217 230 M175 235 Q200 230 225 235' 
        },
        { 
          id: 'lats', 
          name: 'Lats (Latissimus Dorsi)', 
          path: 'M188 278 C176 283 170 298 176 313 L182 348 C188 383 198 418 208 448 C213 463 218 468 223 463 L218 438 L213 403 L208 368 C203 348 203 328 208 308 C213 298 208 288 198 293 L188 278 Z M212 278 C224 283 230 298 224 313 L218 348 C212 383 202 418 192 448 C187 463 182 468 177 463 L182 438 L187 403 L192 368 C197 348 197 328 192 308 C187 298 192 288 202 293 L212 278 Z M143 253 C131 258 125 273 131 288 L137 323 C143 358 153 393 163 423 C168 438 173 443 178 438 L173 413 L168 378 L163 343 C158 323 158 303 163 283 C168 273 163 263 153 268 L143 253 Z M257 253 C269 258 275 273 269 288 L263 323 C257 358 247 393 237 423 C232 438 227 443 222 438 L227 413 L232 378 L237 343 C242 323 242 303 237 283 C232 273 237 263 247 268 L257 253 Z M148 265 Q158 270 165 275 M252 265 Q242 270 235 275 M193 290 Q203 295 210 300 M193 305 C195 310 198 315 203 320 M207 305 C205 310 202 315 197 320 M153 290 C155 295 158 300 163 305 M247 290 C245 295 242 300 237 305' 
        },
        { 
          id: 'triceps', 
          name: 'Triceps', 
          path: 'M133 163 C121 168 115 183 121 198 L127 223 C133 238 143 248 158 253 C168 258 173 253 168 243 L163 218 C158 203 158 188 163 173 C168 168 163 163 153 168 L133 163 Z M267 163 C279 168 285 183 279 198 L273 223 C267 238 257 248 242 253 C232 258 227 253 232 243 L237 218 C242 203 242 188 237 173 C232 168 237 163 247 168 L267 163 Z M118 193 C106 198 100 213 106 228 L112 253 C118 268 128 278 143 283 C153 288 158 283 153 273 L148 248 C143 233 143 218 148 203 C153 198 148 193 138 198 L118 193 Z M282 193 C294 198 300 213 294 228 L288 253 C282 268 272 278 257 283 C247 288 242 283 247 273 L252 248 C257 233 257 218 252 203 C247 198 252 193 262 198 L282 193 Z M148 175 Q158 180 165 185 M252 175 Q242 180 235 185 M128 205 Q138 210 145 215 M272 205 Q262 210 255 215 M145 190 C147 195 150 200 155 205 M255 190 C253 195 250 200 245 205' 
        },
        { 
          id: 'lowerback', 
          name: 'Lower Back (Erector Spinae)', 
          path: 'M173 313 C167 318 167 333 173 348 L178 373 C183 388 188 403 193 418 L200 433 L207 418 C212 403 217 388 222 373 L227 348 C233 333 233 318 227 313 L173 313 Z M183 328 L183 343 C184 345 186 346 188 346 M200 328 L200 343 C201 345 203 346 205 346 M217 328 L217 343 C218 345 220 346 222 346 M183 358 L183 373 C184 375 186 376 188 376 M200 358 L200 373 C201 375 203 376 205 376 M217 358 L217 373 C218 375 220 376 222 376 M183 388 L183 403 C184 405 186 406 188 406 M200 388 L200 403 C201 405 203 406 205 406 M217 388 L217 403 C218 405 220 406 222 406 M158 348 C148 353 142 368 148 383 L154 408 C160 423 170 433 185 438 C195 443 200 438 195 428 L190 403 C185 388 185 373 190 358 C195 353 190 348 180 353 L158 348 Z M242 348 C252 353 258 368 252 383 L246 408 C240 423 230 433 215 438 C205 443 200 438 205 428 L210 403 C215 388 215 373 210 358 C205 353 210 348 220 353 L242 348 Z M180 320 Q200 315 220 320 M165 365 Q185 370 190 375 M220 375 Q210 370 215 365' 
        },
        { 
          id: 'glutes', 
          name: 'Glutes (Gluteus Maximus)', 
          path: 'M158 433 C146 438 140 453 146 468 L152 493 C158 508 168 518 183 523 L200 528 L217 523 C232 518 242 508 248 493 L254 468 C260 453 254 438 242 433 C230 428 220 423 200 423 C180 423 170 428 158 433 Z M173 448 L173 468 C174 471 176 473 178 473 M188 453 L188 473 C189 476 191 478 193 478 M200 453 L200 473 C201 476 203 478 205 478 M212 453 L212 473 C213 476 215 478 217 478 M227 448 L227 468 C228 471 230 473 232 473 M178 483 L178 503 C179 505 181 506 183 506 M200 483 L200 503 C201 505 203 506 205 506 M222 483 L222 503 C223 505 225 506 227 506 M143 463 C131 468 125 483 131 498 L137 523 C143 538 153 548 168 553 C178 558 183 553 178 543 L173 518 C168 503 168 488 173 473 C178 468 173 463 163 468 L143 463 Z M257 463 C269 468 275 483 269 498 L263 523 C257 538 247 548 232 553 C222 558 217 553 222 543 L227 518 C232 503 232 488 227 473 C222 468 227 463 237 468 L257 463 Z M170 438 Q200 433 230 438 M148 478 Q163 483 170 488 M230 488 Q237 483 252 478' 
        },
        { 
          id: 'hamstrings', 
          name: 'Hamstrings', 
          path: 'M158 523 C146 528 140 543 146 558 L152 593 C158 628 168 663 178 693 C183 708 188 713 193 708 L188 683 L183 648 L178 613 C173 593 173 573 178 553 C183 543 178 533 168 538 L158 523 Z M242 523 C254 528 260 543 254 558 L248 593 C242 628 232 663 222 693 C217 708 212 713 207 708 L212 683 L217 648 L222 613 C227 593 227 573 222 553 C217 543 222 533 232 538 L242 523 Z M183 538 C171 543 165 558 171 573 L177 608 C183 643 193 678 203 708 C208 723 213 728 218 723 L213 698 L208 663 L203 628 C198 608 198 588 203 568 C208 558 203 548 193 553 L183 538 Z M188 548 C176 553 170 568 176 583 L182 618 C188 653 198 688 208 718 C213 733 218 738 223 733 L218 708 L213 673 L208 638 C203 618 203 598 208 578 C213 568 208 558 198 563 L188 548 Z M163 535 Q173 540 180 545 M237 535 Q227 540 220 545 M193 560 Q203 565 210 570 M207 570 Q197 565 190 560 M183 580 C185 585 188 590 193 595 M217 580 C215 585 212 590 207 595' 
        },
        { 
          id: 'reardeltoids', 
          name: 'Rear Deltoids', 
          path: 'M123 128 C111 123 105 133 111 148 L117 168 C123 183 133 193 148 198 C158 203 163 198 158 188 L153 168 C148 153 148 138 153 123 C158 118 153 113 143 118 L123 128 Z M277 128 C289 123 295 133 289 148 L283 168 C277 183 267 193 252 198 C242 203 237 198 242 188 L247 168 C252 153 252 138 247 123 C242 118 247 113 257 118 L277 128 Z M138 140 Q148 145 155 150 M262 140 Q252 145 245 150 M131 155 C133 160 136 165 141 170 M269 155 C267 160 264 165 259 170 M145 160 L145 175 C146 177 148 178 150 178 M255 160 L255 175 C254 177 252 178 250 178' 
        },
        { 
          id: 'forearms', 
          name: 'Forearms', 
          path: 'M158 253 C146 258 140 273 146 288 L152 313 C158 328 168 338 183 343 C193 348 198 343 193 333 L188 308 C183 293 183 278 188 263 C193 258 188 253 178 258 L158 253 Z M242 253 C254 258 260 273 254 288 L248 313 C242 328 232 338 217 343 C207 348 202 343 207 333 L212 308 C217 293 217 278 212 263 C207 258 212 253 222 258 L242 253 Z M168 268 Q178 273 185 278 M232 268 Q222 273 215 278 M173 283 L173 298 L178 313 M227 283 L227 298 L222 313 M183 298 C185 303 188 308 193 313 M217 298 C215 303 212 308 207 313' 
        },
        { 
          id: 'calves', 
          name: 'Calves', 
          path: 'M178 693 C166 698 160 713 166 728 L172 753 C178 768 188 778 203 783 C213 788 218 783 213 773 L208 748 C203 733 203 718 208 703 C213 698 208 693 198 698 L178 693 Z M222 693 C234 698 240 713 234 728 L228 753 C222 768 212 778 197 783 C187 788 182 783 187 773 L192 748 C197 733 197 718 192 703 C187 698 192 693 202 698 L222 693 Z M183 705 Q193 710 200 715 M217 705 Q207 710 200 715 M188 720 L188 735 L193 750 M212 720 L212 735 L207 750 M193 740 C195 745 198 750 203 755 M207 740 C205 745 202 750 197 755' 
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
                      {/* Skull back with enhanced detail */}
                      <ellipse cx="200" cy="68" rx="38" ry="48" fill="url(#skeletonGradient)" stroke="#BDBDBD" strokeWidth="1"/>
                      <path d="M175 45 Q200 40 225 45" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
                      
                      {/* Enhanced spine with anatomical curves and vertebrae */}
                      <path d="M200 88 Q205 110 200 125 Q195 140 200 155 Q205 170 200 185 Q195 200 200 215 Q205 230 200 245 Q195 260 200 275 Q205 290 200 305 Q195 320 200 335 Q205 350 200 365 Q195 380 200 395" stroke="#BDBDBD" strokeWidth="3.5" fill="none"/>
                      
                      {/* Cervical vertebrae (C1-C7) */}
                      <circle cx="200" cy="95" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="105" r="3.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="115" r="3.5" fill="#BDBDBD"/>
                      
                      {/* Thoracic vertebrae (T1-T12) */}
                      <circle cx="200" cy="125" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="140" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="155" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="170" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="185" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="200" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="215" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="230" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="245" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="260" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="275" r="4" fill="#BDBDBD"/>
                      <circle cx="200" cy="290" r="4" fill="#BDBDBD"/>
                      
                      {/* Lumbar vertebrae (L1-L5) */}
                      <circle cx="200" cy="305" r="4.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="320" r="4.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="335" r="4.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="350" r="4.5" fill="#BDBDBD"/>
                      <circle cx="200" cy="365" r="4.5" fill="#BDBDBD"/>
                      
                      {/* Sacrum and coccyx */}
                      <ellipse cx="200" cy="380" rx="8" ry="12" fill="#BDBDBD" opacity="0.7"/>
                      <circle cx="200" cy="395" r="3" fill="#BDBDBD"/>
                      
                      {/* Enhanced shoulder blades (scapulae) with anatomical detail */}
                      <path d="M140 125 Q158 120 170 138 Q165 155 158 168 Q150 175 140 170 Q135 155 140 125 Z" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      <path d="M260 125 Q242 120 230 138 Q235 155 242 168 Q250 175 260 170 Q265 155 260 125 Z" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      
                      {/* Scapular spine and acromion */}
                      <line x1="145" y1="130" x2="165" y2="140" stroke="#BDBDBD" strokeWidth="1.5"/>
                      <line x1="255" y1="130" x2="235" y2="140" stroke="#BDBDBD" strokeWidth="1.5"/>
                      <circle cx="145" cy="130" r="2" fill="#BDBDBD"/>
                      <circle cx="255" cy="130" r="2" fill="#BDBDBD"/>
                      
                      {/* Enhanced pelvis back with anatomical landmarks */}
                      <ellipse cx="200" cy="375" rx="52" ry="32" fill="none" stroke="#BDBDBD" strokeWidth="2"/>
                      <path d="M148 375 Q200 365 252 375" stroke="#BDBDBD" strokeWidth="1.5" fill="none"/>
                      <circle cx="178" cy="375" r="3" fill="#BDBDBD"/>
                      <circle cx="222" cy="375" r="3" fill="#BDBDBD"/>
                      
                      {/* Posterior superior iliac spines */}
                      <circle cx="185" cy="370" r="2" fill="#BDBDBD"/>
                      <circle cx="215" cy="370" r="2" fill="#BDBDBD"/>
                      
                      {/* Enhanced arm bones with detailed joints */}
                      <circle cx="145" cy="130" r="4" fill="#BDBDBD"/>
                      <line x1="145" y1="130" x2="118" y2="208" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="118" cy="208" r="3.5" fill="#BDBDBD"/>
                      <line x1="118" y1="208" x2="98" y2="288" stroke="#BDBDBD" strokeWidth="3"/>
                      <circle cx="98" cy="288" r="3" fill="#BDBDBD"/>
                      
                      <circle cx="255" cy="130" r="4" fill="#BDBDBD"/>
                      <line x1="255" y1="130" x2="282" y2="208" stroke="#BDBDBD" strokeWidth="3.5"/>
                      <circle cx="282" cy="208" r="3.5" fill="#BDBDBD"/>
                      <line x1="282" y1="208" x2="302" y2="288" stroke="#BDBDBD" strokeWidth="3"/>
                      <circle cx="302" cy="288" r="3" fill="#BDBDBD"/>
                      
                      {/* Enhanced leg bones with anatomical detail */}
                      <circle cx="178" cy="390" r="4.5" fill="#BDBDBD"/>
                      <line x1="178" y1="390" x2="173" y2="535" stroke="#BDBDBD" strokeWidth="5"/>
                      <circle cx="173" cy="535" r="4" fill="#BDBDBD"/>
                      <line x1="173" y1="535" x2="168" y2="575" stroke="#BDBDBD" strokeWidth="4"/>
                      <circle cx="168" cy="575" r="3" fill="#BDBDBD"/>
                      
                      <circle cx="222" cy="390" r="4.5" fill="#BDBDBD"/>
                      <line x1="222" y1="390" x2="227" y2="535" stroke="#BDBDBD" strokeWidth="5"/>
                      <circle cx="227" cy="535" r="4" fill="#BDBDBD"/>
                      <line x1="227" y1="535" x2="232" y2="575" stroke="#BDBDBD" strokeWidth="4"/>
                      <circle cx="232" cy="575" r="3" fill="#BDBDBD"/>
                      
                      {/* Fibula bones */}
                      <line x1="170" y1="535" x2="165" y2="575" stroke="#BDBDBD" strokeWidth="2"/>
                      <line x1="230" y1="535" x2="235" y2="575" stroke="#BDBDBD" strokeWidth="2"/>
                      
                      {/* Ribs suggestion for back view */}
                      <path d="M185 140 Q200 135 215 140" stroke="#BDBDBD" strokeWidth="1" fill="none" opacity="0.6"/>
                      <path d="M180 155 Q200 150 220 155" stroke="#BDBDBD" strokeWidth="1" fill="none" opacity="0.6"/>
                      <path d="M175 170 Q200 165 225 170" stroke="#BDBDBD" strokeWidth="1" fill="none" opacity="0.6"/>
                      <path d="M178 185 Q200 180 222 185" stroke="#BDBDBD" strokeWidth="1" fill="none" opacity="0.6"/>
                      <path d="M180 200 Q200 195 220 200" stroke="#BDBDBD" strokeWidth="1" fill="none" opacity="0.6"/>
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