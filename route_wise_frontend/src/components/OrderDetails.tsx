import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getOrderById } from '../api/order';
import { getOrderItemsByOrderId, addOrderItem, deleteOrderItem } from '../api/orderItem';
import { getAllClients } from '../api/client';
import { getAllVehicles } from '../api/vehicle';
import { getAllEmployees } from '../api/employee';
import { getAllStatuses } from '../api/status';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Truck, 
  Building,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface OrderItem {
  orderItemId?: number;
  orderId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  createdAt?: string;
}

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
  onOrderUpdate: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose, orderId, onOrderUpdate }) => {
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<OrderItem>({
    orderId: 0,
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    description: ''
  });

  // Load order details and related data
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId || !isOpen) return;

      setLoading(true);
      try {
        const [orderData, itemsData, clientsData, vehiclesData, employeesData, statusesData] = await Promise.all([
          getOrderById(orderId),
          getOrderItemsByOrderId(orderId),
          getAllClients(),
          getAllVehicles(),
          getAllEmployees(),
          getAllStatuses()
        ]);

        setOrder(orderData);
        setOrderItems(itemsData);
        setClients(clientsData);
        setVehicles(vehiclesData);
        setEmployees(employeesData);
        setStatuses(statusesData);
        setNewItem(prev => ({ ...prev, orderId }));
      } catch (error) {
        console.error('Error loading order details:', error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, isOpen, toast]);

  // Helper functions to get names
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.clientId === clientId);
    return client ? client.companyName : 'Unknown Client';
  };

  const getVehicleName = (vehicleId: number) => {
    if (!vehicleId) return 'No Vehicle Assigned';
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? vehicle.licensePlate : 'Unknown Vehicle';
  };

  const getEmployeeName = (employeeId: number) => {
    if (!employeeId) return 'No Driver Assigned';
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Driver';
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(s => s.statusId === statusId);
    return status ? status.statusName : 'Unknown Status';
  };

  const getStatusColor = (statusId: number) => {
    const status = statuses.find(s => s.statusId === statusId);
    if (!status) return 'bg-gray-100 text-gray-800';
    
    // Color based on status name or category
    switch (status.statusName.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle adding new order item
  const handleAddItem = async () => {
    if (!newItem.itemName.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    if (newItem.quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (newItem.unitPrice < 0) {
      toast({
        title: "Error",
        description: "Unit price cannot be negative",
        variant: "destructive",
      });
      return;
    }

    try {
      await addOrderItem(newItem);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      
      // Refresh order items
      const updatedItems = await getOrderItemsByOrderId(orderId!);
      setOrderItems(updatedItems);
      
      // Reset form
      setNewItem({
        orderId: orderId!,
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
      });
      setShowAddItem(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  // Handle deleting order item
  const handleDeleteItem = async (orderItemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteOrderItem(orderItemId);
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
        
        // Refresh order items
        const updatedItems = await getOrderItemsByOrderId(orderId!);
        setOrderItems(updatedItems);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate total value
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  if (!order && !loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto" aria-describedby="order-details-description">
        <DialogHeader>
          <DialogTitle>Order Details - ORD-{order?.orderId}</DialogTitle>
          <DialogDescription id="order-details-description">
            Complete order information and items
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading order details...</div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Information
                  </CardTitle>
                  <Badge className={getStatusColor(order.statusId)}>
                    {getStatusName(order.statusId)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{getClientName(order.clientId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Order Date:</span>
                      <span>{order.orderDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-600">Pickup Date:</span>
                      <span>{order.pickupDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="text-gray-600">Delivery Date:</span>
                      <span>{order.deliveryDate}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Vehicle:</span>
                      <span>{getVehicleName(order.assignedVehicleId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Driver:</span>
                      <span>{getEmployeeName(order.assignedDriverId)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 font-medium">Pickup Address:</span>
                    </div>
                    <p className="text-sm pl-6">{order.pickupAddress}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600 font-medium">Destination Address:</span>
                    </div>
                    <p className="text-sm pl-6">{order.destinationAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Items</CardTitle>
                  <Button 
                    onClick={() => setShowAddItem(true)}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items in this order yet. Click "Add Item" to add items.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <Card key={item.orderItemId} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.itemName}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>Quantity: <strong>{item.quantity}</strong></span>
                                <span>Unit Price: <strong>${item.unitPrice.toFixed(2)}</strong></span>
                                <span>Total: <strong>${(item.quantity * item.unitPrice).toFixed(2)}</strong></span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.orderItemId!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Total */}
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center font-medium">
                          <span>Total Order Value:</span>
                          <span className="text-lg">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Item Form */}
            {showAddItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemName">Item Name *</Label>
                      <Input
                        id="itemName"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitPrice">Unit Price *</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddItem} className="flex-1">
                      Add Item
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddItem(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails; 