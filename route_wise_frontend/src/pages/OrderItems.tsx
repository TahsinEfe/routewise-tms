import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Search, 
  DollarSign,
  Hash,
  FileText,
  Calendar
} from 'lucide-react';
import { getAllOrders } from '@/api/order';
import { getOrderItemsByOrderId } from '@/api/orderItem';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  orderItemId: number;
  orderId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  createdAt?: string;
}

interface OrderWithItems {
  orderId: number;
  items: OrderItem[];
  totalValue: number;
  itemCount: number;
}

const OrderItems = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderItems, setOrderItems] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all order items
  const loadOrderItems = async () => {
    try {
      setLoading(true);
      const orders = await getAllOrders();
      
      const orderItemsPromises = orders.map(async (order: any) => {
        try {
          const items = await getOrderItemsByOrderId(order.orderId);
          const totalValue = items.reduce((sum: number, item: OrderItem) => 
            sum + (item.quantity * item.unitPrice), 0
          );
          
          return {
            orderId: order.orderId,
            items,
            totalValue,
            itemCount: items.length
          };
        } catch (error) {
          console.error(`Failed to load items for order ${order.orderId}:`, error);
          return {
            orderId: order.orderId,
            items: [],
            totalValue: 0,
            itemCount: 0
          };
        }
      });

      const orderItemsData = await Promise.all(orderItemsPromises);
      // Only show orders that have items
      setOrderItems(orderItemsData.filter(order => order.itemCount > 0));
    } catch (error) {
      console.error('Error loading order items:', error);
      toast({
        title: "Error",
        description: "Failed to load order items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderItems();
  }, []);

  // Filter order items based on search term
  const filteredOrderItems = orderItems.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderId.toString().includes(searchLower) ||
      order.items.some(item => 
        item.itemName.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Calculate total statistics
  const totalItems = orderItems.reduce((sum, order) => sum + order.itemCount, 0);
  const totalValue = orderItems.reduce((sum, order) => sum + order.totalValue, 0);
  const totalOrders = orderItems.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Items</h1>
          <p className="text-gray-600 mt-2">View all items across orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Hash className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
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
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Items/Order</p>
                <p className="text-2xl font-bold">
                  {totalOrders > 0 ? (totalItems / totalOrders).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID or item name..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items List */}
      <div className="grid gap-6">
        {loading && <p className="text-center text-gray-500">Loading order items...</p>}
        {!loading && filteredOrderItems.length === 0 && (
          <p className="text-center text-gray-500">No order items found.</p>
        )}
        {filteredOrderItems.map(order => (
          <Card key={order.orderId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order ORD-{order.orderId}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    ${order.totalValue.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div 
                    key={item.orderItemId} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      {item.createdAt && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Qty: </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price: </span>
                          <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total: </span>
                          <span className="font-bold text-green-600">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderItems; 