
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import Orders from "./pages/Orders";
import Vehicles from "./pages/Vehicles";
import VehicleTypes from "./pages/VehicleTypes";
import VehicleExpenses from "./pages/VehicleExpenses";
import EmployeeTypes from "./pages/EmployeeTypes";
import SalaryComponents from "./pages/SalaryComponents";
import RoutesPage from "./pages/Routes";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Tracking from "./pages/Tracking";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RoleBasedDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Vehicles />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicle-types" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VehicleTypes />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicle-expenses" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VehicleExpenses />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/routes" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RoutesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Employees />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/employee-types" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeTypes />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/salary-components" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SalaryComponents />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Clients />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Tracking />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/manager-dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ManagerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/driver-dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DriverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/accountant-dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AccountantDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
