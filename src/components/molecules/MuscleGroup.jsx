import { motion } from 'framer-motion';

const MuscleGroup = ({ 
  id, 
  name, 
  isSelected, 
  onClick, 
  path, 
  className = "",
  customFill = null,
  recoveryMode = false
}) => {
const getFillColor = () => {
    if (customFill) return customFill;
    if (isSelected) return 'url(#selectedGradient)';
    if (recoveryMode) return 'url(#unselectedGradient)';
    return 'url(#muscleGradient)';
  };

  const getStrokeColor = () => {
    if (isSelected) return '#2563EB';
    if (recoveryMode) return '#6B7280';
    return '#DC2626';
  };

  const getStrokeWidth = () => {
    if (isSelected) return '2.5';
    return '2';
  };

return (
    <motion.g
      className={`muscle-group ${isSelected ? 'selected' : ''} ${recoveryMode ? 'recovery-mode' : ''} ${className}`}
      onClick={() => onClick(id)}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.15 }
      }}
      whileTap={{ scale: 0.97 }}
      role="button"
      tabIndex={0}
      aria-label={`${name} muscle group ${isSelected ? '(selected)' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Enhanced touch target for mobile */}
      <path
        d={path}
        fill="transparent"
        stroke="transparent"
        strokeWidth="15"
        className="muscle-touch-target"
        style={{ pointerEvents: 'all' }}
      />
      
      {/* Visible muscle path with enhanced styling */}
      <path
        d={path}
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        opacity={isSelected ? 1 : 0.88}
        className="muscle-path"
        style={{ 
          filter: isSelected ? 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.6))' : 'none',
          pointerEvents: 'none'
        }}
      />
      
      {/* Muscle fiber texture overlay for realism */}
      <path
        d={path}
        fill="url(#muscleTexture)"
        stroke="none"
        opacity="0.15"
        className="muscle-texture"
        style={{ pointerEvents: 'none' }}
      />
      
      <title>{name}</title>
    </motion.g>
  );
};

export default MuscleGroup;