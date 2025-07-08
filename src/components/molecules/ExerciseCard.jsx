import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ExerciseCard = ({ 
  exercise, 
  onDragStart, 
  onDragEnd, 
  isDragging = false,
  className = ""
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(exercise));
    if (onDragStart) onDragStart(exercise);
  };

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`exercise-card bg-white rounded-lg p-4 shadow-md cursor-grab active:cursor-grabbing ${isDragging ? 'dragging' : ''} ${className}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-display font-semibold text-gray-900 mb-1">
            {exercise.name}
          </h4>
          <p className="text-xs text-secondary">
            {exercise.equipment}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                className={`w-3 h-3 ${
                  i < exercise.difficulty 
                    ? 'text-warning fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Primary:</p>
          <div className="flex flex-wrap gap-1">
            {exercise.primaryMuscles.map((muscle, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-primary to-blue-600 text-white text-xs rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
        
        {exercise.secondaryMuscles.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Secondary:</p>
            <div className="flex flex-wrap gap-1">
              {exercise.secondaryMuscles.map((muscle, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-accent to-emerald-600 text-white text-xs rounded-full"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExerciseCard;