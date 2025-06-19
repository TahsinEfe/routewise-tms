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
  Target,
  Building,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllClients } from '@/api/client';
import { getAllEmployees } from '@/api/employee';
import { departmentAPI } from '@/api/department';
import { getAllVehicles } from '@/api/vehicle';
import { useEffect, useState } from 'react';

const ManagerDashboard = () => {
  // Yeni state'ler
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [employeesCount, setEmployeesCount] = useState<number | null>(null);
  const [departmentsCount, setDepartmentsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getAllClients(),
      getAllEmployees(),
      departmentAPI.getAll(),
      getAllVehicles()
    ])
      .then(([clients, employees, departments, vehicles]) => {
        setClientsCount(Array.isArray(clients) ? clients.length : 0);
        setEmployeesCount(Array.isArray(employees) ? employees.length : 0);
        setDepartmentsCount(Array.isArray(departments) ? departments.length : 0);
      })
      .catch(() => setError('Dashboard verileri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  // Sidebar başlıklarına karşılık gelen card'lar
  const quickStats = [
    {
      title: 'Clients',
      value: loading ? '...' : clientsCount,
      icon: Building,
      href: '/clients',
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
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      {/* Sidebar başlıklarına karşılık gelen hızlı card'lar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default ManagerDashboard; 