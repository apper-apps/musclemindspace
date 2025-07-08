import { motion } from 'framer-motion';

const MuscleGroup = ({ 
  id, 
  name, 
  isSelected, 
  onClick, 
  path, 
  className = "" 
}) => {
  return (
    <motion.g
      className={`muscle-group ${isSelected ? 'selected' : ''} ${className}`}
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <path
        d={path}
        fill={isSelected ? '#2563EB' : '#64748B'}
        stroke={isSelected ? '#1D4ED8' : '#475569'}
        strokeWidth="2"
        opacity={isSelected ? 0.9 : 0.7}
      />
      <title>{name}</title>
    </motion.g>
  );
};

export default MuscleGroup;