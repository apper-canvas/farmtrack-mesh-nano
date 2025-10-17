import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [filterFarm, setFilterFarm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    farmId: "",
    cropName: "",
    variety: "",
    plantingDate: "",
    expectedHarvestDate: "",
    areaPlanted: "",
    status: "growing",
    notes: ""
  });

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (crop = null) => {
    if (crop) {
      setEditingCrop(crop);
      setFormData({
        farmId: crop.farmId,
        cropName: crop.cropName,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        areaPlanted: crop.areaPlanted.toString(),
        status: crop.status,
        notes: crop.notes || ""
      });
    } else {
      setEditingCrop(null);
      setFormData({
        farmId: "",
        cropName: "",
        variety: "",
        plantingDate: "",
        expectedHarvestDate: "",
        areaPlanted: "",
        status: "growing",
        notes: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCrop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.cropName || !formData.variety || !formData.plantingDate || !formData.areaPlanted) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const cropData = {
        ...formData,
        areaPlanted: parseFloat(formData.areaPlanted)
      };

      if (editingCrop) {
        const updatedCrop = await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(c => c.Id === editingCrop.Id ? updatedCrop : c));
        toast.success("Crop updated successfully");
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops(prev => [...prev, newCrop]);
        toast.success("Crop logged successfully");
      }
      
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${editingCrop ? 'update' : 'log'} crop`);
    }
  };

  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      try {
        await cropService.delete(cropId);
        setCrops(prev => prev.filter(c => c.Id !== cropId));
        toast.success("Crop deleted successfully");
      } catch (err) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      growing: { variant: "success", label: "Growing" },
      flowering: { variant: "warning", label: "Flowering" },
      harvested: { variant: "info", label: "Harvested" },
      failed: { variant: "error", label: "Failed" }
    };
    return variants[status] || { variant: "default", label: status };
  };

  const getDaysToHarvest = (harvestDate) => {
    const days = differenceInDays(new Date(harvestDate), new Date());
    if (days < 0) return "Past due";
    if (days === 0) return "Today";
    return `${days} days`;
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id.toString() === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const filteredCrops = crops.filter(crop => {
    const matchesFarm = !filterFarm || crop.farmId === filterFarm;
    const matchesStatus = !filterStatus || crop.status === filterStatus;
    return matchesFarm && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600 mt-1">
            Track your crops from planting to harvest
          </p>
        </div>
        <Button onClick={() => openModal()} variant="primary">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Log Crop
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          className="w-full sm:w-auto"
        >
          <option value="">All Farms</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id.toString()}>{farm.name}</option>
          ))}
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="growing">Growing</option>
          <option value="flowering">Flowering</option>
          <option value="harvested">Harvested</option>
          <option value="failed">Failed</option>
        </Select>

        {(filterFarm || filterStatus) && (
          <Button
            variant="outline"
            onClick={() => {
              setFilterFarm("");
              setFilterStatus("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Crops List */}
      {filteredCrops.length === 0 ? (
        <Empty
          title="No crops found"
          description={crops.length === 0 
            ? "Start by logging your first crop to begin tracking your agricultural production."
            : "No crops match your current filters. Try adjusting your search criteria."
          }
          actionLabel="Log Crop"
          onAction={() => openModal()}
          icon="Sprout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.Id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{crop.cropName}</h3>
                    <p className="text-sm text-gray-600">{crop.variety}</p>
                  </div>
                  <Badge {...getStatusBadge(crop.status)}>
                    {getStatusBadge(crop.status).label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={14} className="mr-2" />
                    {getFarmName(crop.farmId)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Calendar" size={14} className="mr-2" />
                    Planted: {format(new Date(crop.plantingDate), 'MMM d, yyyy')}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Harvest" size={14} className="mr-2" />
                    Area: {crop.areaPlanted} acres
                  </div>
                </div>

                {crop.expectedHarvestDate && crop.status !== 'harvested' && (
                  <div className="bg-gray-50 rounded-button p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Harvest in:</span>
                      <span className="font-medium text-gray-900">
                        {getDaysToHarvest(crop.expectedHarvestDate)}
                      </span>
                    </div>
                  </div>
                )}

                {crop.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{crop.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => openModal(crop)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit2" size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDelete(crop.Id)}
                    className="text-error hover:text-error hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Crop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCrop ? "Edit Crop" : "Log New Crop"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Farm"
            value={formData.farmId}
            onChange={(e) => setFormData(prev => ({ ...prev, farmId: e.target.value }))}
            required
          >
            <option value="">Select a farm</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id.toString()}>{farm.name}</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Crop Name"
              value={formData.cropName}
              onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
              placeholder="e.g., Corn, Tomatoes"
              required
            />

            <Input
              label="Variety"
              value={formData.variety}
              onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
              placeholder="e.g., Sweet Corn"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Planting Date"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, plantingDate: e.target.value }))}
              required
            />

            <Input
              label="Expected Harvest"
              type="date"
              value={formData.expectedHarvestDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedHarvestDate: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Area Planted (acres)"
              type="number"
              value={formData.areaPlanted}
              onChange={(e) => setFormData(prev => ({ ...prev, areaPlanted: e.target.value }))}
              placeholder="0"
              min="0"
              step="0.1"
              required
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="growing">Growing</option>
              <option value="flowering">Flowering</option>
              <option value="harvested">Harvested</option>
              <option value="failed">Failed</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about this crop"
              rows={3}
              className="w-full rounded-button border-2 border-gray-200 bg-white px-3 py-2.5 text-base transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingCrop ? "Update Crop" : "Log Crop"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Crops;