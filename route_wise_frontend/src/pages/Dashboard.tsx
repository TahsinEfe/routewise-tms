
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Users, Building, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Active Orders',
      value: '124',
      description: '+12% from last month',
      icon: Package,
      color: 'bg-blue-500',
      href: '/orders'
    },
    {
      title: 'Fleet Vehicles',
      value: '45',
      description: '38 active, 7 maintenance',
      icon: Truck,
      color: 'bg-green-500',
      href: '/vehicles'
    },
    {
      title: 'Employees',
      value: '89',
      description: '76 drivers, 13 staff',
      icon: Users,
      color: 'bg-purple-500',
      href: '/employees'
    },
    {
      title: 'Clients',
      value: '267',
      description: '+5 new this week',
      icon: Building,
      color: 'bg-orange-500',
      href: '/clients'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'order',
      message: 'Order #1234 delivered successfully',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'vehicle',
      message: 'Vehicle TR-456 requires maintenance',
      time: '15 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'route',
      message: 'Route optimization completed for Zone A',
      time: '1 hour ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'employee',
      message: 'Driver John Smith completed delivery',
      time: '2 hours ago',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your transportation operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your transportation operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/orders">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">New Order</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/routes">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">Plan Route</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/vehicles">
                  <Truck className="w-6 h-6" />
                  <span className="text-sm">Fleet Status</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/tracking">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">Live Tracking</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
