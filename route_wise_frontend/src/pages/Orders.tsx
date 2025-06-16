import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  User,
  Truck
} from 'lucide-react';
import { getAllOrders } from '@/api/order';

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
  // Opsiyonel: Diğer alanlar varsa ekle
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
        .then(data => setOrders(data))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
  }, []);

  const getStatusLabel = (statusId: number) => {
    // Buraya backend statusId mapping'inizi ekleyebilirsiniz!
    switch (statusId) {
      case 1: return { label: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 2: return { label: "In Transit", color: "bg-blue-100 text-blue-800" };
      case 3: return { label: "Delivered", color: "bg-green-100 text-green-800" };
      default: return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  // Filtreleme (orderId, adres veya müşteri adı - opsiyonel)
  const filteredOrders = orders.filter(order =>
      (order.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.destinationAddress?.toLowerCase().includes(searchTerm.toLowerCase())
          // Müşteri ismi clientId yerine çekilebiliyorsa eklenir.
      )
  );

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">Manage and track all transportation orders</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search orders by ID or address..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Gelecekte gelişmiş filtreler için: */}
              {/* <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Butpm run ton> */}
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
            const status = getStatusLabel(order.statusId);
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
                              {/* Müşteri ismi burada eklenebilir */}
                              <p className="text-gray-600">Order Date: {order.orderDate}</p>
                            </div>
                          </div>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">Pickup:</span>
                            <span>{order.pickupAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-gray-600">Delivery:</span>
                            <span>{order.destinationAddress}</span>
                          </div>
                          {order.pickupDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <span className="text-gray-600">Pickup Date:</span>
                                <span>{order.pickupDate}</span>
                              </div>
                          )}
                          {order.deliveryDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <span className="text-gray-600">Delivery Date:</span>
                                <span>{order.deliveryDate}</span>
                              </div>
                          )}
                          {order.assignedDriverId && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">Driver ID:</span>
                                <span>{order.assignedDriverId}</span>
                              </div>
                          )}
                          {order.assignedVehicleId && (
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-600">Vehicle ID:</span>
                                <span>{order.assignedVehicleId}</span>
                              </div>
                          )}
                          {/* Değer, müşteri adı vs. eklenebilir */}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {/* <Button variant="outline" size="sm">Track Order</Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>
      </div>
  );
};

export default Orders;
