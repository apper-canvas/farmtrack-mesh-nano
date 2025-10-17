import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskCard from "@/components/molecules/TaskCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import expenseService from "@/services/api/expenseService";
import incomeService from "@/services/api/incomeService";
import weatherService from "@/services/api/weatherService";
import { format, isToday, isBefore } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [farmsData, cropsData, tasksData, expensesData, incomeData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        expenseService.getAll(),
        incomeService.getAll(),
        weatherService.getCurrentWeather()
      ]);

      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
      setExpenses(expensesData);
      setIncome(incomeData);
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      ));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.totalAmount, 0);
  const netProfit = totalIncome - totalExpenses;
  
  const todayTasks = tasks.filter(task => 
    !task.completed && isToday(new Date(task.dueDate))
  );
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && isBefore(new Date(task.dueDate), new Date()) && !isToday(new Date(task.dueDate))
  );
  
  const upcomingTasks = tasks.filter(task => 
    !task.completed && !isToday(new Date(task.dueDate)) && !isBefore(new Date(task.dueDate), new Date())
  ).slice(0, 3);

  const activeCrops = crops.filter(crop => crop.status === 'growing' || crop.status === 'flowering');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Farm Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening on your farms today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Farms"
          value={farms.length}
          icon="MapPin"
          change={`${farms.length} total farms`}
          changeType="neutral"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops.length}
          icon="Sprout"
          change={`${crops.length} total crops`}
          changeType="positive"
        />
        <StatCard
          title="Tasks Due Today"
          value={todayTasks.length}
          icon="CheckSquare"
          change={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "On track"}
          changeType={overdueTasks.length > 0 ? "negative" : "positive"}
        />
        <StatCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          change={netProfit >= 0 ? "Profitable" : "Loss"}
          changeType={netProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Widget */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="CloudSun" size={20} className="mr-2 text-accent" />
              Current Weather
            </h3>
            {weather && (
              <WeatherCard weather={weather} isToday={true} />
            )}
          </Card>
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="CheckSquare" size={20} className="mr-2 text-primary" />
                Today's Tasks
              </h3>
              <span className="text-sm text-gray-500">
                {todayTasks.length} tasks due today
              </span>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="CheckCircle2" size={48} className="mx-auto mb-4 text-success" />
                <p>No tasks due today! Great job!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {todayTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onToggleComplete={handleToggleTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Upcoming Tasks & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Calendar" size={20} className="mr-2 text-secondary" />
            Upcoming Tasks
          </h3>
          
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Calendar" size={48} className="mx-auto mb-4" />
              <p>No upcoming tasks scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-button">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Financial Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="DollarSign" size={20} className="mr-2 text-accent" />
            Financial Summary
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Income</span>
              <span className="text-lg font-semibold text-success">
                ${totalIncome.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="text-lg font-semibold text-error">
                ${totalExpenses.toLocaleString()}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Net Profit</span>
                <span className={`text-xl font-bold ${
                  netProfit >= 0 ? 'text-success' : 'text-error'
                }`}>
                  ${netProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-button p-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Recent Expenses</p>
                  <p className="font-semibold">{expenses.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Income</p>
                  <p className="font-semibold">{income.length}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;