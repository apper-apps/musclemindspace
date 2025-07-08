import progressData from "@/services/mockData/progress.json";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Validate and sanitize progress data
function validateProgressData(data) {
  if (!data || !Array.isArray(data)) {
    console.warn('Progress data is not an array:', data);
    return [];
  }
  
  return data.filter(item => {
    if (!item || typeof item !== 'object') {
      console.warn('Invalid progress item:', item);
      return false;
    }
    
    // Ensure required fields exist
    if (!item.date || typeof item.weight !== 'number') {
      console.warn('Progress item missing required fields:', item);
      return false;
    }
    
    // Validate measurements structure
    if (item.measurements && typeof item.measurements !== 'object') {
      console.warn('Invalid measurements structure:', item.measurements);
      return false;
    }
    
    return true;
  });
}

export const progressService = {
  async getAll() {
    try {
      await delay(500);
      const validatedData = validateProgressData(progressData);
      return validatedData;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      return [];
    }
  },

async create(progressEntry) {
    try {
      await delay(300);
      
      // Validate the progress entry
      if (!progressEntry || typeof progressEntry !== 'object') {
        throw new Error('Invalid progress entry provided');
      }
      
      if (!progressEntry.date || typeof progressEntry.weight !== 'number') {
        throw new Error('Progress entry missing required fields (date, weight)');
      }
      
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
      
      // Ensure progressData is an array
      const safeProgressData = Array.isArray(progressData) ? progressData : [];
      
      const newEntry = {
        ...progressEntry,
        Id: safeProgressData.length > 0 ? Math.max(...safeProgressData.map(p => p.Id || 0)) + 1 : 1,
        measurements: progressEntry.measurements || {},
        beforePhotoUrl: validateImageData(progressEntry.beforePhotoUrl),
        afterPhotoUrl: validateImageData(progressEntry.afterPhotoUrl)
      };
      
      safeProgressData.push(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error adding progress entry:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
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
    } catch (error) {
      console.error('Error updating progress entry:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(200);
      const progressIndex = progressData.findIndex(p => p.Id === parseInt(id));
      if (progressIndex === -1) {
        throw new Error('Progress record not found');
      }
      return true;
    } catch (error) {
      console.error('Error deleting progress entry:', error);
      throw error;
    }
  }
};