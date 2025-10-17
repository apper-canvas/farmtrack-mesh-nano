import { getApperClient } from "@/services/apperClient";

const expenseService = {
  getAll: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('expense_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "amount_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  },

  getById: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('expense_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "amount_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  },

  create: async (expenseData) => {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Name: expenseData.description_c || expenseData.description,
        date_c: expenseData.date_c || expenseData.date,
        category_c: expenseData.category_c || expenseData.category,
        amount_c: parseFloat(expenseData.amount_c || expenseData.amount),
        description_c: expenseData.description_c || expenseData.description,
        farm_id_c: expenseData.farm_id_c ? parseInt(expenseData.farm_id_c) : (expenseData.farmId ? parseInt(expenseData.farmId) : null)
      }]
    };

    if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;

    const response = await apperClient.createRecord('expense_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to create expense');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  update: async (id, expenseData) => {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: expenseData.description_c || expenseData.description,
        date_c: expenseData.date_c || expenseData.date,
        category_c: expenseData.category_c || expenseData.category,
        amount_c: parseFloat(expenseData.amount_c || expenseData.amount),
        description_c: expenseData.description_c || expenseData.description,
        farm_id_c: expenseData.farm_id_c ? parseInt(expenseData.farm_id_c) : (expenseData.farmId ? parseInt(expenseData.farmId) : null)
      }]
    };

    if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;

    const response = await apperClient.updateRecord('expense_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to update expense');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  delete: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('expense_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to delete expense');
      }
      
      return true;
    }

    return true;
  }
};

export default expenseService;