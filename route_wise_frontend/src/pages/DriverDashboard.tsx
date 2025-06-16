import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Fuel,
  Truck,
  Route,
  Star,
  Calendar,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
  const driverStats = [
    {
      title: 'Today\'s Deliveries',
      value: '8',
      description: '6 completed, 2 pending',
      icon: Package,
      color: 'bg-blue-500',
      href: '/orders'
    },
    {
      title: 'Current Route',
      value: 'Zone A',
      description: '3 stops remaining',
      icon: Route,
      color: 'bg-green-500',
      href: '/tracking'
    },
    {
      title: 'Vehicle Status',
      value: 'Good',
      description: 'Fuel: 75%, No issues',
      icon: Truck,
      color: 'bg-purple-500',
      href: '/vehicles'
    },
    {
      title: 'Performance',
      value: '4.8/5',
      description: 'Customer rating',
      icon: Star,
      color: 'bg-orange-500',
      href: '/performance'
    }
  ];

  const todaysTasks = [
    {
      id: 1,
      type: 'delivery',
      address: '123 Main St, Downtown',
      time: '09:30 AM',
      status: 'completed',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'delivery',
      address: '456 Oak Ave, Midtown',
      time: '11:00 AM',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 3,
      type: 'delivery',
      address: '789 Pine St, Uptown',
      time: '02:15 PM',
      status: 'in-progress',
      priority: 'normal'
    },
    {
      id: 4,
      type: 'delivery',
      address: '321 Elm Dr, Westside',
      time: '04:00 PM',
      status: 'pending',
      priority: 'high'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600 mt-2">Your daily routes and delivery status</p>
      </div>

      {/* Driver Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {driverStats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full mt-4">
                <Link to={stat.href}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Deliveries
            </CardTitle>
            <CardDescription>Your scheduled deliveries for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`p-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100' :
                    task.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {task.status === 'in-progress' && <Timer className="w-4 h-4 text-blue-600" />}
                    {task.status === 'pending' && <Clock className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{task.address}</p>
                      {task.priority === 'high' && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">High Priority</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Scheduled: {task.time}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/tracking">
                        <Navigation className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common driver tasks and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/tracking">
                  <Navigation className="w-6 h-6" />
                  <span className="text-sm">Start Navigation</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/orders">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">Update Delivery</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/vehicles">
                  <Fuel className="w-6 h-6" />
                  <span className="text-sm">Vehicle Check</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/notifications">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-sm">Report Issue</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard; 