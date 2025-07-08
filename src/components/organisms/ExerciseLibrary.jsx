import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseCard from '@/components/molecules/ExerciseCard';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { exerciseService } from '@/services/api/exerciseService';

const ExerciseLibrary = ({ 
  selectedMuscles = [], 
  onExerciseSelect,
  className = "" 
}) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedMuscles, searchTerm, equipmentFilter, difficultyFilter]);

  const loadExercises = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by selected muscles
    if (selectedMuscles.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.primaryMuscles.some(muscle =>
          selectedMuscles.includes(muscle)
        ) ||
        exercise.secondaryMuscles.some(muscle =>
          selectedMuscles.includes(muscle)
        )
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.primaryMuscles.some(muscle =>
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by equipment
    if (equipmentFilter !== 'all') {
      filtered = filtered.filter(exercise =>
        exercise.equipment.toLowerCase() === equipmentFilter.toLowerCase()
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(exercise =>
        exercise.difficulty === parseInt(difficultyFilter)
      );
    }

    setFilteredExercises(filtered);
  };

  const handleExerciseSelect = (exercise) => {
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  const getUniqueEquipment = () => {
    const equipment = [...new Set(exercises.map(ex => ex.equipment))];
    return equipment.sort();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadExercises} />;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Exercise Library
        </h3>
        <div className="flex items-center space-x-2 text-sm text-secondary">
          <ApperIcon name="Filter" className="w-4 h-4" />
          <span>{filteredExercises.length} exercises</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Equipment:</label>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1"
            >
              <option value="all">All</option>
              {getUniqueEquipment().map(equipment => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Difficulty:</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1"
            >
              <option value="all">All</option>
              <option value="1">Beginner</option>
              <option value="2">Easy</option>
              <option value="3">Intermediate</option>
              <option value="4">Hard</option>
              <option value="5">Expert</option>
            </select>
          </div>

          {(searchTerm || equipmentFilter !== 'all' || difficultyFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setEquipmentFilter('all');
                setDifficultyFilter('all');
              }}
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredExercises.map((exercise) => (
                <motion.div
                  key={exercise.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExerciseCard
                    exercise={exercise}
                    onDragStart={() => handleExerciseSelect(exercise)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Empty
            title="No exercises found"
            description={
              selectedMuscles.length > 0
                ? "No exercises match your selected muscle groups and filters."
                : "Select muscle groups to see relevant exercises."
            }
            icon="Dumbbell"
          />
        )}
      </div>

      {/* Selection Hint */}
      {selectedMuscles.length === 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 text-center">
          <ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-sm text-gray-700 mb-2">
            <strong>Pro tip:</strong> Select muscle groups on the anatomy diagram to see targeted exercises
          </p>
          <p className="text-xs text-secondary">
            Drag exercises to your routine builder to create your workout
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;