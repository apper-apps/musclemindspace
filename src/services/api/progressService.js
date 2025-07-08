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
    
    // Validate base64 image data
    const validateImageData = (data) => {
      if (!data || typeof data !== 'string') return null;
      
      // Check if it's a valid base64 image
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (base64Regex.test(data)) {
        return data;
      }
      
      return null;
    };
    
    const newProgress = {
      ...progressEntry,
      Id: Math.max(...progressData.map(p => p.Id)) + 1,
      beforePhotoUrl: validateImageData(progressEntry.beforePhotoUrl),
      afterPhotoUrl: validateImageData(progressEntry.afterPhotoUrl)
    };
    return { ...newProgress };
  },

async update(id, updates) {
    await delay(300);
    const progressIndex = progressData.findIndex(p => p.Id === parseInt(id));
    if (progressIndex === -1) {
      throw new Error('Progress record not found');
    }
    
    // Validate base64 image data in updates
    const validateImageData = (data) => {
      if (!data || typeof data !== 'string') return null;
      
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (base64Regex.test(data)) {
        return data;
      }
      
      return null;
    };
    
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.beforePhotoUrl !== undefined) {
      sanitizedUpdates.beforePhotoUrl = validateImageData(sanitizedUpdates.beforePhotoUrl);
    }
    if (sanitizedUpdates.afterPhotoUrl !== undefined) {
      sanitizedUpdates.afterPhotoUrl = validateImageData(sanitizedUpdates.afterPhotoUrl);
    }
    
    const updatedProgress = { ...progressData[progressIndex], ...sanitizedUpdates };
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