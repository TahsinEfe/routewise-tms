
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  User,
  Fuel,
  Settings,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, getAllVehicleTypes, getAllEmployees } from '@/api/vehicle';
import VehicleModal from '@/components/VehicleModal';
import { toast } from 'react-hot-toast';

const Vehicles = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesData, typesData, employeesData] = await Promise.all([
        getAllVehicles(),
        getAllVehicleTypes(),
        getAllEmployees()
      ]);
      setVehicles(vehiclesData);
      setVehicleTypes(typesData);
      setEmployees(employeesData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load vehicles data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateVehicle = async (vehicleData: any) => {
    try {
      await createVehicle(vehicleData);
      await loadData(); // Refresh data
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleUpdateVehicle = async (vehicleData: any) => {
    try {
      await updateVehicle(selectedVehicle.vehicleId, vehicleData);
      await loadData(); // Refresh data
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
        await loadData(); // Refresh data
        toast.success('Vehicle deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedVehicle(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Helper functions
  const getVehicleTypeName = (vehicleTypeId: number) => {
    const type = vehicleTypes.find(t => t.vehicleTypeId === vehicleTypeId);
    return type?.vehicleTypeName || 'Unknown';
  };

  const getDriverName = (assignedDriverId: number) => {
    if (!assignedDriverId) return 'Unassigned';
    const driver = employees.find(e => e.employeeId === assignedDriverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Unknown Driver';
  };

  const getVehicleStatus = (vehicle: any) => {
    if (vehicle.assignedDriverId) return 'Active';
    return 'Available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      case 'Available':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleTypeName(vehicle.vehicleTypeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDriverName(vehicle.assignedDriverId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check permissions
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  // Calculate statistics
  const activeVehicles = vehicles.filter(v => v.assignedDriverId).length;
  const availableVehicles = vehicles.filter(v => !v.assignedDriverId).length;
  const totalVehicles = vehicles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your vehicle fleet</p>
        </div>
        {canModify && (
          <Button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle Types</p>
                <p className="text-2xl font-bold">{vehicleTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fleet</p>
                <p className="text-2xl font-bold">{totalVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles by ID, model, or driver..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading vehicles...</div>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-8">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No vehicles match your search criteria.' : 'Get started by adding your first vehicle.'}
          </p>
          {canModify && !searchTerm && (
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle) => {
            const status = getVehicleStatus(vehicle);
            const driverName = getDriverName(vehicle.assignedDriverId);
            const vehicleTypeName = getVehicleTypeName(vehicle.vehicleTypeId);
            
            return (
              <Card key={vehicle.vehicleId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.licensePlate}</h3>
                        <p className="text-gray-600">{vehicleTypeName}</p>
                        <p className="text-sm text-gray-500">ID: {vehicle.vehicleId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                      {canModify && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(vehicle)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Driver:</span>
                      <span>{driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Type:</span>
                      <span>{vehicleTypeName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Track Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={modalMode === 'create' ? handleCreateVehicle : handleUpdateVehicle}
        vehicle={selectedVehicle}
        mode={modalMode}
      />
    </div>
  );
};

export default Vehicles;
