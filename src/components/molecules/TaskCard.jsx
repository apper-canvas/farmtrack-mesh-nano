import React from "react";
import { motion } from "framer-motion";
import { format, isValid, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  if (!task) return null;
  
  const getPriorityBadge = (priority) => {
    const variants = {
      high: { variant: "error", icon: "AlertTriangle" },
      medium: { variant: "warning", icon: "AlertCircle" },
      low: { variant: "info", icon: "Info" }
    };
    return variants[priority] || variants.low;
  };
  
  const parsedDueDate = task.dueDate ? (typeof task.dueDate === 'string' ? parseISO(task.dueDate) : new Date(task.dueDate)) : null;
  const isValidDueDate = parsedDueDate && isValid(parsedDueDate);
  
  const isOverdue = isValidDueDate && parsedDueDate < new Date() && !task.completed;
  const isToday = isValidDueDate && format(parsedDueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
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
            <div className="flex items-center text-gray-600">
              <ApperIcon name="Calendar" size={16} className="mr-1" />
              {isValidDueDate ? format(parsedDueDate, 'MMM d, yyyy') : 'Invalid date'}
              {isOverdue && <span className="ml-1 text-error">(Overdue)</span>}
              {isToday && !isOverdue && <span className="ml-1 text-warning">(Today)</span>}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleComplete(task.id)}
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
                onClick={() => onDelete(task.id)}
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