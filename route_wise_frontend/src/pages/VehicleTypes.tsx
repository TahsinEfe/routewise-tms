import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Car, 
  Search, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType } from '@/api/vehicleType';
import { toast } from 'react-hot-toast';
import VehicleTypeModal from '@/components/VehicleTypeModal';

const VehicleTypes = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllVehicleTypes();
      setVehicleTypes(data);
    } catch (error: any) {
      console.error('Error loading vehicle types:', error);
      toast.error('Failed to load vehicle types');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateVehicleType = async (vehicleTypeData: any) => {
    try {
      await createVehicleType(vehicleTypeData);
      await loadData(); // Refresh data
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleUpdateVehicleType = async (vehicleTypeData: any) => {
    try {
      await updateVehicleType(selectedVehicleType.vehicleTypeId, vehicleTypeData);
      await loadData(); // Refresh data
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteVehicleType = async (vehicleTypeId: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle type?')) {
      try {
        await deleteVehicleType(vehicleTypeId);
        await loadData(); // Refresh data
        toast.success('Vehicle type deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting vehicle type:', error);
        toast.error('Failed to delete vehicle type');
      }
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedVehicleType(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (vehicleType: any) => {
    setSelectedVehicleType(vehicleType);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Filter vehicle types based on search term
  const filteredVehicleTypes = vehicleTypes.filter(type =>
    type.vehicleTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check permissions
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-gray-600 mt-2">Manage different types of vehicles in your fleet</p>
        </div>
        {canModify && (
          <Button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle Type
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Car className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(vehicleTypes.map(t => t.vehicleTypeName.split(' ')[0])).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Types Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading vehicle types...</div>
        </div>
      ) : filteredVehicleTypes.length === 0 ? (
        <div className="text-center py-8">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicle types found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No vehicle types match your search criteria.' : 'Get started by adding your first vehicle type.'}
          </p>
          {canModify && !searchTerm && (
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle Type
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicleTypes.map((vehicleType) => (
            <Card key={vehicleType.vehicleTypeId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{vehicleType.vehicleTypeName}</h3>
                      <p className="text-sm text-gray-500">ID: {vehicleType.vehicleTypeId}</p>
                    </div>
                  </div>
                  {canModify && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(vehicleType)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteVehicleType(vehicleType.vehicleTypeId)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                    <p className="text-sm">{vehicleType.description || 'No description available'}</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vehicle Type Modal */}
      <VehicleTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={modalMode === 'create' ? handleCreateVehicleType : handleUpdateVehicleType}
        vehicleType={selectedVehicleType}
        mode={modalMode}
      />
    </div>
  );
};

export default VehicleTypes; 