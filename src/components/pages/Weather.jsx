import React, { useState, useEffect } from "react";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(5)
      ]);
      
      setCurrentWeather(current);
      setForecast(forecastData);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      foggy: "CloudFog"
    };
    return iconMap[condition] || "Sun";
  };

  const getWeatherAdvice = (weather) => {
    if (!weather) return [];

    const advice = [];
    
    if (weather.condition === 'rainy' && weather.precipitation > 60) {
      advice.push({
        icon: "CloudRain",
        text: "Heavy rain expected - postpone outdoor planting and harvesting",
        type: "warning"
      });
    }
    
    if (weather.high > 85) {
      advice.push({
        icon: "Thermometer",
        text: "High temperatures - ensure adequate irrigation for crops",
        type: "info"
      });
    }
    
    if (weather.low < 40) {
      advice.push({
        icon: "Snowflake",
        text: "Cold night ahead - protect sensitive plants from frost",
        type: "warning"
      });
    }
    
    if (weather.windSpeed > 20) {
      advice.push({
        icon: "Wind",
        text: "Strong winds - secure equipment and check plant supports",
        type: "warning"
      });
    }
    
    if (weather.humidity < 30) {
      advice.push({
        icon: "Droplets",
        text: "Low humidity - increase watering frequency",
        type: "info"
      });
    }

    if (advice.length === 0) {
      advice.push({
        icon: "CheckCircle",
        text: "Great weather conditions for most farm activities",
        type: "success"
      });
    }
    
    return advice;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;

  const weatherAdvice = getWeatherAdvice(currentWeather);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
        <p className="text-gray-600 mt-1">
          Stay informed about weather conditions to plan your farm activities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Weather */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ApperIcon name="CloudSun" size={20} className="mr-2 text-accent" />
              Current Weather
            </h2>
            
            {currentWeather && (
              <div className="text-center">
                <div className="mb-6">
                  <ApperIcon 
                    name={getWeatherIcon(currentWeather.condition)} 
                    size={80} 
                    className="text-accent mx-auto mb-4" 
                  />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentWeather.high}°F
                  </h3>
                  <p className="text-lg text-gray-600 capitalize">
                    {currentWeather.condition}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-button p-3">
                    <div className="flex items-center justify-center mb-1">
                      <ApperIcon name="Thermometer" size={16} className="text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">{currentWeather.low}°F</p>
                    <p className="text-gray-600">Low</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-button p-3">
                    <div className="flex items-center justify-center mb-1">
                      <ApperIcon name="Droplets" size={16} className="text-blue-500" />
                    </div>
                    <p className="font-medium text-gray-900">{currentWeather.humidity}%</p>
                    <p className="text-gray-600">Humidity</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-button p-3">
                    <div className="flex items-center justify-center mb-1">
                      <ApperIcon name="Wind" size={16} className="text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">{currentWeather.windSpeed} mph</p>
                    <p className="text-gray-600">Wind</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-button p-3">
                    <div className="flex items-center justify-center mb-1">
                      <ApperIcon name="CloudRain" size={16} className="text-blue-500" />
                    </div>
                    <p className="font-medium text-gray-900">{currentWeather.precipitation}%</p>
                    <p className="text-gray-600">Rain</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Weather Advice */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ApperIcon name="Lightbulb" size={20} className="mr-2 text-accent" />
              Farm Weather Advisory
            </h2>
            
            <div className="space-y-4">
              {weatherAdvice.map((advice, index) => (
                <div 
                  key={index}
                  className={`flex items-start p-4 rounded-button ${
                    advice.type === 'warning' ? 'bg-warning-50 border border-warning-200' :
                    advice.type === 'success' ? 'bg-success-50 border border-green-200' :
                    'bg-info-50 border border-blue-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    advice.type === 'warning' ? 'bg-warning-100' :
                    advice.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <ApperIcon 
                      name={advice.icon} 
                      size={20} 
                      className={
                        advice.type === 'warning' ? 'text-warning-600' :
                        advice.type === 'success' ? 'text-success' :
                        'text-info'
                      } 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{advice.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="Calendar" size={20} className="mr-2 text-primary" />
          5-Day Forecast
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {forecast.map((weather, index) => (
            <WeatherCard 
              key={weather.date} 
              weather={weather} 
              isToday={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Weather Planning Tips */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="BookOpen" size={20} className="mr-2 text-secondary" />
          Weather Planning Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <ApperIcon name="Sun" size={18} className="text-accent mr-2" />
              <h4 className="font-medium text-gray-900">Sunny Days</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ideal for harvesting and field work</li>
              <li>• Perfect for equipment maintenance</li>
              <li>• Good drying conditions for hay</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <ApperIcon name="CloudRain" size={18} className="text-blue-500 mr-2" />
              <h4 className="font-medium text-gray-900">Rainy Days</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Avoid heavy machinery use</li>
              <li>• Good time for planning and paperwork</li>
              <li>• Monitor drainage systems</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <ApperIcon name="Wind" size={18} className="text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Windy Conditions</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Avoid pesticide applications</li>
              <li>• Secure loose equipment and materials</li>
              <li>• Check plant support structures</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Weather;