import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  Users, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar,
  BarChart3,
  Route,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const managerStats = [
    {
      title: 'Active Orders',
      value: '87',
      description: '12 pending assignment',
      icon: Package,
      color: 'bg-blue-500',
      href: '/orders'
    },
    {
      title: 'Available Drivers',
      value: '34',
      description: '8 on route, 26 available',
      icon: Users,
      color: 'bg-green-500',
      href: '/employees'
    },
    {
      title: 'Fleet Utilization',
      value: '78%',
      description: '35 of 45 vehicles active',
      icon: Truck,
      color: 'bg-purple-500',
      href: '/vehicles'
    },
    {
      title: 'Route Efficiency',
      value: '92%',
      description: 'Above target performance',
      icon: Route,
      color: 'bg-orange-500',
      href: '/routes'
    }
  ];

  const operationalActivity = [
    {
      id: 1,
      type: 'order',
      message: 'High priority order assigned to Driver Mike',
      time: '10 minutes ago',
      status: 'info'
    },
    {
      id: 2,
      type: 'route',
      message: 'Route optimization completed for Zone B',
      time: '30 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'vehicle',
      message: 'Vehicle TR-789 delayed due to traffic',
      time: '45 minutes ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'employee',
      message: 'Driver Sarah completed 5 deliveries today',
      time: '1 hour ago',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Operations overview and team management</p>
      </div>

      {/* Manager Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {managerStats.map((stat) => (
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
        {/* Operational Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Operational Updates
            </CardTitle>
            <CardDescription>Real-time operations and team activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationalActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {activity.status === 'info' && <Clock className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manager Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Management Actions</CardTitle>
            <CardDescription>Operations and team coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/orders">
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Assign Orders</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/routes">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Plan Routes</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/employees">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Schedule Team</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/tracking">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Performance</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard; 