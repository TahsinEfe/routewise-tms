
import React, { useState } from 'react';
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

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      id: 'ORD-001',
      customerName: 'Acme Corporation',
      pickup: '123 Main St, New York, NY',
      delivery: '456 Oak Ave, Boston, MA',
      status: 'In Transit',
      priority: 'High',
      driver: 'John Smith',
      vehicle: 'TR-001',
      scheduledDate: '2024-01-15',
      value: '$2,450'
    },
    {
      id: 'ORD-002',
      customerName: 'Global Logistics',
      pickup: '789 Pine St, Philadelphia, PA',
      delivery: '321 Elm St, Washington, DC',
      status: 'Pending',
      priority: 'Medium',
      driver: 'Sarah Johnson',
      vehicle: 'TR-003',
      scheduledDate: '2024-01-16',
      value: '$1,890'
    },
    {
      id: 'ORD-003',
      customerName: 'Tech Solutions Inc',
      pickup: '555 Broadway, New York, NY',
      delivery: '777 Market St, Chicago, IL',
      status: 'Delivered',
      priority: 'Low',
      driver: 'Mike Wilson',
      vehicle: 'TR-005',
      scheduledDate: '2024-01-14',
      value: '$3,200'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID, customer, or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Pickup:</span>
                      <span>{order.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600">Delivery:</span>
                      <span>{order.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Driver:</span>
                      <span>{order.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Vehicle:</span>
                      <span>{order.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-600">Date:</span>
                      <span>{order.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-semibold text-green-600">{order.value}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
