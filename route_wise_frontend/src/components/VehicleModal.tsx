import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getAllVehicleTypes, getAllEmployees } from '@/api/vehicle';
import { toast } from 'react-hot-toast';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => void;
  vehicle?: any;
  mode: 'create' | 'edit';
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle,
  mode
}) => {
  const { user } = useAuth();
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleTypeId: '',
    assignedDriverId: ''
  });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [typesData, employeesData] = await Promise.all([
          getAllVehicleTypes(),
          getAllEmployees()
        ]);
        setVehicleTypes(typesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
        toast.error('Failed to load form data');
      }
    };

    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  // Initialize form data when vehicle prop changes
  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData({
        licensePlate: vehicle.licensePlate || '',
        vehicleTypeId: vehicle.vehicleTypeId?.toString() || '',
        assignedDriverId: vehicle.assignedDriverId?.toString() || 'unassigned'
      });
    } else {
      setFormData({
        licensePlate: '',
        vehicleTypeId: '',
        assignedDriverId: 'unassigned'
      });
    }
  }, [vehicle, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.licensePlate.trim()) {
      toast.error('License plate is required');
      return;
    }
    
    if (!formData.vehicleTypeId) {
      toast.error('Vehicle type is required');
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        ...formData,
        vehicleTypeId: parseInt(formData.vehicleTypeId),
        assignedDriverId: formData.assignedDriverId && formData.assignedDriverId !== 'unassigned' 
          ? parseInt(formData.assignedDriverId) 
          : null
      };

      await onSave(vehicleData);
      onClose();
      toast.success(`Vehicle ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (error: any) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} vehicle:`, error);
      toast.error(error.message || `Failed to ${mode} vehicle`);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to create/edit vehicles
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  if (!canModify) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Create a new vehicle entry' : 'Modify vehicle information'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="licensePlate">License Plate *</Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
              placeholder="Enter license plate"
              required
            />
          </div>

          <div>
            <Label htmlFor="vehicleTypeId">Vehicle Type *</Label>
            <Select
              value={formData.vehicleTypeId}
              onValueChange={(value) => handleInputChange('vehicleTypeId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.vehicleTypeId} value={type.vehicleTypeId.toString()}>
                    {type.vehicleTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignedDriverId">Assigned Driver (Optional)</Label>
            <Select
              value={formData.assignedDriverId}
              onValueChange={(value) => handleInputChange('assignedDriverId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">No driver assigned</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.employeeId} value={employee.employeeId.toString()}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Vehicle' : 'Update Vehicle')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal; 