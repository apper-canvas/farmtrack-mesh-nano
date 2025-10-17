import incomeData from "@/services/mockData/income.json";

let income = [...incomeData];

const incomeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...income];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const incomeItem = income.find(i => i.Id === parseInt(id));
    return incomeItem ? { ...incomeItem } : null;
  },

  create: async (incomeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newIncome = {
      ...incomeData,
      Id: Math.max(...income.map(i => i.Id), 0) + 1,
      totalAmount: incomeData.quantity * incomeData.pricePerUnit
    };
    income.push(newIncome);
    return { ...newIncome };
  },

  update: async (id, incomeData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = income.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      income[index] = { 
        ...income[index], 
        ...incomeData,
        totalAmount: incomeData.quantity * incomeData.pricePerUnit
      };
      return { ...income[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = income.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      income.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default incomeService;