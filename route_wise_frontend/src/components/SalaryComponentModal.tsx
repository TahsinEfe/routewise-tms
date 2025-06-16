import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'react-hot-toast';

interface SalaryComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (componentData: any) => Promise<void>;
}

const SalaryComponentModal: React.FC<SalaryComponentModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    componentName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        componentName: '',
        description: ''
      });
    }
  }, [isOpen]);

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
    if (!formData.componentName.trim()) {
      toast.error('Component name is required');
      return;
    }



    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      toast.success('Salary component created successfully!');
    } catch (error: any) {
      console.error('Error saving salary component:', error);
      toast.error(error.response?.data?.message || 'Failed to create salary component');
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
          <DialogTitle>Add New Salary Component</DialogTitle>
          <DialogDescription>
            Create a new salary component type for payroll calculations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Component Name */}
          <div className="space-y-2">
            <Label htmlFor="componentName">Component Name *</Label>
            <Input
              id="componentName"
              name="componentName"
              value={formData.componentName}
              onChange={handleInputChange}
              placeholder="e.g., Basic Salary, Overtime, Tax Deduction"
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
              placeholder="Optional description for this component..."
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
              {loading ? 'Creating...' : 'Create Component'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryComponentModal; 