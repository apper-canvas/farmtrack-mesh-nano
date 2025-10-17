import { getApperClient } from "@/services/apperClient";

const taskService = {
  getAll: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('task_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "completed_c"}},
        {"field": {"Name": "completed_at_c"}}
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
    const response = await apperClient.getRecordById('task_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "completed_c"}},
        {"field": {"Name": "completed_at_c"}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  },

  create: async (taskData) => {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Name: taskData.title_c || taskData.title,
        title_c: taskData.title_c || taskData.title,
        description_c: taskData.description_c || taskData.description || "",
        farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c) : (taskData.farmId ? parseInt(taskData.farmId) : null),
        crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : (taskData.cropId ? parseInt(taskData.cropId) : null),
        due_date_c: taskData.due_date_c || taskData.dueDate,
        priority_c: taskData.priority_c || taskData.priority,
        completed_c: false,
        completed_at_c: null
      }]
    };

    if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;
    if (!payload.records[0].crop_id_c) delete payload.records[0].crop_id_c;

    const response = await apperClient.createRecord('task_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to create task');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  update: async (id, taskData) => {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: taskData.title_c || taskData.title,
        title_c: taskData.title_c || taskData.title,
        description_c: taskData.description_c || taskData.description || "",
        farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c) : (taskData.farmId ? parseInt(taskData.farmId) : null),
        crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : (taskData.cropId ? parseInt(taskData.cropId) : null),
        due_date_c: taskData.due_date_c || taskData.dueDate,
        priority_c: taskData.priority_c || taskData.priority,
        completed_c: taskData.completed_c !== undefined ? taskData.completed_c : taskData.completed,
        completed_at_c: taskData.completed_at_c || taskData.completedAt
      }]
    };

    if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;
    if (!payload.records[0].crop_id_c) delete payload.records[0].crop_id_c;

    const response = await apperClient.updateRecord('task_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to update task');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  toggleComplete: async (id) => {
    const apperClient = getApperClient();
    
    const taskResponse = await apperClient.getRecordById('task_c', parseInt(id), {
      fields: [
        {"field": {"Name": "completed_c"}}
      ]
    });

    if (!taskResponse.success) {
      console.error(taskResponse.message);
      throw new Error(taskResponse.message);
    }

    const currentCompleted = taskResponse.data.completed_c;
    
    const payload = {
      records: [{
        Id: parseInt(id),
        completed_c: !currentCompleted,
        completed_at_c: !currentCompleted ? new Date().toISOString() : null
      }]
    };

    const response = await apperClient.updateRecord('task_c', payload);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to toggle ${failed.length} records: ${JSON.stringify(failed)}`);
        throw new Error(failed[0].message || 'Failed to toggle task');
      }
      
      return successful[0].data;
    }

    return response.data;
  },

  delete: async (id) => {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('task_c', {
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
        throw new Error(failed[0].message || 'Failed to delete task');
      }
      
      return true;
    }

    return true;
  }
};

export default taskService;