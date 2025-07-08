import exerciseData from "@/services/mockData/exercises.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const exerciseService = {
  async getAll() {
    await delay(300);
    return [...exerciseData];
  },

  async getById(id) {
    await delay(200);
    const exercise = exerciseData.find(ex => ex.Id === parseInt(id));
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return { ...exercise };
  },

  async getByMuscleGroup(muscles) {
    await delay(250);
    return exerciseData.filter(exercise =>
      exercise.primaryMuscles.some(muscle => muscles.includes(muscle)) ||
      exercise.secondaryMuscles.some(muscle => muscles.includes(muscle))
    ).map(ex => ({ ...ex }));
  },

  async create(exerciseData) {
    await delay(400);
    const newExercise = {
      ...exerciseData,
      Id: Math.max(...exerciseData.map(ex => ex.Id)) + 1
    };
    return { ...newExercise };
  },

  async update(id, updates) {
    await delay(300);
    const exerciseIndex = exerciseData.findIndex(ex => ex.Id === parseInt(id));
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
    }
    const updatedExercise = { ...exerciseData[exerciseIndex], ...updates };
    return { ...updatedExercise };
  },

  async delete(id) {
    await delay(200);
    const exerciseIndex = exerciseData.findIndex(ex => ex.Id === parseInt(id));
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
}
    return true;
  },

  async getSmartSuggestions(selectedExercises) {
    await delay(400);
    
    if (!selectedExercises || selectedExercises.length === 0) {
      return [];
    }

    // Analyze current muscle group coverage
    const coveredMuscles = new Set();
    const muscleFrequency = {};
    
    selectedExercises.forEach(exercise => {
      [...exercise.primaryMuscles, ...exercise.secondaryMuscles].forEach(muscle => {
        coveredMuscles.add(muscle);
        muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
      });
    });

    // Define muscle group relationships and balance priorities
    const muscleGroups = {
      push: ['Chest', 'Shoulders', 'Triceps'],
      pull: ['Lats', 'Traps', 'Biceps'],
      legs: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      core: ['Abs']
    };

    // Identify gaps and imbalances
    const gaps = [];
    const underrepresented = [];

    // Check for muscle group balance
    Object.entries(muscleGroups).forEach(([groupName, muscles]) => {
      const groupCoverage = muscles.filter(muscle => coveredMuscles.has(muscle)).length;
      const groupTotal = muscles.length;
      
      if (groupCoverage === 0) {
        gaps.push(groupName);
      } else if (groupCoverage / groupTotal < 0.5) {
        underrepresented.push(groupName);
      }
    });

    // Find complementary exercises
    const availableExercises = exerciseData.filter(exercise => 
      !selectedExercises.find(selected => selected.Id === exercise.Id)
    );

    const suggestions = [];

    availableExercises.forEach(exercise => {
      let score = 0;
      let reasons = [];

      // Score based on filling gaps
      const exerciseMuscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
      
      // High priority for filling complete gaps
      gaps.forEach(gapGroup => {
        const gapMuscles = muscleGroups[gapGroup];
        if (exerciseMuscles.some(muscle => gapMuscles.includes(muscle))) {
          score += 40;
          reasons.push(`Targets ${gapGroup} muscles which are currently missing from your routine`);
        }
      });

      // Medium priority for balancing underrepresented groups
      underrepresented.forEach(underGroup => {
        const underMuscles = muscleGroups[underGroup];
        if (exerciseMuscles.some(muscle => underMuscles.includes(muscle))) {
          score += 25;
          reasons.push(`Helps balance your ${underGroup} muscle development`);
        }
      });

      // Bonus for targeting less frequent muscles
      exerciseMuscles.forEach(muscle => {
        const frequency = muscleFrequency[muscle] || 0;
        if (frequency === 0) {
          score += 15;
        } else if (frequency === 1) {
          score += 10;
        }
      });

      // Movement pattern diversity bonus
      const currentEquipment = selectedExercises.map(ex => ex.equipment);
      if (!currentEquipment.includes(exercise.equipment)) {
        score += 10;
        reasons.push(`Adds ${exercise.equipment.toLowerCase()} variety to your training`);
      }

      // Create suggestion object
      if (score > 0 && reasons.length > 0) {
        suggestions.push({
          exercise: { ...exercise },
score: Math.min(Math.round(score), 95),
          reason: reasons[0] // Use the most important reason
        });
      }
    });

    // Return top suggestions sorted by score
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  },

  async searchExercises(query) {
    await delay(300);
    
    // Ensure exerciseData is valid before filtering
    if (!Array.isArray(exerciseData) || exerciseData.length === 0) {
      return [];
    }
    
    if (!query || query.trim() === '') {
      return [];
    }
    
    const queryLower = query.toLowerCase();
    const results = exerciseData.filter(exercise =>
      exercise?.name?.toLowerCase().includes(queryLower) ||
      exercise?.primaryMuscles?.some(muscle => 
        muscle?.toLowerCase().includes(queryLower)
      ) ||
      exercise?.secondaryMuscles?.some(muscle => 
        muscle?.toLowerCase().includes(queryLower)
      ) ||
      exercise?.equipment?.toLowerCase().includes(queryLower)
    );
    
    return results.map(ex => ({ ...ex }));
  },

  async getExercisesByMuscle(muscleGroup) {
    await delay(200);
    
    if (!muscleGroup) {
      return [];
    }
    
    const results = exerciseData.filter(exercise =>
      exercise?.primaryMuscles?.includes(muscleGroup) ||
      exercise?.secondaryMuscles?.includes(muscleGroup)
    );
    
    return results.map(ex => ({ ...ex }));
  }
};