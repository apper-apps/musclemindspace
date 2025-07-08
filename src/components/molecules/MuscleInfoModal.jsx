import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useState, useEffect } from 'react';

const MuscleInfoModal = ({ isOpen, onClose, muscleData, loading, error }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (value) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold">
                  {loading ? 'Loading...' : muscleData?.name || 'Muscle Information'}
                </h2>
                {muscleData?.primaryFunction && (
                  <p className="text-blue-100 mt-1">{muscleData.primaryFunction}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-4">
              {['overview', 'exercises', 'injuries', 'status'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-primary'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">Loading muscle information...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">Error loading muscle information: {error}</span>
                </div>
              </div>
            )}

            {muscleData && (
              <div className="space-y-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{muscleData.description}</p>
                    </div>

                    {muscleData.tips && muscleData.tips.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <ApperIcon name="Lightbulb" className="w-5 h-5 text-blue-600 mr-2" />
                          Training Tips
                        </h3>
                        <ul className="space-y-2">
                          {muscleData.tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <ApperIcon name="Check" className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Exercises Tab */}
                {activeTab === 'exercises' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <ApperIcon name="Dumbbell" className="w-5 h-5 text-primary mr-2" />
                      Related Exercises
                    </h3>
                    
                    {muscleData.relatedExercises && muscleData.relatedExercises.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {muscleData.relatedExercises.map((exercise) => (
                          <div
                            key={exercise.Id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-medium text-gray-900 mb-2">{exercise.name}</h4>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                                Equipment: {exercise.equipment}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
                                Difficulty: {exercise.difficulty}/5
                              </div>
                              {exercise.primaryMuscles && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {exercise.primaryMuscles.map((muscle, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full"
                                    >
                                      {muscle}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No related exercises found for this muscle group.
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Injuries Tab */}
                {activeTab === 'injuries' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-2" />
                      Common Injuries & Prevention
                    </h3>
                    
                    {muscleData.commonInjuries && muscleData.commonInjuries.length > 0 ? (
                      <div className="space-y-4">
                        {muscleData.commonInjuries.map((injury, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">{injury.type}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(injury.severity)}`}>
                                {injury.severity}
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Symptoms:</h5>
                                <p className="text-sm text-gray-600">{injury.symptoms}</p>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Prevention:</h5>
                                <p className="text-sm text-gray-600">{injury.prevention}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Shield" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No injury information available for this muscle group.
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Status Tab */}
                {activeTab === 'status' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <ApperIcon name="Activity" className="w-5 h-5 text-green-600 mr-2" />
                      Current Status
                    </h3>
                    
                    {muscleData.status && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strength */}
                        <div className={`bg-white border rounded-lg p-4 ${getStatusBg(muscleData.status.strength)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Strength</span>
                            <span className={`font-bold ${getStatusColor(muscleData.status.strength)}`}>
                              {muscleData.status.strength}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${muscleData.status.strength}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Flexibility */}
                        <div className={`bg-white border rounded-lg p-4 ${getStatusBg(muscleData.status.flexibility)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Flexibility</span>
                            <span className={`font-bold ${getStatusColor(muscleData.status.flexibility)}`}>
                              {muscleData.status.flexibility}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${muscleData.status.flexibility}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Recovery */}
                        <div className={`bg-white border rounded-lg p-4 ${getStatusBg(muscleData.status.recovery)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Recovery</span>
                            <span className={`font-bold ${getStatusColor(muscleData.status.recovery)}`}>
                              {muscleData.status.recovery}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${muscleData.status.recovery}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Last Worked */}
                        <div className="bg-white border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Last Worked</span>
                            <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-gray-600">
                            {muscleData.status.lastWorked ? 
                              new Date(muscleData.status.lastWorked).toLocaleDateString() : 
                              'Never'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MuscleInfoModal;