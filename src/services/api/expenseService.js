import expensesData from "@/services/mockData/expenses.json";

let expenses = [...expensesData];

const expenseService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...expenses];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const expense = expenses.find(e => e.Id === parseInt(id));
    return expense ? { ...expense } : null;
  },

  create: async (expenseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newExpense = {
      ...expenseData,
      Id: Math.max(...expenses.map(e => e.Id), 0) + 1
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  update: async (id, expenseData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...expenseData };
      return { ...expenses[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default expenseService;