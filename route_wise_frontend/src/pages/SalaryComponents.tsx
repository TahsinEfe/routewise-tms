import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Receipt, 
  Search, 
  Plus, 
  DollarSign,
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSalaryComponentTypes, createSalaryComponentType, deleteSalaryComponentType } from '@/api/salaryComponent';
import SalaryComponentModal from '@/components/SalaryComponentModal';
import { toast } from 'react-hot-toast';

const SalaryComponents = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryComponents, setSalaryComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllSalaryComponentTypes();
      setSalaryComponents(data);
    } catch (error: any) {
      console.error('Error loading salary components:', error);
      toast.error('Failed to load salary components');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateSalaryComponent = async (componentData: any) => {
    try {
      await createSalaryComponentType(componentData);
      await loadData(); // Refresh data
      toast.success('Salary component created successfully!');
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteSalaryComponent = async (componentId: number) => {
    if (window.confirm('Are you sure you want to delete this salary component?')) {
      try {
        await deleteSalaryComponentType(componentId);
        await loadData(); // Refresh data
        toast.success('Salary component deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting salary component:', error);
        toast.error('Failed to delete salary component');
      }
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setModalOpen(true);
  };



  // Filter salary components based on search term
  const filteredComponents = salaryComponents.filter(component =>
    (component.componentTypeName && component.componentTypeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (component.description && component.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check permissions
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  // Calculate statistics
  const totalComponents = salaryComponents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salary Components</h1>
          <p className="text-gray-600 mt-2">Manage salary components for payroll calculations</p>
        </div>
        {canModify && (
          <Button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Components</p>
                <p className="text-2xl font-bold">{totalComponents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Component Types</p>
                <p className="text-2xl font-bold">{totalComponents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{totalComponents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Salary Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, type, or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Salary Components Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading salary components...</div>
        </div>
      ) : filteredComponents.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No salary components found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No components match your search criteria.' : 'Get started by adding your first salary component.'}
          </p>
          {canModify && !searchTerm && (
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <Card key={component.componentTypeId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{component.componentTypeName}</h3>
                      <p className="text-sm text-gray-500">ID: {component.componentTypeId}</p>
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
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSalaryComponent(component.componentTypeId)}
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

                {component.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{component.description}</p>
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

      {/* Salary Component Modal */}
      <SalaryComponentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateSalaryComponent}
      />
    </div>
  );
};

export default SalaryComponents; 