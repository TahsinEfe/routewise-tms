import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface VehicleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleTypeData: any) => void;
  vehicleType?: any;
  mode: 'create' | 'edit';
}

const VehicleTypeModal: React.FC<VehicleTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicleType,
  mode
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleTypeName: '',
    description: ''
  });

  // Initialize form data when vehicleType prop changes
  useEffect(() => {
    if (vehicleType && mode === 'edit') {
      setFormData({
        vehicleTypeName: vehicleType.vehicleTypeName || '',
        description: vehicleType.description || ''
      });
    } else {
      setFormData({
        vehicleTypeName: '',
        description: ''
      });
    }
  }, [vehicleType, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.vehicleTypeName.trim()) {
      toast.error('Vehicle type name is required');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      toast.success(`Vehicle type ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (error: any) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} vehicle type:`, error);
      toast.error(error.message || `Failed to ${mode} vehicle type`);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to create/edit vehicle types
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  if (!canModify) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Vehicle Type' : 'Edit Vehicle Type'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleTypeName">Vehicle Type Name *</Label>
            <Input
              id="vehicleTypeName"
              value={formData.vehicleTypeName}
              onChange={(e) => handleInputChange('vehicleTypeName', e.target.value)}
              placeholder="Enter vehicle type name (e.g., Truck, Van, Car)"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
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
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Vehicle Type' : 'Update Vehicle Type')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleTypeModal; 