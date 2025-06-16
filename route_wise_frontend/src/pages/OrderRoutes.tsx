import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Search, 
  Route,
  MapPin,
  Navigation,
  Truck
} from 'lucide-react';
import { getAllOrders } from '@/api/order';
import { useToast } from '@/hooks/use-toast';
import OpenStreetMap from '@/components/OpenStreetMap';

interface OrderRoute {
  orderId: number;
  routeId: number;
  orderDate: string;
  pickupAddress: string;
  destinationAddress: string;
  vehicleId?: number;
  driverId?: number;
  distance?: number;
}

const OrderRoutes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderRoutes, setOrderRoutes] = useState<OrderRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all order routes
  const loadOrderRoutes = async () => {
    try {
      setLoading(true);
      const orders = await getAllOrders();
      
      // Convert orders to route format
      const routes: OrderRoute[] = orders
        .filter((order: any) => order.pickupAddress && order.destinationAddress)
        .map((order: any) => ({
          orderId: order.orderId,
          routeId: order.orderId, // Using orderId as routeId for now
          orderDate: order.orderDate,
          pickupAddress: order.pickupAddress,
          destinationAddress: order.destinationAddress,
          vehicleId: order.vehicleId,
          driverId: order.driverId,
          distance: undefined, // Will be calculated by map component
        }));

      setOrderRoutes(routes);
    } catch (error) {
      console.error('Error loading order routes:', error);
      toast({
        title: "Error",
        description: "Failed to load order routes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderRoutes();
  }, []);

  // Update distance for a specific route
  const updateRouteDistance = (orderId: number, distance: number) => {
    setOrderRoutes(prevRoutes =>
      prevRoutes.map(route =>
        route.orderId === orderId ? { ...route, distance } : route
      )
    );
  };

  // Filter order routes based on search term
  const filteredOrderRoutes = orderRoutes.filter(route => {
    const searchLower = searchTerm.toLowerCase();
    return (
      route.orderId.toString().includes(searchLower) ||
      route.pickupAddress.toLowerCase().includes(searchLower) ||
      route.destinationAddress.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const totalRoutes = orderRoutes.length;
  const routesWithDistance = orderRoutes.filter(route => route.distance !== undefined);
  const totalDistance = routesWithDistance.reduce((sum, route) => sum + (route.distance || 0), 0);
  const avgDistance = routesWithDistance.length > 0 ? totalDistance / routesWithDistance.length : 0;
  const calculatedRoutesCount = routesWithDistance.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Order Routes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View all routes for order deliveries</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Route className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRoutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Distance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDistance.toFixed(1)} km</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {calculatedRoutesCount}/{totalRoutes} calculated
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Distance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgDistance.toFixed(1)} km</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {calculatedRoutesCount > 0 ? 'Based on real data' : 'No data yet'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Map className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calculated Routes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{calculatedRoutesCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {totalRoutes > 0 ? `${Math.round((calculatedRoutesCount / totalRoutes) * 100)}% complete` : '0% complete'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Search Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID or addresses..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes List */}
      <div className="grid gap-4">
        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading order routes...</p>}
        {!loading && filteredOrderRoutes.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No order routes found.</p>
        )}
        {filteredOrderRoutes.map(route => (
          <Card key={`${route.orderId}-${route.routeId}`} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Route className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Order ORD-{route.orderId}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Route ID: {route.routeId}</p>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pickup */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-700 dark:text-green-400">Pickup Location</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-5">{route.pickupAddress}</p>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-red-700 dark:text-red-400">Destination</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-5">{route.destinationAddress}</p>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Distance: 
                        {route.distance !== undefined ? (
                          <span className="font-medium text-gray-900 dark:text-gray-100"> {route.distance.toFixed(1)} km</span>
                        ) : (
                          <span className="font-medium text-gray-500 dark:text-gray-400"> Click map to calculate</span>
                        )}
                      </span>
                    </div>
                    {route.vehicleId && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Vehicle: <span className="font-medium text-gray-900 dark:text-gray-100">VEH-{route.vehicleId}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-xs">
                    {new Date(route.orderDate).toLocaleDateString()}
                  </Badge>
                  {route.pickupAddress && route.destinationAddress ? (
                    <OpenStreetMap
                      orderId={route.orderId}
                      pickupAddress={route.pickupAddress}
                      destinationAddress={route.destinationAddress}
                      orderDate={new Date(route.orderDate).toLocaleDateString()}
                      onDistanceCalculated={(distance) => updateRouteDistance(route.orderId, distance)}
                    />
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Incomplete Address
                    </Badge>
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

export default OrderRoutes; 