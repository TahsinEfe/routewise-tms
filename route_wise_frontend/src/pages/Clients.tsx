
import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllClients, deleteClient } from '../api/client';
import ClientModal from '../components/ClientModal';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

const Clients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Check if user has admin or manager role
  const canManageClients = user?.roleName?.toLowerCase() === 'admin' || user?.roleName?.toLowerCase() === 'manager';

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    if (!canManageClients) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete clients",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(clientId);
        toast({
          title: "Success",
          description: "Client deleted successfully",
        });
        fetchClients(); // Refresh the list
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete client",
          variant: "destructive",
        });
      }
    }
  };

  // Handle edit client
  const handleEditClient = (client) => {
    if (!canManageClients) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit clients",
        variant: "destructive",
      });
      return;
    }
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Handle add new client
  const handleAddClient = () => {
    if (!canManageClients) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add clients",
        variant: "destructive",
      });
      return;
    }
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

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
        {canManageClients && (
          <Button 
            onClick={handleAddClient}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        )}
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
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
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
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold">{clients.filter(client => !client.isDeleted).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
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
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading clients...</div>
        </div>
      )}

      {/* Clients Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.clientId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{client.companyName}</h3>
                      <p className="text-gray-600">{client.contactName}</p>
                      <p className="text-sm text-gray-500">ID: {client.clientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                    {canManageClients && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client.clientId)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
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
                    <span>{client.billingAddress}</span>
                  </div>
                  {client.shippingAddress && client.shippingAddress !== client.billingAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Shipping:</span>
                      <span>{client.shippingAddress}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {canManageClients && (
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClient(client)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={selectedClient}
        onSuccess={fetchClients}
      />
    </div>
  );
};

export default Clients;
