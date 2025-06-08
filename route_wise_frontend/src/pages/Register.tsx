import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllCompanies } from '@/api/company';

// Backend'den gelen objelerin property'leri camelCase olmalı!
type Role = { roleId: number; roleName: string; description?: string };
type Company = { companyId: number; companyName: string };

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleName: '',
    companyId: ''
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // Rolleri çek
    fetch('http://localhost:7070/api/roles')
        .then(res => res.json())
        .then((data: Role[]) => {
          // "Admin" hariç filtrele
          const filtered = Array.isArray(data)
              ? data.filter(role => !!role.roleName && role.roleName.toLowerCase() !== 'admin')
              : [];
          setRoles(filtered);
        });

    // Şirketleri çek
    getAllCompanies()
        .then(data => setCompanies(Array.isArray(data) ? data : []))
        .catch(e => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(
          formData.name.split(' ')[0] || formData.name,                       // firstName
          formData.name.split(' ').slice(1).join(' ') || '',                  // lastName
          formData.email,
          formData.password,
          formData.email.split('@')[0],                                       // username
          formData.roleName,                                                  // roleName
          Number(formData.companyId)                                          // companyId
      );
      toast({
        title: "Account created!",
        description: "Welcome to RouteWise. You're now logged in.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different details.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RouteWise
            </h1>
            <p className="text-gray-600 mt-2">Transportation Management System</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Join RouteWise to manage your transportation operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                  </div>
                </div>
                {/* Role Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role</Label>
                  <select
                      id="roleName"
                      className="block w-full p-2 rounded border border-gray-200 bg-white/50 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role.roleId} value={role.roleName}>
                          {role.roleName.charAt(0).toUpperCase() + role.roleName.slice(1)}
                        </option>
                    ))}
                  </select>
                </div>
                {/* Company Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <select
                      id="companyId"
                      className="block w-full p-2 rounded border border-gray-200 bg-white/50 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      required
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                        <option key={company.companyId} value={company.companyId}>
                          {company.companyName}
                        </option>
                    ))}
                  </select>
                </div>
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                  </div>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
                    disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Register;
