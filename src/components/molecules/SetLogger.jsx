import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SetLogger = ({ 
  sets = [], 
  onSetsChange, 
  exerciseName 
}) => {
  const [localSets, setLocalSets] = useState(sets);

  const addSet = () => {
    const newSet = {
      Id: Date.now(),
      reps: 0,
      weight: 0,
      completed: false
    };
    const updatedSets = [...localSets, newSet];
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  const updateSet = (setId, field, value) => {
    const updatedSets = localSets.map(set => 
      set.Id === setId ? { ...set, [field]: value } : set
    );
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  const removeSet = (setId) => {
    const updatedSets = localSets.filter(set => set.Id !== setId);
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  const toggleCompleted = (setId) => {
    const updatedSets = localSets.map(set =>
      set.Id === setId ? { ...set, completed: !set.completed } : set
    );
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-gray-900">
          {exerciseName}
        </h4>
        <Button
          variant="accent"
          size="sm"
          onClick={addSet}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
          Add Set
        </Button>
      </div>

      <div className="space-y-2">
        {localSets.map((set, index) => (
          <motion.div
            key={set.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              set.completed 
                ? 'bg-gradient-to-r from-success/10 to-emerald-50 border-success/20' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-sm font-medium text-gray-600 w-8">
                {index + 1}
              </span>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(set.Id, 'reps', parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                  placeholder="Reps"
                />
                <span className="text-xs text-gray-500">reps</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(set.Id, 'weight', parseFloat(e.target.value) || 0)}
                  className="w-20 text-center"
                  placeholder="Weight"
                  step="0.5"
                />
                <span className="text-xs text-gray-500">lbs</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCompleted(set.Id)}
                className={`set-completion w-8 h-8 rounded-full flex items-center justify-center ${
                  set.completed 
                    ? 'bg-gradient-to-r from-success to-emerald-600 text-white' 
                    : 'border-2 border-gray-300 hover:border-success'
                }`}
              >
                {set.completed && <ApperIcon name="Check" className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeSet(set.Id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {localSets.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No sets added yet. Click "Add Set" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SetLogger;