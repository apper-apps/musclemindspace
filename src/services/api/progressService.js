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
    
    // Validate and sanitize photo URLs
    const sanitizePhotoUrl = (url) => {
      if (!url || typeof url !== 'string') return null;
      
      // Check if URL is accessible (basic validation)
      try {
        new URL(url);
        // For demo purposes, return null for external URLs that might fail
        // In production, you'd want to validate URL accessibility
        if (url.includes('unsplash.com') || url.includes('external')) {
          return null; // Remove unreliable external URLs
        }
        return url;
      } catch {
        return null;
      }
    };
    
    const newProgress = {
      ...progressEntry,
      Id: Math.max(...progressData.map(p => p.Id)) + 1,
      beforePhotoUrl: sanitizePhotoUrl(progressEntry.beforePhotoUrl),
      afterPhotoUrl: sanitizePhotoUrl(progressEntry.afterPhotoUrl)
    };
    return { ...newProgress };
  },

async update(id, updates) {
    await delay(300);
    const progressIndex = progressData.findIndex(p => p.Id === parseInt(id));
    if (progressIndex === -1) {
      throw new Error('Progress record not found');
    }
    
    // Sanitize photo URLs in updates
    const sanitizePhotoUrl = (url) => {
      if (!url || typeof url !== 'string') return null;
      
      try {
        new URL(url);
        if (url.includes('unsplash.com') || url.includes('external')) {
          return null;
        }
        return url;
      } catch {
        return null;
      }
    };
    
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.beforePhotoUrl !== undefined) {
      sanitizedUpdates.beforePhotoUrl = sanitizePhotoUrl(sanitizedUpdates.beforePhotoUrl);
    }
    if (sanitizedUpdates.afterPhotoUrl !== undefined) {
      sanitizedUpdates.afterPhotoUrl = sanitizePhotoUrl(sanitizedUpdates.afterPhotoUrl);
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