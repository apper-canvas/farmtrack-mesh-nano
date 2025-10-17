import React from "react";
import { isValid, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

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

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid date';
  const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
  if (!isValid(date)) return 'Invalid date';
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const WeatherCard = ({ weather, isToday = false }) => {
  return (
    <Card className={`p-4 text-center ${isToday ? 'ring-2 ring-primary' : ''}`}>
      <p className="text-sm text-gray-600 mb-2">
        {isToday ? 'Today' : formatDate(weather.date)}
      </p>
      <div className="mb-3">
        <ApperIcon 
          name={getWeatherIcon(weather.condition)} 
          size={isToday ? 48 : 32} 
          className="text-accent mx-auto" 
        />
      </div>
      <div className="space-y-1">
        <p className={`font-bold text-gray-900 ${isToday ? 'text-xl' : 'text-lg'}`}>
          {weather.high}°
        </p>
        <p className="text-sm text-gray-500">{weather.low}°</p>
        {weather.precipitation && (
          <p className="text-xs text-blue-600 flex items-center justify-center">
            <ApperIcon name="Droplets" size={12} className="mr-1" />
            {weather.precipitation}%
          </p>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-2 capitalize">
        {weather.condition}
      </p>
    </Card>
  );
};

export default WeatherCard;