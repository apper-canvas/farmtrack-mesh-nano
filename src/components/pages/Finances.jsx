import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import expenseService from "@/services/api/expenseService";
import incomeService from "@/services/api/incomeService";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const Finances = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  
  const [expenseForm, setExpenseForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: "",
    amount: "",
    description: "",
    farmId: ""
  });
  
  const [incomeForm, setIncomeForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    cropId: "",
    quantity: "",
    pricePerUnit: "",
    buyer: ""
  });

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [expensesData, incomeData, farmsData, cropsData] = await Promise.all([
        expenseService.getAll(),
        incomeService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setExpenses(expensesData);
      setIncome(incomeData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load financial data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openExpenseModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseForm({
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description,
        farmId: expense.farmId || ""
      });
    } else {
      setEditingExpense(null);
      setExpenseForm({
        date: format(new Date(), 'yyyy-MM-dd'),
        category: "",
        amount: "",
        description: "",
        farmId: ""
      });
    }
    setIsExpenseModalOpen(true);
  };

  const openIncomeModal = (incomeItem = null) => {
    if (incomeItem) {
      setEditingIncome(incomeItem);
      setIncomeForm({
        date: incomeItem.date,
        cropId: incomeItem.cropId,
        quantity: incomeItem.quantity.toString(),
        pricePerUnit: incomeItem.pricePerUnit.toString(),
        buyer: incomeItem.buyer
      });
    } else {
      setEditingIncome(null);
      setIncomeForm({
        date: format(new Date(), 'yyyy-MM-dd'),
        cropId: "",
        quantity: "",
        pricePerUnit: "",
        buyer: ""
      });
    }
    setIsIncomeModalOpen(true);
  };

  const closeModals = () => {
    setIsExpenseModalOpen(false);
    setIsIncomeModalOpen(false);
    setEditingExpense(null);
    setEditingIncome(null);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    
    if (!expenseForm.category || !expenseForm.amount || !expenseForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const expenseData = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        farmId: expenseForm.farmId || null
      };

      if (editingExpense) {
        const updatedExpense = await expenseService.update(editingExpense.Id, expenseData);
        setExpenses(prev => prev.map(e => e.Id === editingExpense.Id ? updatedExpense : e));
        toast.success("Expense updated successfully");
      } else {
        const newExpense = await expenseService.create(expenseData);
        setExpenses(prev => [...prev, newExpense]);
        toast.success("Expense recorded successfully");
      }
      
      closeModals();
    } catch (err) {
      toast.error(`Failed to ${editingExpense ? 'update' : 'record'} expense`);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    
    if (!incomeForm.cropId || !incomeForm.quantity || !incomeForm.pricePerUnit) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const incomeData = {
        ...incomeForm,
        quantity: parseFloat(incomeForm.quantity),
        pricePerUnit: parseFloat(incomeForm.pricePerUnit)
      };

      if (editingIncome) {
        const updatedIncome = await incomeService.update(editingIncome.Id, incomeData);
        setIncome(prev => prev.map(i => i.Id === editingIncome.Id ? updatedIncome : i));
        toast.success("Income updated successfully");
      } else {
        const newIncome = await incomeService.create(incomeData);
        setIncome(prev => [...prev, newIncome]);
        toast.success("Income recorded successfully");
      }
      
      closeModals();
    } catch (err) {
      toast.error(`Failed to ${editingIncome ? 'update' : 'record'} income`);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.delete(expenseId);
        setExpenses(prev => prev.filter(e => e.Id !== expenseId));
        toast.success("Expense deleted successfully");
      } catch (err) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      try {
        await incomeService.delete(incomeId);
        setIncome(prev => prev.filter(i => i.Id !== incomeId));
        toast.success("Income record deleted successfully");
      } catch (err) {
        toast.error("Failed to delete income record");
}
    }
  };

  const handleExportCSV = () => {
    try {
      // Combine expenses and income into unified dataset
      const combinedData = [
        ...expenses.map(expense => ({
          type: 'Expense',
          date: format(new Date(expense.date), 'yyyy-MM-dd'),
          category: expense.category,
          description: expense.description,
          amount: expense.amount,
          farm: farms.find(f => f.Id === expense.farmId)?.name || '',
          crop: ''
        })),
        ...income.map(inc => ({
type: 'Income',
          date: format(new Date(inc.date), 'yyyy-MM-dd'),
          category: 'Harvest',
          description: `${inc.quantity} units @ $${inc.pricePerUnit}/unit`,
          amount: inc.quantity * inc.pricePerUnit,
          farm: farms.find(f => f.Id === inc.farmId)?.name || '',
          crop: crops.find(c => c.Id === inc.cropId)?.name || ''
        }))
      ];

      // Create CSV content with headers
      const headers = ['Type', 'Date', 'Category', 'Description', 'Amount', 'Farm', 'Crop'];
      const csvContent = [
        headers.join(','),
        ...combinedData.map(row => 
          [row.type, row.date, row.category, row.description, row.amount, row.farm, row.crop]
            .map(field => `"${String(field).replace(/"/g, '""')}"`)
            .join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `farmtrack-finances-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Financial data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id.toString() === farmId);
    return farm ? farm.name : "General";
  };

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id.toString() === cropId);
    return crop ? `${crop.cropName} - ${crop.variety}` : "Unknown Crop";
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.totalAmount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Chart data
  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false }
    },
    colors: ['#059669', '#DC2626'],
    stroke: { width: 3, curve: 'smooth' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#6B7280' } }
    },
    yaxis: {
      labels: { 
        style: { colors: '#6B7280' },
        formatter: (value) => `$${value.toFixed(0)}`
      }
    },
    grid: { borderColor: '#E5E7EB' },
    legend: { position: 'top', horizontalAlign: 'right' }
  };

  const chartSeries = [
    { name: 'Income', data: [2100, 1850, 2200, 1900, 2300, 2100] },
    { name: 'Expenses', data: [1200, 1400, 1100, 1600, 1300, 1500] }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "BarChart3" },
    { id: "expenses", label: "Expenses", icon: "TrendingDown" },
    { id: "income", label: "Income", icon: "TrendingUp" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">
            Track your farm expenses and income to monitor profitability
</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleExportCSV} variant="secondary">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openExpenseModal()} variant="outline">
            <ApperIcon name="Minus" size={16} className="mr-2" />
            Add Expense
          </Button>
          <Button onClick={() => openIncomeModal()} variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          change={`${income.length} transactions`}
          changeType="positive"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          change={`${expenses.length} transactions`}
          changeType="neutral"
        />
        <StatCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          change={netProfit >= 0 ? "Profitable" : "Loss"}
          changeType={netProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Income vs Expenses Trend
              </h3>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={300}
              />
            </Card>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Expenses
                </h3>
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.Id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {expense.category} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className="font-semibold text-error">
                      -${expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Income
                </h3>
                {income.slice(0, 5).map((incomeItem) => (
                  <div key={incomeItem.Id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{getCropName(incomeItem.cropId)}</p>
                      <p className="text-sm text-gray-600">
                        {incomeItem.quantity} units • {format(new Date(incomeItem.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className="font-semibold text-success">
                      +${incomeItem.totalAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "expenses" && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {expenses.length === 0 ? (
              <Empty
                title="No expenses recorded"
                description="Start tracking your farm expenses to monitor costs and improve profitability."
                actionLabel="Add Expense"
                onAction={() => openExpenseModal()}
                icon="TrendingDown"
              />
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <Card key={expense.Id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {expense.description}
                          </h3>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {expense.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                          </span>
                          {expense.farmId && (
                            <span className="flex items-center">
                              <ApperIcon name="MapPin" size={14} className="mr-1" />
                              {getFarmName(expense.farmId)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-error">
                          ${expense.amount.toLocaleString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => openExpenseModal(expense)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleDeleteExpense(expense.Id)}
                            className="p-2 text-error hover:text-error hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "income" && (
          <motion.div
            key="income"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {income.length === 0 ? (
              <Empty
                title="No income recorded"
                description="Start recording your crop sales and other farm income to track revenue."
                actionLabel="Add Income"
                onAction={() => openIncomeModal()}
                icon="TrendingUp"
              />
            ) : (
              <div className="space-y-4">
                {income.map((incomeItem) => (
                  <Card key={incomeItem.Id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getCropName(incomeItem.cropId)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            {format(new Date(incomeItem.date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Package" size={14} className="mr-1" />
                            {incomeItem.quantity} units
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="DollarSign" size={14} className="mr-1" />
                            ${incomeItem.pricePerUnit}/unit
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Buyer: {incomeItem.buyer}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-success">
                          ${incomeItem.totalAmount.toLocaleString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => openIncomeModal(incomeItem)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleDeleteIncome(incomeItem.Id)}
                            className="p-2 text-error hover:text-error hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={closeModals}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        size="default"
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="">Select category</option>
              <option value="Seeds">Seeds</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Pesticides">Pesticides</option>
              <option value="Equipment">Equipment</option>
              <option value="Labor">Labor</option>
              <option value="Utilities">Utilities</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </Select>

            <Input
              label="Amount ($)"
              type="number"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <Select
            label="Farm (Optional)"
            value={expenseForm.farmId}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, farmId: e.target.value }))}
          >
            <option value="">General expense</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id.toString()}>{farm.name}</option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={expenseForm.description}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter expense description"
              rows={3}
              required
              className="w-full rounded-button border-2 border-gray-200 bg-white px-3 py-2.5 text-base transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={closeModals}
        title={editingIncome ? "Edit Income" : "Add Income"}
        size="default"
      >
        <form onSubmit={handleIncomeSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={incomeForm.date}
            onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <Select
            label="Crop"
            value={incomeForm.cropId}
            onChange={(e) => setIncomeForm(prev => ({ ...prev, cropId: e.target.value }))}
            required
          >
            <option value="">Select crop</option>
            {crops.map(crop => (
              <option key={crop.Id} value={crop.Id.toString()}>
                {crop.cropName} - {crop.variety}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity Sold"
              type="number"
              value={incomeForm.quantity}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="0"
              min="0"
              step="0.1"
              required
            />

            <Input
              label="Price per Unit ($)"
              type="number"
              value={incomeForm.pricePerUnit}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, pricePerUnit: e.target.value }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {incomeForm.quantity && incomeForm.pricePerUnit && (
            <div className="bg-gray-50 rounded-button p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-success">
                  ${(parseFloat(incomeForm.quantity || 0) * parseFloat(incomeForm.pricePerUnit || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Buyer"
            value={incomeForm.buyer}
            onChange={(e) => setIncomeForm(prev => ({ ...prev, buyer: e.target.value }))}
            placeholder="Enter buyer name"
            required
          />

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingIncome ? "Update Income" : "Add Income"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Finances;