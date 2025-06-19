import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Package,
  Truck,
  Map,
  Users,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Car,
  Receipt,
  Building2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehiclesExpanded, setVehiclesExpanded] = useState(false);
  const [employeesExpanded, setEmployeesExpanded] = useState(false);
  const [ordersExpanded, setOrdersExpanded] = useState(false);
  const [organizationExpanded, setOrganizationExpanded] = useState(false);

  // Role-based section visibility
  const role = user?.roleName?.toLowerCase();
  const shouldShowOrders = role === 'admin' || role === 'driver' || role === 'accountant';
  const shouldShowEmployees = role === 'admin' || role === 'manager';
  const shouldShowOrganizations = role === 'admin' || role === 'manager';
  const shouldShowVehicles = role === 'admin' || role === 'driver';
  const shouldShowClients = role === 'admin' || role === 'manager' || role === 'accountant';

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Routes', href: '/routes', icon: Map },
  ];

  const vehicleSubItems = [
    { name: 'Vehicles', href: '/vehicles', icon: Truck },
    { name: 'Vehicle Types', href: '/vehicle-types', icon: Car },
    { name: 'Vehicle Expenses', href: '/vehicle-expenses', icon: Receipt },
  ];

  const orderSubItems = [
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Order Items', href: '/order-items', icon: Package },
    { name: 'Order Routes', href: '/order-routes', icon: Map },
  ];

  const employeeSubItems = [
    { name: 'All Employees', href: '/employees', icon: Users },
    { name: 'Employee Types', href: '/employee-types', icon: Settings },
    { name: 'Salary Components', href: '/salary-components', icon: Receipt },
  ];

  const organizationSubItems = [
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Departments', href: '/departments', icon: Building },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const isVehiclesSectionActive = () => {
    return vehicleSubItems.some(item => isActive(item.href));
  };

  const isOrdersSectionActive = () => {
    return orderSubItems.some(item => isActive(item.href));
  };

  const isEmployeesSectionActive = () => {
    return employeeSubItems.some(item => isActive(item.href));
  };

  const isOrganizationSectionActive = () => {
    return organizationSubItems.some(item => isActive(item.href));
  };

  // Auto-expand sections if any sub-item is active
  React.useEffect(() => {
    if (isOrdersSectionActive()) {
      setOrdersExpanded(true);
    }
    if (isVehiclesSectionActive()) {
      setVehiclesExpanded(true);
    }
    if (isEmployeesSectionActive()) {
      setEmployeesExpanded(true);
    }
    if (isOrganizationSectionActive()) {
      setOrganizationExpanded(true);
    }
  }, [location.pathname]);

  const getInitials = () => {
    if (!user) return '';
    const f = user.firstName?.charAt(0) ?? '';
    const l = user.lastName?.charAt(0) ?? '';
    return f + l;
  };

  const getFullName = () => {
    if (!user) return '';
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <img src="/Route-removebg-preview.png" alt="RouteWise Logo" className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RouteWise
              </h1>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="mt-6 px-3">
            {/* Dashboard */}
            <Link
              key="Dashboard"
              to="/"
              className={`flex items-center px-3 py-3 mb-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className={`w-5 h-5 mr-3 ${isActive('/') ? 'text-white' : 'text-gray-500'}`} />
              Dashboard
            </Link>

            

            

            {/* Clients Section */}
            {shouldShowClients && (
              <Link
                key="Clients"
                to="/clients"
                className={`flex items-center px-3 py-3 mb-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/clients')
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Building className={`w-5 h-5 mr-3 ${isActive('/clients') ? 'text-white' : 'text-gray-500'}`} />
                Clients
              </Link>
            )}

            {/* Orders Section with Dropdown */}
            {shouldShowOrders && (
              <div className="mb-1">
                <button
                    onClick={() => setOrdersExpanded(!ordersExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isOrdersSectionActive()
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                >
                  <div className="flex items-center">
                    <Package className={`w-5 h-5 mr-3 ${isOrdersSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                    Orders
                  </div>
                  {ordersExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isOrdersSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                      <ChevronRight className={`w-4 h-4 ${isOrdersSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </button>

                {/* Orders Submenu */}
                {ordersExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {orderSubItems.map((subItem) => {
                        const active = isActive(subItem.href);
                        return (
                            <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                              {subItem.name}
                            </Link>
                        );
                      })}
                    </div>
                )}
              </div>
            )}

            {/* Employees Section with Dropdown */}
            {shouldShowEmployees && (
              <div className="mb-1">
                <button
                    onClick={() => setEmployeesExpanded(!employeesExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isEmployeesSectionActive()
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                >
                  <div className="flex items-center">
                    <Users className={`w-5 h-5 mr-3 ${isEmployeesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                    Employees
                  </div>
                  {employeesExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isEmployeesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                      <ChevronRight className={`w-4 h-4 ${isEmployeesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </button>

                {/* Employees Submenu */}
                {employeesExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {employeeSubItems.map((subItem) => {
                        const active = isActive(subItem.href);
                        return (
                            <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                              {subItem.name}
                            </Link>
                        );
                      })}
                    </div>
                )}
              </div>
            )}

            {/* Organization Section with Dropdown */}
            {shouldShowOrganizations && (
              <div className="mb-1">
                <button
                    onClick={() => setOrganizationExpanded(!organizationExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isOrganizationSectionActive()
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                >
                  <div className="flex items-center">
                    <Building2 className={`w-5 h-5 mr-3 ${isOrganizationSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                    Organization
                  </div>
                  {organizationExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isOrganizationSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                      <ChevronRight className={`w-4 h-4 ${isOrganizationSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </button>

                {/* Organization Submenu */}
                {organizationExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {organizationSubItems.map((subItem) => {
                        const active = isActive(subItem.href);
                        return (
                            <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                              {subItem.name}
                            </Link>
                        );
                      })}
                    </div>
                )}
              </div>
            )}

            {/* Vehicles Section with Dropdown */}
            {shouldShowVehicles && (
              <div className="mb-1">
                <button
                    onClick={() => setVehiclesExpanded(!vehiclesExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isVehiclesSectionActive()
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                >
                  <div className="flex items-center">
                    <Truck className={`w-5 h-5 mr-3 ${isVehiclesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                    Vehicles
                  </div>
                  {vehiclesExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isVehiclesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                      <ChevronRight className={`w-4 h-4 ${isVehiclesSectionActive() ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </button>

                {/* Vehicles Submenu */}
                {vehiclesExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {vehicleSubItems.map((subItem) => {
                        const active = isActive(subItem.href);
                        return (
                            <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                              {subItem.name}
                            </Link>
                        );
                      })}
                    </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      {/* Avatar yoksa boş bırak, sadece fallback kullan */}
                      <AvatarImage src="" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{getFullName()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.roleName}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[9999] bg-white dark:bg-slate-800 border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
  );
};

export default DashboardLayout;
