import React, { useEffect, useState } from 'react';
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
  Timer,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllVehicles } from '@/api/vehicle';
import { getAllOrders } from '@/api/order';
import { getAllEmployees } from '@/api/employee';
import { getAllVehicleTypes } from '@/api/vehicleType';
import { companyAPI } from '@/api/company';

const DriverDashboard = () => {
  const driverStats = [
    {
      title: 'Deliveries',
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
      href: '/order-routes'
    },
    {
      title: 'Vehicle Status',
      value: 'Good',
      description: 'Fuel: 75%, No issues',
      icon: Truck,
      color: 'bg-purple-500',
      href: '/vehicles'
    },
    
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

  // İstatistikler için state
  const [vehicleCount, setVehicleCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [driverCount, setDriverCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showVehicleTable, setShowVehicleTable] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getAllVehicles(),
      getAllOrders(),
      getAllEmployees(),
      getAllVehicleTypes(),
      companyAPI.getAll()
    ])
      .then(([vehiclesData, orders, employeesData, vehicleTypesData, companiesData]) => {
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setVehicleCount(Array.isArray(vehiclesData) ? vehiclesData.length : 0);
        setOrderCount(Array.isArray(orders) ? orders.length : 0);
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
        // Driver rolüne sahip olanları say
        const drivers = Array.isArray(employeesData)
          ? employeesData.filter(emp => emp.roleName?.toLowerCase() === 'driver')
          : [];
        setDriverCount(drivers.length);
        setVehicleTypes(Array.isArray(vehicleTypesData) ? vehicleTypesData : []);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      })
      .catch((err) => {
        setError('İstatistikler yüklenirken hata oluştu.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Yardımcılar
  const getCompanyName = (companyId: number) => {
    const c = companies.find((c: any) => c.companyId === companyId);
    return c?.companyName || '-';
  };
  const getVehicleTypeName = (vehicleTypeId: number) => {
    const t = vehicleTypes.find((t: any) => t.vehicleTypeId === vehicleTypeId);
    return t?.vehicleTypeName || '-';
  };
  const getDriverName = (assignedDriverId: number) => {
    if (!assignedDriverId) return '-';
    const driver = employees.find((e: any) => e.employeeId === assignedDriverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : '-';
  };

  return (
    <div className="space-y-6">
      {/* Genel İstatistikler */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600 mt-2">Your daily routes and delivery status</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card onClick={() => setShowVehicleTable((v) => !v)} className="cursor-pointer">
          <CardContent className="flex items-center gap-4 p-4">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-lg font-semibold">Total Vehicles</p>
              <p className="text-2xl font-bold">{loading ? '...' : vehicleCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-lg font-semibold">Total Orders</p>
              <p className="text-2xl font-bold">{loading ? '...' : orderCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-lg font-semibold">Total Drivers</p>
              <p className="text-2xl font-bold">{loading ? '...' : driverCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

      {/* Araçlar Tablosu */}
      {showVehicleTable && (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Vehicles</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">License Plate</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Vehicle Type</th>
                <th className="px-4 py-2 text-left">Assigned Driver</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId} className="border-b">
                  <td className="px-4 py-2">{vehicle.licensePlate}</td>
                  <td className="px-4 py-2">{getCompanyName(vehicle.companyId)}</td>
                  <td className="px-4 py-2">{getVehicleTypeName(vehicle.vehicleTypeId)}</td>
                  <td className="px-4 py-2">{getDriverName(vehicle.assignedDriverId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
    </div>
  );
};

export default DriverDashboard; 