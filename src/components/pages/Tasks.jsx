import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import { format, isToday, isBefore } from "date-fns";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    farmId: "",
    cropId: "",
    dueDate: "",
    priority: "medium"
  });

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        farmId: task.farmId || "",
        cropId: task.cropId || "",
        dueDate: task.dueDate,
        priority: task.priority
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        farmId: "",
        cropId: "",
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: "medium"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const taskData = {
        ...formData,
        farmId: formData.farmId || null,
        cropId: formData.cropId || null
      };

      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
        toast.success("Task updated successfully");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully");
      }
      
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const getTasksByStatus = () => {
    const now = new Date();
    
    return {
      upcoming: tasks.filter(task => 
        !task.completed && !isToday(new Date(task.dueDate)) && !isBefore(new Date(task.dueDate), now)
      ),
      today: tasks.filter(task => 
        !task.completed && isToday(new Date(task.dueDate))
      ),
      overdue: tasks.filter(task => 
        !task.completed && isBefore(new Date(task.dueDate), now) && !isToday(new Date(task.dueDate))
      ),
      completed: tasks.filter(task => task.completed)
    };
  };

  const taskGroups = getTasksByStatus();
  const farmCrops = crops.filter(crop => crop.farmId === formData.farmId);

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: taskGroups.upcoming.length, icon: "Calendar" },
    { id: "today", label: "Today", count: taskGroups.today.length, icon: "Clock" },
    { id: "overdue", label: "Overdue", count: taskGroups.overdue.length, icon: "AlertTriangle" },
    { id: "completed", label: "Completed", count: taskGroups.completed.length, icon: "CheckCircle2" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">
            Stay on top of your farm tasks and deadlines
          </p>
        </div>
        <Button onClick={() => openModal()} variant="primary">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Create Task
        </Button>
      </div>

      {/* Task Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Task Lists */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {taskGroups[activeTab].length === 0 ? (
            <Empty
              title={`No ${activeTab} tasks`}
              description={
                activeTab === "upcoming" ? "All caught up! No upcoming tasks scheduled." :
                activeTab === "today" ? "No tasks due today. Great job staying on track!" :
                activeTab === "overdue" ? "No overdue tasks. Excellent work!" :
                "No completed tasks yet. Keep working on your tasks!"
              }
              actionLabel="Create Task"
              onAction={() => openModal()}
              icon="CheckSquare"
            />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {taskGroups[activeTab].map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={openModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
              className="w-full rounded-button border-2 border-gray-200 bg-white px-3 py-2.5 text-base transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Farm (Optional)"
              value={formData.farmId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, farmId: e.target.value, cropId: "" }));
              }}
            >
              <option value="">Select a farm</option>
              {farms.map(farm => (
                <option key={farm.Id} value={farm.Id.toString()}>{farm.name}</option>
              ))}
            </Select>

            <Select
              label="Crop (Optional)"
              value={formData.cropId}
              onChange={(e) => setFormData(prev => ({ ...prev, cropId: e.target.value }))}
              disabled={!formData.farmId}
            >
              <option value="">Select a crop</option>
              {farmCrops.map(crop => (
                <option key={crop.Id} value={crop.Id.toString()}>
                  {crop.cropName} - {crop.variety}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;