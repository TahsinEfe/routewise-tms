
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: 'CLI-001',
      name: 'Acme Corporation',
      contactPerson: 'Jane Smith',
      email: 'jane.smith@acme.com',
      phone: '+1 (555) 987-6543',
      address: '123 Main St, New York, NY 10001',
      status: 'Active',
      accountManager: 'John Doe',
      totalOrders: 45,
      monthlyRevenue: '$12,500',
      joinDate: '2022-01-15',
      lastOrder: '2024-01-14',
      industry: 'Technology'
    },
    {
      id: 'CLI-002',
      name: 'Global Logistics Inc',
      contactPerson: 'Robert Johnson',
      email: 'r.johnson@globallogistics.com',
      phone: '+1 (555) 876-5432',
      address: '456 Business Ave, Philadelphia, PA 19103',
      status: 'Active',
      accountManager: 'Sarah Wilson',
      totalOrders: 78,
      monthlyRevenue: '$25,800',
      joinDate: '2021-08-22',
      lastOrder: '2024-01-15',
      industry: 'Manufacturing'
    },
    {
      id: 'CLI-003',
      name: 'Tech Solutions Ltd',
      contactPerson: 'Emily Davis',
      email: 'emily@techsolutions.com',
      phone: '+1 (555) 765-4321',
      address: '789 Innovation Dr, Boston, MA 02101',
      status: 'Premium',
      accountManager: 'Mike Chen',
      totalOrders: 123,
      monthlyRevenue: '$45,200',
      joinDate: '2020-03-10',
      lastOrder: '2024-01-13',
      industry: 'Software'
    },
    {
      id: 'CLI-004',
      name: 'Retail Express Co',
      contactPerson: 'David Brown',
      email: 'david.brown@retailexpress.com',
      phone: '+1 (555) 654-3210',
      address: '321 Commerce St, Washington, DC 20001',
      status: 'Inactive',
      accountManager: 'Lisa Anderson',
      totalOrders: 23,
      monthlyRevenue: '$0',
      joinDate: '2023-06-05',
      lastOrder: '2023-12-20',
      industry: 'Retail'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Inactive':
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
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-2">Manage your customers and business relationships</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">$83.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">269</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, contact, or industry..."
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

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-gray-600">{client.contactPerson}</p>
                    <p className="text-sm text-gray-500">{client.id} • {client.industry}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{client.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">{client.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-600">{client.monthlyRevenue}</p>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <p>Account Manager: {client.accountManager}</p>
                <p>Last Order: {client.lastOrder}</p>
                <p>Client Since: {client.joinDate}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Order History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;
