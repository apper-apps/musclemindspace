import muscleInfoData from "@/services/mockData/muscleInfo.json";
import { exerciseService } from "./exerciseService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const muscleInfoService = {
  async getAll() {
    await delay(300);
    return [...muscleInfoData];
  },

  async getById(id) {
    await delay(200);
    const muscleInfo = muscleInfoData.find(muscle => muscle.Id === parseInt(id));
    if (!muscleInfo) {
      throw new Error('Muscle information not found');
    }
    return { ...muscleInfo };
  },

  async getByName(muscleName) {
    await delay(200);
    const muscleInfo = muscleInfoData.find(muscle => 
      muscle.name === muscleName || 
      muscle.name.toLowerCase().includes(muscleName.toLowerCase())
    );
    if (!muscleInfo) {
      throw new Error('Muscle information not found');
    }
    return { ...muscleInfo };
  },

  async getMuscleWithExercises(muscleName) {
    await delay(300);
    
    try {
      const muscleInfo = await this.getByName(muscleName);
      const allExercises = await exerciseService.getAll();
      
      // Get exercises that match the muscle's exercise IDs
      const muscleExercises = allExercises.filter(exercise => 
        muscleInfo.exercises.includes(exercise.Id)
      );
      
      // Also get exercises that target this muscle group
      const additionalExercises = allExercises.filter(exercise =>
        (exercise.primaryMuscles && exercise.primaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(muscleName.toLowerCase().split(' ')[0]) ||
          muscleName.toLowerCase().includes(muscle.toLowerCase())
        )) ||
        (exercise.secondaryMuscles && exercise.secondaryMuscles.some(muscle =>
          muscle.toLowerCase().includes(muscleName.toLowerCase().split(' ')[0]) ||
          muscleName.toLowerCase().includes(muscle.toLowerCase())
        ))
      );

      // Combine and deduplicate exercises
      const allMuscleExercises = [...muscleExercises];
      additionalExercises.forEach(exercise => {
        if (!allMuscleExercises.find(ex => ex.Id === exercise.Id)) {
          allMuscleExercises.push(exercise);
        }
      });

      return {
        ...muscleInfo,
        relatedExercises: allMuscleExercises.slice(0, 8) // Limit to 8 exercises
      };
    } catch (error) {
      throw new Error(`Failed to get muscle information: ${error.message}`);
    }
  },

  async updateMuscleStatus(muscleName, statusUpdate) {
    await delay(400);
    const muscleIndex = muscleInfoData.findIndex(muscle => muscle.name === muscleName);
    if (muscleIndex === -1) {
      throw new Error('Muscle not found');
    }
    
    const updatedMuscle = {
      ...muscleInfoData[muscleIndex],
      status: {
        ...muscleInfoData[muscleIndex].status,
        ...statusUpdate,
        lastWorked: new Date().toISOString().split('T')[0]
      }
    };
    
    return { ...updatedMuscle };
  },

  async getMuscleRecoveryData() {
    await delay(250);
    const recoveryData = {};
    
    muscleInfoData.forEach(muscle => {
      recoveryData[muscle.name] = {
        intensity: (100 - muscle.status.recovery) / 100,
        needsRest: muscle.status.recovery < 70,
        strength: muscle.status.strength,
        flexibility: muscle.status.flexibility,
        lastWorked: muscle.status.lastWorked
      };
    });
    
    return recoveryData;
  },

  async create(muscleData) {
    await delay(400);
    const newMuscle = {
      ...muscleData,
      Id: Math.max(...muscleInfoData.map(m => m.Id)) + 1,
      status: {
        strength: 50,
        flexibility: 50,
        recovery: 100,
        lastWorked: new Date().toISOString().split('T')[0]
      }
    };
    return { ...newMuscle };
  },

  async update(id, updates) {
    await delay(300);
    const muscleIndex = muscleInfoData.findIndex(muscle => muscle.Id === parseInt(id));
    if (muscleIndex === -1) {
      throw new Error('Muscle not found');
    }
    const updatedMuscle = { ...muscleInfoData[muscleIndex], ...updates };
    return { ...updatedMuscle };
  },

  async delete(id) {
    await delay(200);
    const muscleIndex = muscleInfoData.findIndex(muscle => muscle.Id === parseInt(id));
    if (muscleIndex === -1) {
      throw new Error('Muscle not found');
    }
    return true;
  }
};