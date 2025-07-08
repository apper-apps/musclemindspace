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
    return 'url(#muscleGradient)';
  };

  const getStrokeColor = () => {
    if (isSelected) return '#1D4ED8';
    if (recoveryMode) return '#B71C1C';
    return '#C62828';
  };

  return (
    <motion.g
      className={`muscle-group ${isSelected ? 'selected' : ''} ${recoveryMode ? 'recovery-mode' : ''} ${className}`}
      onClick={() => onClick(id)}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      aria-label={`${name} muscle group ${isSelected ? '(selected)' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      <path
        d={path}
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth="2"
        opacity={isSelected ? 1 : 0.85}
        className="muscle-path"
      />
      <title>{name}</title>
    </motion.g>
  );
};

export default MuscleGroup;