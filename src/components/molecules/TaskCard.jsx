import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityBadge = (priority) => {
    const variants = {
      high: { variant: "error", icon: "AlertTriangle" },
      medium: { variant: "warning", icon: "AlertCircle" },
      low: { variant: "info", icon: "Info" }
    };
    return variants[priority] || variants.low;
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isToday = format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-4 ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-l-4 border-error' : ''}`}
        hover={!task.completed}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge variant={priorityBadge.variant}>
                <ApperIcon name={priorityBadge.icon} size={12} className="mr-1" />
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              <span className={isOverdue ? 'text-error font-medium' : isToday ? 'text-warning font-medium' : ''}>
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
              {isOverdue && <span className="ml-1 text-error">(Overdue)</span>}
              {isToday && !isOverdue && <span className="ml-1 text-warning">(Today)</span>}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleComplete(task.Id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ApperIcon 
                  name={task.completed ? "CheckCircle2" : "Circle"} 
                  size={16} 
                  className={task.completed ? "text-success" : "text-gray-400"}
                />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(task.Id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-error" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;