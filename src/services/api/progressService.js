import progressData from '@/services/mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getAll() {
    await delay(300);
    return [...progressData];
  },

  async getById(id) {
    await delay(200);
    const progress = progressData.find(p => p.Id === parseInt(id));
    if (!progress) {
      throw new Error('Progress record not found');
    }
    return { ...progress };
  },

  async create(progressEntry) {
    await delay(400);
    const newProgress = {
      ...progressEntry,
      Id: Math.max(...progressData.map(p => p.Id)) + 1
    };
    return { ...newProgress };
  },

  async update(id, updates) {
    await delay(300);
    const progressIndex = progressData.findIndex(p => p.Id === parseInt(id));
    if (progressIndex === -1) {
      throw new Error('Progress record not found');
    }
    const updatedProgress = { ...progressData[progressIndex], ...updates };
    return { ...updatedProgress };
  },

  async delete(id) {
    await delay(200);
    const progressIndex = progressData.findIndex(p => p.Id === parseInt(id));
    if (progressIndex === -1) {
      throw new Error('Progress record not found');
    }
    return true;
  }
};