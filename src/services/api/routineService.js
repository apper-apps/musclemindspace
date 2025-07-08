import routineData from '@/services/mockData/routines.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const routineService = {
  async getAll() {
    await delay(300);
    return [...routineData];
  },

  async getById(id) {
    await delay(200);
    const routine = routineData.find(r => r.Id === parseInt(id));
    if (!routine) {
      throw new Error('Routine not found');
    }
    return { ...routine };
  },

  async create(routineData) {
    await delay(400);
    const newRoutine = {
      ...routineData,
      Id: Math.max(...routineData.map(r => r.Id)) + 1
    };
    return { ...newRoutine };
  },

  async update(id, updates) {
    await delay(300);
    const routineIndex = routineData.findIndex(r => r.Id === parseInt(id));
    if (routineIndex === -1) {
      throw new Error('Routine not found');
    }
    const updatedRoutine = { ...routineData[routineIndex], ...updates };
    return { ...updatedRoutine };
  },

  async delete(id) {
    await delay(200);
    const routineIndex = routineData.findIndex(r => r.Id === parseInt(id));
    if (routineIndex === -1) {
      throw new Error('Routine not found');
    }
    return true;
  }
};