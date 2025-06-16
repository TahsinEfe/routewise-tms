import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

interface EmployeeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeTypeData: any) => Promise<void>;
  employeeType?: any;
  mode: 'create' | 'edit';
}

const EmployeeTypeModal: React.FC<EmployeeTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeType,
  mode
}) => {
  const [formData, setFormData] = useState({
    employeeTypeName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or employee type changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && employeeType) {
        setFormData({
          employeeTypeName: employeeType.employeeTypeName || '',
          description: employeeType.description || ''
        });
      } else {
        setFormData({
          employeeTypeName: '',
          description: ''
        });
      }
    }
  }, [isOpen, mode, employeeType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeTypeName.trim()) {
      toast.error('Employee type name is required');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      toast.success(`Employee type ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (error: any) {
      console.error('Error saving employee type:', error);
      toast.error(error.response?.data?.message || `Failed to ${mode} employee type`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Employee Type' : 'Edit Employee Type'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a new employee type for your organization.' 
              : 'Update the employee type information.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Type Name */}
          <div className="space-y-2">
            <Label htmlFor="employeeTypeName">Employee Type Name *</Label>
            <Input
              id="employeeTypeName"
              name="employeeTypeName"
              value={formData.employeeTypeName}
              onChange={handleInputChange}
              placeholder="e.g., Full-time, Part-time, Contractor"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description for this employee type..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTypeModal; 