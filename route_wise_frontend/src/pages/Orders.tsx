import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Package,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  User,
  Truck,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building
} from 'lucide-react';
import { getAllOrders, deleteOrder } from '@/api/order';
import { getAllClients } from '@/api/client';
import { getAllStatuses } from '@/api/status';
import { getAllVehicles } from '@/api/vehicle';
import { getAllEmployees } from '@/api/employee';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OrderModal from '@/components/OrderModal';
import OrderDetails from '@/components/OrderDetails';

type Order = {
  orderId: number;
  clientId: number;
  orderDate: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  deliveryDate: string;
  statusId: number;
  assignedVehicleId?: number;
  assignedDriverId?: number;
  companyId: number;
};

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Check if user can manage orders
  const canManageOrders = user?.roleName?.toLowerCase() === 'admin' || user?.roleName?.toLowerCase() === 'manager';

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, clientsData, statusesData, vehiclesData, employeesData] = await Promise.all([
        getAllOrders(),
        getAllClients(),
        getAllStatuses(),
        getAllVehicles(),
        getAllEmployees()
      ]);
      setOrders(ordersData);
      setClients(clientsData);
      setStatuses(statusesData);
      setVehicles(vehiclesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load orders data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper functions to get names
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.clientId === clientId);
    return client ? client.companyName : 'Unknown Client';
  };

  const getStatusInfo = (statusId: number) => {
    const status = statuses.find(s => s.statusId === statusId);
    if (!status) return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    
         // Color based on status name
     let color = "bg-gray-100 text-gray-800";
     switch (status.statusName.toLowerCase()) {
       case 'pending':
         color = "bg-yellow-100 text-yellow-800";
         break;
       case 'in progress':
       case 'in transit':
         color = "bg-blue-100 text-blue-800";
         break;
       case 'delivered':
       case 'completed':
       case 'arrived':
         color = "bg-green-100 text-green-800";
         break;
       case 'cancelled':
         color = "bg-red-100 text-red-800";
         break;
     }
    
    return { label: status.statusName, color };
  };

  const getVehicleName = (vehicleId?: number) => {
    if (!vehicleId) return 'No Vehicle';
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? vehicle.licensePlate : 'Unknown Vehicle';
  };

  const getDriverName = (driverId?: number) => {
    if (!driverId) return 'No Driver';
    const driver = employees.find(e => e.employeeId === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Unknown Driver';
  };

  // Handle order operations
  const handleCreateOrder = () => {
    if (!canManageOrders) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create orders",
        variant: "destructive",
      });
      return;
    }
    setSelectedOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    if (!canManageOrders) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit orders",
        variant: "destructive",
      });
      return;
    }
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!canManageOrders) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete orders",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteOrder(orderId);
        toast({
          title: "Success",
          description: "Order deleted successfully",
        });
        loadData(); // Refresh the list
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailsModalOpen(true);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const clientName = getClientName(order.clientId).toLowerCase();
    const statusName = getStatusInfo(order.statusId).label.toLowerCase();
    
    return (
      order.orderId.toString().includes(searchLower) ||
      clientName.includes(searchLower) ||
      order.pickupAddress.toLowerCase().includes(searchLower) ||
      order.destinationAddress.toLowerCase().includes(searchLower) ||
      statusName.includes(searchLower) ||
      order.orderDate.includes(searchTerm) ||
      order.pickupDate.includes(searchTerm) ||
      order.deliveryDate.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all transportation orders</p>
        </div>
        {canManageOrders && (
          <Button 
            onClick={handleCreateOrder}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        )}
      </div>

             {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => {
                    const status = statuses.find(s => s.statusId === order.statusId);
                    return status?.statusName.toLowerCase() === 'pending';
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrived</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => {
                    const status = statuses.find(s => s.statusId === order.statusId);
                    return status?.statusName.toLowerCase().includes('delivered') || 
                           status?.statusName.toLowerCase().includes('completed') ||
                           status?.statusName.toLowerCase().includes('arrived');
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID, client, address, or status..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {loading && <p className="text-center text-gray-500">Loading orders...</p>}
        {!loading && filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
        {filteredOrders.map(order => {
          const statusInfo = getStatusInfo(order.statusId);
          const clientName = getClientName(order.clientId);
          
          return (
            <Card key={order.orderId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">ORD-{order.orderId}</h3>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-600">{clientName}</p>
                          </div>
                          <p className="text-sm text-gray-500">Order Date: {order.orderDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order.orderId)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canManageOrders && (
                              <>
                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteOrder(order.orderId)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Pickup:</span>
                        <span className="truncate">{order.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="text-gray-600">Delivery:</span>
                        <span className="truncate">{order.destinationAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600">Pickup Date:</span>
                        <span>{order.pickupDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600">Delivery Date:</span>
                        <span>{order.deliveryDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">Driver:</span>
                        <span>{getDriverName(order.assignedDriverId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">Vehicle:</span>
                        <span>{getVehicleName(order.assignedVehicleId)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(order.orderId)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {canManageOrders && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        onSuccess={loadData}
      />

      {/* Order Details Modal */}
      <OrderDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        orderId={selectedOrderId}
        onOrderUpdate={loadData}
      />
    </div>
  );
};

export default Orders;
