
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  MapPin, 
  Truck, 
  Clock, 
  Navigation,
  Zap,
  RefreshCw
} from 'lucide-react';

const Tracking = () => {
  const activeVehicles = [
    {
      id: 'TR-001',
      driver: 'John Smith',
      status: 'On Route',
      currentLocation: 'I-95 N, Newark, NJ',
      destination: 'Boston, MA',
      eta: '2h 15m',
      speed: '65 mph',
      lastUpdate: '2 minutes ago',
      progress: 65
    },
    {
      id: 'TR-003',
      driver: 'Sarah Johnson',
      status: 'Loading',
      currentLocation: 'Warehouse District, Philadelphia, PA',
      destination: 'Washington, DC',
      eta: '3h 45m',
      speed: '0 mph',
      lastUpdate: '5 minutes ago',
      progress: 15
    },
    {
      id: 'TR-005',
      driver: 'Mike Wilson',
      status: 'Delivering',
      currentLocation: 'Downtown Chicago, IL',
      destination: 'Oak Park, IL',
      eta: '25 min',
      speed: '25 mph',
      lastUpdate: '1 minute ago',
      progress: 85
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Route':
        return 'bg-blue-100 text-blue-800';
      case 'Loading':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivering':
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
          <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-600 mt-2">Real-time vehicle and delivery tracking</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Live Map */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Live Fleet Map
          </CardTitle>
          <CardDescription>Real-time vehicle positions and routes</CardDescription>
        </CardHeader>
        <CardContent className="h-full p-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <Navigation className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Fleet Tracking</h3>
              <p className="text-gray-600 mb-4">View all vehicles in real-time on the map</p>
              <Button variant="outline">
                Open Full Map
              </Button>
            </div>
            
            {/* Mock vehicle indicators */}
            <div className="absolute top-20 left-20 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-32 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-24 left-32 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Active Vehicles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Vehicles</h2>
        <div className="grid gap-4">
          {activeVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.id}</h3>
                          <p className="text-gray-600">{vehicle.driver}</p>
                        </div>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Current:</span>
                          <span>{vehicle.currentLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-gray-600">Destination:</span>
                          <span>{vehicle.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">ETA:</span>
                          <span>{vehicle.eta}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-600">Speed:</span>
                          <span>{vehicle.speed}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{vehicle.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${vehicle.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {vehicle.lastUpdate}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Driver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
