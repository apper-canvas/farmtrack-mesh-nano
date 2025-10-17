import { getApperClient } from "@/services/apperClient";

const incomeService = {
  getAll: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('income_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "quantity_c"}},
        {"field": {"Name": "price_per_unit_c"}},
        {"field": {"Name": "buyer_c"}},
        {"field": {"Name": "total_amount_c"}}
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
    const response = await apperClient.getRecordById('income_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "quantity_c"}},
        {"field": {"Name": "price_per_unit_c"}},
        {"field": {"Name": "buyer_c"}},
        {"field": {"Name": "total_amount_c"}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  },

  create: async (incomeData) => {
    const apperClient = getApperClient();
    const quantity = parseFloat(incomeData.quantity_c || incomeData.quantity);
    const pricePerUnit = parseFloat(incomeData.price_per_unit_c || incomeData.pricePerUnit);
    
    const payload = {
      records: [{
        Name: `Income - ${incomeData.buyer_c || incomeData.buyer}`,
        date_c: incomeData.date_c || incomeData.date,
        crop_id_c: parseInt(incomeData.crop_id_c || incomeData.cropId),
        quantity_c: quantity,
        price_per_unit_c: pricePerUnit,
        buyer_c: incomeData.buyer_c || incomeData.buyer,
        total_amount_c: quantity * pricePerUnit
      }]
    };

    const response = await apperClient.createRecord('income_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to create income');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  update: async (id, incomeData) => {
    const apperClient = getApperClient();
    const quantity = parseFloat(incomeData.quantity_c || incomeData.quantity);
    const pricePerUnit = parseFloat(incomeData.price_per_unit_c || incomeData.pricePerUnit);
    
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: `Income - ${incomeData.buyer_c || incomeData.buyer}`,
        date_c: incomeData.date_c || incomeData.date,
        crop_id_c: parseInt(incomeData.crop_id_c || incomeData.cropId),
        quantity_c: quantity,
        price_per_unit_c: pricePerUnit,
        buyer_c: incomeData.buyer_c || incomeData.buyer,
        total_amount_c: quantity * pricePerUnit
      }]
    };

    const response = await apperClient.updateRecord('income_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to update income');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  delete: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('income_c', {
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
        throw new Error(failed[0].message || 'Failed to delete income');
      }
      
      return true;
    }

    return true;
  }
};

export default incomeService;