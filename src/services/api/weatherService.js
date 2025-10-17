import { getApperClient } from "@/services/apperClient";

const weatherService = {
  getCurrentWeather: async () => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('weather_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "condition_c"}},
        {"field": {"Name": "high_c"}},
        {"field": {"Name": "low_c"}},
        {"field": {"Name": "precipitation_c"}},
        {"field": {"Name": "humidity_c"}},
        {"field": {"Name": "wind_speed_c"}},
        {"field": {"Name": "current_c"}}
      ],
      where: [{
        "FieldName": "current_c",
        "Operator": "EqualTo",
        "Values": [true]
      }],
      pagingInfo: {
        "limit": 1,
        "offset": 0
      }
    });

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    const todayResponse = await apperClient.fetchRecords('weather_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "condition_c"}},
        {"field": {"Name": "high_c"}},
        {"field": {"Name": "low_c"}},
        {"field": {"Name": "precipitation_c"}},
        {"field": {"Name": "humidity_c"}},
        {"field": {"Name": "wind_speed_c"}},
        {"field": {"Name": "current_c"}}
      ],
      orderBy: [{
        "fieldName": "date_c",
        "sorttype": "DESC"
      }],
      pagingInfo: {
        "limit": 1,
        "offset": 0
      }
    });

    if (!todayResponse.success) {
      return null;
    }

    return todayResponse.data?.[0] || null;
  },

  getForecast: async (days = 5) => {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('weather_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "date_c"}},
        {"field": {"Name": "condition_c"}},
        {"field": {"Name": "high_c"}},
        {"field": {"Name": "low_c"}},
        {"field": {"Name": "precipitation_c"}},
        {"field": {"Name": "humidity_c"}},
        {"field": {"Name": "wind_speed_c"}},
        {"field": {"Name": "current_c"}}
      ],
      orderBy: [{
        "fieldName": "date_c",
        "sorttype": "ASC"
      }],
      pagingInfo: {
        "limit": days,
        "offset": 0
      }
    });

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  }
};

export default weatherService;