import waterData from '@/services/mockData/water.json';

let data = [...waterData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

// Helper to get today's date string
const getTodayString = () => new Date().toDateString();

const waterService = {
  // Get all water intake records
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...data];
  },

  // Get water intake record by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID: must be an integer');
    }
    const item = data.find(item => item.Id === parsedId);
    return item ? { ...item } : null;
  },

  // Get today's water intake summary
  getToday: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = getTodayString();
    const todayEntries = data.filter(item => item.date === today);
    const totalIntake = todayEntries.reduce((sum, item) => sum + item.amount, 0);
    
    // Get current goal (default 2000ml)
    const goalEntry = data.find(item => item.type === 'goal');
    const goal = goalEntry ? goalEntry.amount : 2000;
    
    return {
      intake: totalIntake,
      goal: goal,
      entries: todayEntries.length
    };
  },

  // Get water intake history (last 7 days)
  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const intakeEntries = data.filter(item => item.type === 'intake');
    return intakeEntries
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50); // Last 50 entries
  },

  // Add water intake
  addIntake: async (amount) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const newEntry = {
      Id: nextId++,
      type: 'intake',
      amount: parseInt(amount),
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      note: null
    };

    data.push(newEntry);
    return { ...newEntry };
  },

  // Update daily goal
  updateGoal: async (goalAmount) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!goalAmount || goalAmount < 500 || goalAmount > 5000) {
      throw new Error('Goal must be between 500ml and 5000ml');
    }

    // Remove existing goal
    data = data.filter(item => item.type !== 'goal');
    
    // Add new goal
    const newGoal = {
      Id: nextId++,
      type: 'goal',
      amount: parseInt(goalAmount),
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      note: 'Daily water intake goal'
    };

    data.push(newGoal);
    return { ...newGoal };
  },

  // Create new water entry (generic)
  create: async (item) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newItem = {
      ...item,
      Id: nextId++,
      timestamp: new Date().toISOString(),
      date: getTodayString()
    };
    
    data.push(newItem);
    return { ...newItem };
  },

  // Update water entry
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID: must be an integer');
    }

    const index = data.findIndex(item => item.Id === parsedId);
    if (index === -1) {
      throw new Error('Water entry not found');
    }

    // Prevent updating the Id field
    const { Id, ...dataToUpdate } = updateData;
    data[index] = { ...data[index], ...dataToUpdate };
    
    return { ...data[index] };
  },

  // Delete water entry
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID: must be an integer');
    }

    const index = data.findIndex(item => item.Id === parsedId);
    if (index === -1) {
      throw new Error('Water entry not found');
    }

    const deletedItem = data[index];
    data.splice(index, 1);
    return { ...deletedItem };
  },

  // Reset today's water intake
  resetDay: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const today = getTodayString();
    const beforeCount = data.length;
    data = data.filter(item => !(item.type === 'intake' && item.date === today));
    const deletedCount = beforeCount - data.length;
    
    return { deletedEntries: deletedCount };
  }
};

export default waterService;