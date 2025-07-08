import workoutData from '@/services/mockData/workouts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workoutService = {
  async getAll() {
    await delay(300);
    return [...workoutData];
  },

  async getById(id) {
    await delay(200);
    const workout = workoutData.find(w => w.Id === parseInt(id));
    if (!workout) {
      throw new Error('Workout not found');
    }
    return { ...workout };
  },

  async create(workoutData) {
    await delay(400);
    const newWorkout = {
      ...workoutData,
      Id: Math.max(...workoutData.map(w => w.Id)) + 1
    };
    return { ...newWorkout };
  },

  async update(id, updates) {
    await delay(300);
    const workoutIndex = workoutData.findIndex(w => w.Id === parseInt(id));
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    const updatedWorkout = { ...workoutData[workoutIndex], ...updates };
    return { ...updatedWorkout };
  },

  async delete(id) {
    await delay(200);
    const workoutIndex = workoutData.findIndex(w => w.Id === parseInt(id));
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    return true;
  }
};