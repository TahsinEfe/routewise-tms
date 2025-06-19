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
  DollarSign,
  Package,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllClients } from '@/api/client';
import { getAllOrders } from '@/api/order';
import { getAllEmployees } from '@/api/employee';
import { getAllVehicles } from '@/api/vehicle';
import { departmentAPI } from '@/api/department';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [employeesCount, setEmployeesCount] = useState<number | null>(null);
  const [departmentsCount, setDepartmentsCount] = useState<number | null>(null);
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getAllClients(),
      getAllOrders(),
      getAllEmployees(),
      departmentAPI.getAll(),
      getAllVehicles()
    ])
      .then(([clients, orders, employees, departments, vehicles]) => {
        setClientsCount(Array.isArray(clients) ? clients.length : 0);
        setOrdersCount(Array.isArray(orders) ? orders.length : 0);
        setEmployeesCount(Array.isArray(employees) ? employees.length : 0);
        setDepartmentsCount(Array.isArray(departments) ? departments.length : 0);
        setVehiclesCount(Array.isArray(vehicles) ? vehicles.length : 0);
      })
      .catch(() => setError('Dashboard verileri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  const quickStats = [
    {
      title: 'Clients',
      value: loading ? '...' : clientsCount,
      icon: Building,
      href: '/clients',
    },
    {
      title: 'Orders',
      value: loading ? '...' : ordersCount,
      icon: Package,
      href: '/orders',
    },
    {
      title: 'Employees',
      value: loading ? '...' : employeesCount,
      icon: Users,
      href: '/employees',
    },
    {
      title: 'Organization',
      value: loading ? '...' : departmentsCount,
      icon: Settings,
      href: '/departments',
    },
    {
      title: 'Vehicles',
      value: loading ? '...' : vehiclesCount,
      icon: Truck,
      href: '/vehicles',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and administrative controls</p>
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <stat.icon className="w-8 h-8 mb-2 text-blue-600" />
              <p className="text-lg font-semibold mb-1">{stat.title}</p>
              <p className="text-2xl font-bold mb-2">{stat.value}</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to={stat.href}>Go to {stat.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 