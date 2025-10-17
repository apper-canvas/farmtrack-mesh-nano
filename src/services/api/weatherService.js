import weatherData from "@/services/mockData/weather.json";

const weatherService = {
  getCurrentWeather: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const today = weatherData[0];
    return {
      ...today,
      current: true
    };
  },

  getForecast: async (days = 5) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return weatherData.slice(0, days).map(day => ({ ...day }));
  }
};

export default weatherService;