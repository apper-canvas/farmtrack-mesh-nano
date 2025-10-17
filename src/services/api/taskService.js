import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const taskService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return { ...tasks[index] };
    }
    return null;
  },

  toggleComplete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
      return { ...tasks[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default taskService;