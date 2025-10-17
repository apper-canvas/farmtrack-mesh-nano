import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalArea: "",
    unit: "acres",
    notes: ""
  });

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load farms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (farm = null) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData({
        name: farm.name,
        location: farm.location,
        totalArea: farm.totalArea.toString(),
        unit: farm.unit,
        notes: farm.notes || ""
      });
    } else {
      setEditingFarm(null);
      setFormData({
        name: "",
        location: "",
        totalArea: "",
        unit: "acres",
        notes: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
    setFormData({
      name: "",
      location: "",
      totalArea: "",
      unit: "acres",
      notes: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim() || !formData.totalArea) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const farmData = {
        ...formData,
        totalArea: parseFloat(formData.totalArea)
      };

      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, farmData);
        setFarms(prev => prev.map(f => f.Id === editingFarm.Id ? updatedFarm : f));
        toast.success("Farm updated successfully");
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms(prev => [...prev, newFarm]);
        toast.success("Farm created successfully");
      }
      
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${editingFarm ? 'update' : 'create'} farm`);
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm? This action cannot be undone.")) {
      try {
        await farmService.delete(farmId);
        setFarms(prev => prev.filter(f => f.Id !== farmId));
        toast.success("Farm deleted successfully");
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const getFarmCropCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId.toString()).length;
  };

  const getActiveCropCount = (farmId) => {
    return crops.filter(crop => 
      crop.farmId === farmId.toString() && 
      (crop.status === 'growing' || crop.status === 'flowering')
    ).length;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (farms.length === 0) {
    return (
      <Empty
        title="No farms yet"
        description="Start by adding your first farm to begin tracking your agricultural operations."
        actionLabel="Add Farm"
        onAction={() => openModal()}
        icon="MapPin"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your farms and track their progress
          </p>
        </div>
        <Button onClick={() => openModal()} variant="primary">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <Card key={farm.Id} className="p-6 hover" onClick={() => openModal(farm)}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <ApperIcon name="MapPin" size={14} className="mr-1" />
                    {farm.location}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(farm);
                    }}
                    className="p-2"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(farm.Id);
                    }}
                    className="p-2 text-error hover:text-error hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Area</span>
                  <span className="font-medium">{farm.totalArea} {farm.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Crops</span>
                  <span className="font-medium">{getFarmCropCount(farm.Id)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Crops</span>
                  <span className="font-medium text-success">{getActiveCropCount(farm.Id)}</span>
                </div>
              </div>

              {farm.notes && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{farm.notes}</p>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(farm.createdAt).toLocaleDateString()}
                  </span>
                  <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Farm Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter farm name"
            required
          />

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter farm location"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Area"
              type="number"
              value={formData.totalArea}
              onChange={(e) => setFormData(prev => ({ ...prev, totalArea: e.target.value }))}
              placeholder="0"
              min="0"
              step="0.1"
              required
            />

            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="square feet">Square Feet</option>
              <option value="square meters">Square Meters</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about this farm"
              rows={3}
              className="w-full rounded-button border-2 border-gray-200 bg-white px-3 py-2.5 text-base transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingFarm ? "Update Farm" : "Create Farm"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Farms;