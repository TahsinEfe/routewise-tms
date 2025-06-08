
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  Truck,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const routes = [
    {
      id: 'RT-001',
      name: 'NYC to Boston Express',
      startLocation: 'New York, NY',
      endLocation: 'Boston, MA',
      distance: '215 miles',
      estimatedTime: '4h 15m',
      status: 'Active',
      vehicle: 'TR-001',
      driver: 'John Smith',
      stops: 3,
      optimized: true,
      scheduledDate: '2024-01-15'
    },
    {
      id: 'RT-002',
      name: 'Philadelphia Regional',
      startLocation: 'Philadelphia, PA',
      endLocation: 'Washington, DC',
      distance: '142 miles',
      estimatedTime: '2h 45m',
      status: 'Planned',
      vehicle: 'TR-003',
      driver: 'Sarah Johnson',
      stops: 5,
      optimized: false,
      scheduledDate: '2024-01-16'
    },
    {
      id: 'RT-003',
      name: 'Tri-State Delivery',
      startLocation: 'New York, NY',
      endLocation: 'Chicago, IL',
      distance: '790 miles',
      estimatedTime: '12h 30m',
      status: 'Completed',
      vehicle: 'TR-005',
      driver: 'Mike Wilson',
      stops: 8,
      optimized: true,
      scheduledDate: '2024-01-14'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Planned':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Planning</h1>
          <p className="text-gray-600 mt-2">Plan and optimize delivery routes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            New Route
          </Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="h-96">
        <CardContent className="h-full p-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Route Map</h3>
              <p className="text-gray-600 mb-4">Plan routes, add stops, and optimize delivery sequences</p>
              <Button variant="outline">
                Open Route Planner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search routes by name, location, or driver..."
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

      {/* Routes List */}
      <div className="grid gap-4">
        {routes.map((route) => (
          <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Map className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{route.name}</h3>
                        <p className="text-gray-600">{route.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                      {route.optimized && (
                        <Badge className="bg-green-100 text-green-800">
                          Optimized
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">From:</span>
                      <span>{route.startLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600">To:</span>
                      <span>{route.endLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Time:</span>
                      <span>{route.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Distance:</span>
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-600">Stops:</span>
                      <span>{route.stops}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-600">Vehicle:</span>
                      <span>{route.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Driver:</span>
                      <span>{route.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Date:</span>
                      <span>{route.scheduledDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    View on Map
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Route
                  </Button>
                  {!route.optimized && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Optimize
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Routes;
