import React from 'react';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
        <p className="text-gray-600 mt-2">Financial overview and accounting management</p>
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat) => (
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
        {/* Financial Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest financial activities and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 
                    activity.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {activity.status === 'success' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {activity.status === 'warning' && <TrendingDown className="w-4 h-4 text-yellow-600" />}
                    {activity.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    activity.amount.startsWith('+') ? 'text-green-600' : 
                    activity.amount.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {activity.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounting Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Actions</CardTitle>
            <CardDescription>Accounting and financial management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/payroll">
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm">Process Payroll</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/invoices">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Manage Invoices</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/expenses">
                  <Calculator className="w-6 h-6" />
                  <span className="text-sm">Track Expenses</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/reports">
                  <PieChart className="w-6 h-6" />
                  <span className="text-sm">Financial Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Financial Summary
          </CardTitle>
          <CardDescription>Key financial metrics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$45,230</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600 mt-1">↗ +12% vs last month</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">$28,450</div>
              <div className="text-sm text-gray-600">Total Expenses</div>
              <div className="text-xs text-red-600 mt-1">↗ +5% vs last month</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$16,780</div>
              <div className="text-sm text-gray-600">Net Profit</div>
              <div className="text-xs text-blue-600 mt-1">↗ +8% vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountantDashboard; 