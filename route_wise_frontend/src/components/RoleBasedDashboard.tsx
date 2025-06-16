import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import DriverDashboard from '../pages/DriverDashboard';
import AccountantDashboard from '../pages/AccountantDashboard';
import Dashboard from '../pages/Dashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Dashboard />; 
  }

  switch (user.roleName?.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'driver':
      return <DriverDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    default:
      return <Dashboard />; 
  }
};

export default RoleBasedDashboard; 