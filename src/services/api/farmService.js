import { getApperClient } from "@/services/apperClient";

const farmService = {
  getAll: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('farm_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "total_area_c"}},
        {"field": {"Name": "unit_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "created_at_c"}}
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
    const response = await apperClient.getRecordById('farm_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "total_area_c"}},
        {"field": {"Name": "unit_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "created_at_c"}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  },

  create: async (farmData) => {
    const apperClient = getApperClient();
    const payload = {
      records: [{
        Name: farmData.name_c || farmData.name,
        name_c: farmData.name_c || farmData.name,
        location_c: farmData.location_c || farmData.location,
        total_area_c: parseFloat(farmData.total_area_c || farmData.totalArea),
        unit_c: farmData.unit_c || farmData.unit,
        notes_c: farmData.notes_c || farmData.notes || "",
        created_at_c: new Date().toISOString()
      }]
    };

    const response = await apperClient.createRecord('farm_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to create farm');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  update: async (id, farmData) => {
    const apperClient = getApperClient();
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: farmData.name_c || farmData.name,
        name_c: farmData.name_c || farmData.name,
        location_c: farmData.location_c || farmData.location,
        total_area_c: parseFloat(farmData.total_area_c || farmData.totalArea),
        unit_c: farmData.unit_c || farmData.unit,
        notes_c: farmData.notes_c || farmData.notes || ""
      }]
    };

    const response = await apperClient.updateRecord('farm_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to update farm');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  delete: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('farm_c', {
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
        throw new Error(failed[0].message || 'Failed to delete farm');
      }
      
      return true;
    }

    return true;
  }
};

export default farmService;