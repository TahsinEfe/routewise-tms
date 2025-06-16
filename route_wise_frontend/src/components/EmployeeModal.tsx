import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createEmployee, updateEmployee } from '../api/employee';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  employeeTypeId: number;
  departmentId: number;
  dateOfBirth?: string;
  hireDate: string;
  userId?: number;
  companyId?: number;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employee, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Employee>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    employeeTypeId: 1,
    departmentId: 1,
    dateOfBirth: '',
    hireDate: new Date().toISOString().split('T')[0],
    companyId: user?.companyId || 1
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
          } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          employeeTypeId: 1,
          departmentId: 1,
          dateOfBirth: '',
          hireDate: new Date().toISOString().split('T')[0],
          companyId: user?.companyId || 1
        });
      }
  }, [employee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (employee?.employeeId) {
        await updateEmployee(employee.employeeId, formData);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        await createEmployee(formData);
        toast({
          title: "Success",
          description: "Employee created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Employee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee ? 'Update employee information' : 'Fill in the details to add a new employee'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeType">Employee Type</Label>
              <Select value={formData.employeeTypeId.toString()} onValueChange={(value) => handleInputChange('employeeTypeId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Driver</SelectItem>
                  <SelectItem value="2">Manager</SelectItem>
                  <SelectItem value="3">Admin</SelectItem>
                  <SelectItem value="4">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={formData.departmentId.toString()} onValueChange={(value) => handleInputChange('departmentId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Operations</SelectItem>
                  <SelectItem value="2">Finance</SelectItem>
                  <SelectItem value="3">HR</SelectItem>
                  <SelectItem value="4">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (employee ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal; 