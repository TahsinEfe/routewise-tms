import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface VehicleExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: any) => void;
  vehicles: any[];
}

const VehicleExpenseModal: React.FC<VehicleExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    expenseDate: new Date().toISOString().split('T')[0], // Today's date
    description: '',
    amount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.vehicleId) {
      toast.error('Please select a vehicle');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        vehicleId: parseInt(formData.vehicleId),
        expenseDate: formData.expenseDate,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount)
      };

      await onSave(expenseData);
      
      // Reset form
      setFormData({
        vehicleId: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
        amount: ''
      });
      
      onClose();
      toast.success('Expense added successfully!');
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(error.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to create expenses
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  if (!canModify) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Vehicle Expense</DialogTitle>
          <DialogDescription>
            Record a new expense for a vehicle
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleId">Vehicle *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => handleInputChange('vehicleId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                    {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expenseDate">Expense Date *</Label>
            <Input
              id="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => handleInputChange('expenseDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter expense description (e.g., Fuel, Maintenance, Repair)"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount"
              required
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
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleExpenseModal; 