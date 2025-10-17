import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  className = "" 
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;