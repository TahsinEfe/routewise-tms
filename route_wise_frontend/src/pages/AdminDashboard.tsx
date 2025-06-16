import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  UserCheck, 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const adminStats = [
    {
      title: 'Total Users',
      value: '156',
      description: '+8 new this month',
      icon: Users,
      color: 'bg-blue-500',
      href: '/employees'
    },
    {
      title: 'Active Companies',
      value: '23',
      description: '2 pending approval',
      icon: Building,
      color: 'bg-green-500',
      href: '/clients'
    },
    {
      title: 'System Health',
      value: '98.5%',
      description: 'All systems operational',
      icon: Shield,
      color: 'bg-purple-500',
      href: '/settings'
    },
    {
      title: 'Monthly Revenue',
      value: '$45,230',
      description: '+12% from last month',
      icon: DollarSign,
      color: 'bg-orange-500',
      href: '/reports'
    }
  ];

  const systemActivity = [
    {
      id: 1,
      type: 'user',
      message: 'New user registration: John Manager',
      time: '5 minutes ago',
      status: 'info'
    },
    {
      id: 2,
      type: 'system',
      message: 'Database backup completed successfully',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'security',
      message: 'Failed login attempts detected',
      time: '2 hours ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'company',
      message: 'New company registration pending approval',
      time: '3 hours ago',
      status: 'info'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and administrative controls</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
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
                <Link to={stat.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              System Activity
            </CardTitle>
            <CardDescription>Recent system events and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemActivity.map((activity) => (
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

        {/* Admin Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Administrative Actions</CardTitle>
            <CardDescription>System management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/employees">
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm">User Management</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/settings">
                  <Settings className="w-6 h-6" />
                  <span className="text-sm">System Settings</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/reports">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Reports</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/clients">
                  <Database className="w-6 h-6" />
                  <span className="text-sm">Data Management</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 