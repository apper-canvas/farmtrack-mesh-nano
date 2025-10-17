import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const cropService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...crops];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const crop = crops.find(c => c.Id === parseInt(id));
    return crop ? { ...crop } : null;
  },

  getByFarmId: async (farmId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return crops.filter(c => c.farmId === farmId.toString()).map(c => ({ ...c }));
  },

  create: async (cropData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCrop = {
      ...cropData,
      Id: Math.max(...crops.map(c => c.Id), 0) + 1
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  update: async (id, cropData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      crops[index] = { ...crops[index], ...cropData };
      return { ...crops[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      crops.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default cropService;