import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const farmService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...farms];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const farm = farms.find(f => f.Id === parseInt(id));
    return farm ? { ...farm } : null;
  },

  create: async (farmData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newFarm = {
      ...farmData,
      Id: Math.max(...farms.map(f => f.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  update: async (id, farmData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index !== -1) {
      farms[index] = { ...farms[index], ...farmData };
      return { ...farms[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index !== -1) {
      farms.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default farmService;