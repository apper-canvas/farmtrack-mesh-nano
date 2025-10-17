import { getApperClient } from "@/services/apperClient";

const cropService = {
  getAll: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('crop_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "crop_name_c"}},
        {"field": {"Name": "variety_c"}},
        {"field": {"Name": "planting_date_c"}},
        {"field": {"Name": "expected_harvest_date_c"}},
        {"field": {"Name": "area_planted_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "notes_c"}}
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
    const response = await apperClient.getRecordById('crop_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "crop_name_c"}},
        {"field": {"Name": "variety_c"}},
        {"field": {"Name": "planting_date_c"}},
        {"field": {"Name": "expected_harvest_date_c"}},
        {"field": {"Name": "area_planted_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "notes_c"}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  },

  getByFarmId: async (farmId) => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('crop_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "crop_name_c"}},
        {"field": {"Name": "variety_c"}},
        {"field": {"Name": "planting_date_c"}},
        {"field": {"Name": "expected_harvest_date_c"}},
        {"field": {"Name": "area_planted_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "notes_c"}}
      ],
      where: [{
        "FieldName": "farm_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(farmId)]
      }]
    });

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  },

  create: async (cropData) => {
    const apperClient = getApperClient();
    const payload = {
      records: [{
        Name: cropData.crop_name_c || cropData.cropName,
        farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId),
        crop_name_c: cropData.crop_name_c || cropData.cropName,
        variety_c: cropData.variety_c || cropData.variety,
        planting_date_c: cropData.planting_date_c || cropData.plantingDate,
        expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
        area_planted_c: parseFloat(cropData.area_planted_c || cropData.areaPlanted),
        status_c: cropData.status_c || cropData.status,
        notes_c: cropData.notes_c || cropData.notes || ""
      }]
    };

    const response = await apperClient.createRecord('crop_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to create crop');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  update: async (id, cropData) => {
    const apperClient = getApperClient();
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: cropData.crop_name_c || cropData.cropName,
        farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId),
        crop_name_c: cropData.crop_name_c || cropData.cropName,
        variety_c: cropData.variety_c || cropData.variety,
        planting_date_c: cropData.planting_date_c || cropData.plantingDate,
        expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
        area_planted_c: parseFloat(cropData.area_planted_c || cropData.areaPlanted),
        status_c: cropData.status_c || cropData.status,
        notes_c: cropData.notes_c || cropData.notes || ""
      }]
    };

    const response = await apperClient.updateRecord('crop_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to update crop');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  delete: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('crop_c', {
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
        throw new Error(failed[0].message || 'Failed to delete crop');
      }
      
      return true;
    }

    return true;
  }
};

export default cropService;