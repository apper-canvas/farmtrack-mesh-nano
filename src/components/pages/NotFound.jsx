import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="p-4 bg-primary-50 rounded-full inline-block mb-6">
            <ApperIcon name="MapPin" size={64} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like this field hasn't been planted yet. The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            variant="primary" 
            className="w-full"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Return to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/farms")}
              className="p-3 text-left hover:bg-gray-50 rounded-button transition-colors"
            >
              <ApperIcon name="MapPin" size={18} className="text-primary mb-1" />
              <p className="text-sm font-medium text-gray-900">Farms</p>
            </button>
            <button
              onClick={() => navigate("/crops")}
              className="p-3 text-left hover:bg-gray-50 rounded-button transition-colors"
            >
              <ApperIcon name="Sprout" size={18} className="text-primary mb-1" />
              <p className="text-sm font-medium text-gray-900">Crops</p>
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="p-3 text-left hover:bg-gray-50 rounded-button transition-colors"
            >
              <ApperIcon name="CheckSquare" size={18} className="text-primary mb-1" />
              <p className="text-sm font-medium text-gray-900">Tasks</p>
            </button>
            <button
              onClick={() => navigate("/weather")}
              className="p-3 text-left hover:bg-gray-50 rounded-button transition-colors"
            >
              <ApperIcon name="CloudSun" size={18} className="text-primary mb-1" />
              <p className="text-sm font-medium text-gray-900">Weather</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;