import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  FileText, 
  PieChart, 
  CreditCard,
  Wallet,
  Receipt,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllClients } from '@/api/client';
import { getAllOrders } from '@/api/order';
import { getOrderItemsByOrderId } from '@/api/orderItem';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AccountantDashboard = () => {
  const financialStats = [
    {
      title: 'Monthly Revenue',
      value: '$45,230',
      description: '+12% from last month',
      icon: DollarSign,
      color: 'bg-green-500',
      href: '/financial-reports'
    },
    {
      title: 'Operating Expenses',
      value: '$28,450',
      description: 'Fuel, maintenance, salaries',
      icon: Receipt,
      color: 'bg-red-500',
      href: '/expenses'
    },
    {
      title: 'Net Profit',
      value: '$16,780',
      description: '+8% profit margin',
      icon: TrendingUp,
      color: 'bg-blue-500',
      href: '/profit-loss'
    },
    {
      title: 'Pending Invoices',
      value: '23',
      description: '$12,340 total amount',
      icon: FileText,
      color: 'bg-orange-500',
      href: '/invoices'
    }
  ];

  const financialActivity = [
    {
      id: 1,
      type: 'payment',
      message: 'Driver salary payment processed - $3,200',
      time: '2 hours ago',
      status: 'success',
      amount: '-$3,200'
    },
    {
      id: 2,
      type: 'invoice',
      message: 'Invoice #INV-2024-001 payment received',
      time: '4 hours ago',
      status: 'success',
      amount: '+$2,850'
    },
    {
      id: 3,
      type: 'expense',
      message: 'Vehicle maintenance expense recorded',
      time: '6 hours ago',
      status: 'warning',
      amount: '-$450'
    },
    {
      id: 4,
      type: 'overdue',
      message: 'Invoice #INV-2024-045 is overdue',
      time: '1 day ago',
      status: 'error',
      amount: '$1,200'
    }
  ];

  // Yeni state'ler
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clientleri çek
  useEffect(() => {
    getAllClients().then(setClients).catch(() => setError('Clients yüklenemedi.'));
  }, []);

  // Client seçilince orderları çek
  useEffect(() => {
    if (selectedClientId) {
      setLoading(true);
      getAllOrders()
        .then((allOrders) => {
          setOrders(allOrders.filter((o: any) => o.clientId === selectedClientId));
        })
        .catch(() => setError('Orders yüklenemedi.'))
        .finally(() => setLoading(false));
    } else {
      setOrders([]);
      setSelectedOrderId(null);
      setOrderItems([]);
    }
  }, [selectedClientId]);

  // Order seçilince order itemları çek
  useEffect(() => {
    if (selectedOrderId) {
      setLoading(true);
      getOrderItemsByOrderId(selectedOrderId)
        .then(setOrderItems)
        .catch(() => setError('Order items yüklenemedi.'))
        .finally(() => setLoading(false));
    } else {
      setOrderItems([]);
    }
  }, [selectedOrderId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
        <p className="text-gray-600 mt-2">Financial overview and accounting management</p>
      </div>

      {/* Client/Order/OrderItem Chart Bölümü */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items by Client</CardTitle>
          <CardDescription>Client bazlı order ve harcama analizi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Client Listesi */}
            <div className="w-full md:w-1/4">
              <h3 className="font-semibold mb-2">Clients</h3>
              <ul className="space-y-1">
                {clients.map((client) => (
                  <li key={client.clientId}>
                    <Button
                      variant={selectedClientId === client.clientId ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedClientId(client.clientId)}
                    >
                      {client.companyName}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Order Listesi */}
            <div className="w-full md:w-1/4">
              <h3 className="font-semibold mb-2">Orders</h3>
              <ul className="space-y-1">
                {orders.map((order) => (
                  <li key={order.orderId}>
                    <Button
                      variant={selectedOrderId === order.orderId ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedOrderId(order.orderId)}
                    >
                      Order #{order.orderId}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Grafik Alanı */}
            <div className="w-full md:w-2/4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              {loading ? (
                <div>Loading...</div>
              ) : orderItems.length === 0 ? (
                <div className="text-gray-500">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderItems} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="itemName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                    <Bar dataKey="unitPrice" fill="#82ca9d" name="Unit Price" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountantDashboard; 