import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Plus, 
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllEmployeeTypes, createEmployeeType, updateEmployeeType, deleteEmployeeType } from '@/api/employeeType';
import EmployeeTypeModal from '@/components/EmployeeTypeModal';
import { toast } from 'react-hot-toast';

const EmployeeTypes = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployeeTypes();
      setEmployeeTypes(data);
    } catch (error: any) {
      console.error('Error loading employee types:', error);
      toast.error('Failed to load employee types');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateEmployeeType = async (employeeTypeData: any) => {
    try {
      await createEmployeeType(employeeTypeData);
      await loadData(); // Refresh data
      toast.success('Employee type created successfully!');
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleUpdateEmployeeType = async (employeeTypeData: any) => {
    try {
      await updateEmployeeType(selectedEmployeeType.employeeTypeId, employeeTypeData);
      await loadData(); // Refresh data
      toast.success('Employee type updated successfully!');
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteEmployeeType = async (employeeTypeId: number) => {
    if (window.confirm('Are you sure you want to delete this employee type?')) {
      try {
        await deleteEmployeeType(employeeTypeId);
        await loadData(); // Refresh data
        toast.success('Employee type deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting employee type:', error);
        toast.error('Failed to delete employee type');
      }
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedEmployeeType(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (employeeType: any) => {
    setSelectedEmployeeType(employeeType);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Filter employee types based on search term
  const filteredEmployeeTypes = employeeTypes.filter(type =>
    (type.employeeTypeName && type.employeeTypeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check permissions
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Types</h1>
          <p className="text-gray-600 mt-2">Manage different types of employees in your organization</p>
        </div>
        {canModify && (
          <Button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee Type
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Types</p>
                <p className="text-2xl font-bold">{employeeTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Types</p>
                <p className="text-2xl font-bold">{employeeTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{employeeTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Employee Types</CardTitle>
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

      {/* Employee Types Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading employee types...</div>
        </div>
      ) : filteredEmployeeTypes.length === 0 ? (
        <div className="text-center py-8">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employee types found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No employee types match your search criteria.' : 'Get started by adding your first employee type.'}
          </p>
          {canModify && !searchTerm && (
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee Type
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployeeTypes.map((employeeType) => (
            <Card key={employeeType.employeeTypeId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{employeeType.employeeTypeName}</h3>
                      <p className="text-sm text-gray-500">ID: {employeeType.employeeTypeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                    {canModify && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(employeeType)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEmployeeType(employeeType.employeeTypeId)}
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

                {employeeType.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{employeeType.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Employee Type Modal */}
      <EmployeeTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={modalMode === 'create' ? handleCreateEmployeeType : handleUpdateEmployeeType}
        employeeType={selectedEmployeeType}
        mode={modalMode}
      />
    </div>
  );
};

export default EmployeeTypes; 