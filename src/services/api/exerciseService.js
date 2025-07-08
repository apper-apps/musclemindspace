import exerciseData from '@/services/mockData/exercises.json';

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
  }
};