import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Receipt, 
  Search, 
  Plus, 
  MoreVertical,
  Trash2,
  DollarSign,
  Calendar,
  Truck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllVehicleExpenses, createVehicleExpense, deleteVehicleExpense } from '@/api/vehicleExpense';
import { getAllVehicles } from '@/api/vehicle';
import { toast } from 'react-hot-toast';
import VehicleExpenseModal from '@/components/VehicleExpenseModal';

const VehicleExpenses = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expensesData, vehiclesData] = await Promise.all([
        getAllVehicleExpenses(),
        getAllVehicles()
      ]);
      setExpenses(expensesData);
      setVehicles(vehiclesData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load vehicle expenses');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateExpense = async (expenseData: any) => {
    try {
      await createVehicleExpense(expenseData);
      await loadData(); // Refresh data
    } catch (error: any) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteVehicleExpense(expenseId);
        await loadData(); // Refresh data
        toast.success('Expense deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  // Helper functions
  const getVehicleLicensePlate = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle?.licensePlate || 'Unknown Vehicle';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByVehicle = expenses.reduce((acc, expense) => {
    const vehicleId = expense.vehicleId;
    if (!acc[vehicleId]) {
      acc[vehicleId] = { total: 0, count: 0 };
    }
    acc[vehicleId].total += expense.amount;
    acc[vehicleId].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense =>
    getVehicleLicensePlate(expense.vehicleId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check permissions
  const canModify = user?.roleName === 'Admin' || user?.roleName === 'Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Expenses</h1>
          <p className="text-gray-600 mt-2">Track and manage vehicle-related expenses</p>
        </div>
        {canModify && (
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
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
                <p className="text-sm text-gray-600">Vehicles with Expenses</p>
                <p className="text-2xl font-bold">{Object.keys(expensesByVehicle).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg per Vehicle</p>
                <p className="text-2xl font-bold">
                  {Object.keys(expensesByVehicle).length > 0 
                    ? formatCurrency(totalExpenses / Object.keys(expensesByVehicle).length)
                    : '$0.00'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Expense Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(expensesByVehicle).map(([vehicleId, data]) => (
              <div key={vehicleId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{getVehicleLicensePlate(parseInt(vehicleId))}</h4>
                  <Badge variant="secondary">{data.count} expenses</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.total)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by vehicle or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading expenses...</div>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No expenses match your search criteria.' : 'Get started by adding your first expense.'}
          </p>
          {canModify && !searchTerm && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div key={expense.expenseId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{getVehicleLicensePlate(expense.vehicleId)}</h4>
                      <p className="text-sm text-gray-600">{expense.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(expense.expenseDate)}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
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
                        <DropdownMenuItem 
                          onClick={() => handleDeleteExpense(expense.expenseId)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Expense Modal */}
      <VehicleExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateExpense}
        vehicles={vehicles}
      />
    </div>
  );
};

export default VehicleExpenses; 