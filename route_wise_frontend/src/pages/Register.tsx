import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { companyAPI } from '@/api/company';

// Backend'den gelen objelerin property'leri camelCase olmalı!
type Role = { roleId: number; roleName: string; description?: string };
type Company = { companyId: number; companyName: string; companyAddress?: string; companyPhone?: string; companyEmail?: string; companyWebsite?: string; contactPerson?: string };

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
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Animation state
  const [pathProgress, setPathProgress] = useState(0);
  
  // Animated route path coordinates - different from login page
  const startPoint = { x: 15, y: 20 };
  const endPoint = { x: 80, y: 75 };
  const midPoint1 = { x: 40, y: 50 };
  const midPoint2 = { x: 60, y: 30 };
  
  // Route progress animation
  useEffect(() => {
    const animateRoute = () => {
      setPathProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 0.4; // Slightly slower than login
      });
    };
    
    const interval = setInterval(animateRoute, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate waypoints along the path
  const generateWaypoints = () => {
    const waypoints = [];
    for (let i = 0; i < 5; i++) {
      const progress = i * 20; // 0, 20, 40, 60, 80
      // Static waypoints for visual purposes
      const x = startPoint.x + (endPoint.x - startPoint.x) * (progress / 100);
      const y = startPoint.y + (endPoint.y - startPoint.y) * (progress / 100);
      waypoints.push({ x, y });
    }
    return waypoints;
  };
  
  const waypoints = generateWaypoints();

  useEffect(() => {
    setIsLoadingData(true);
    
    // Rolleri çek
    const fetchRoles = fetch('http://localhost:7070/api/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: Role[]) => {
          // "Admin" hariç filtrele
          const filtered = Array.isArray(data)
              ? data.filter(role => !!role.roleName && role.roleName.toLowerCase() !== 'admin')
              : [];
          setRoles(filtered);
        })
        .catch(e => {
          console.error('Roles fetch error:', e);
          toast({
            title: "Error",
            description: "Failed to load roles. Please refresh the page.",
            variant: "destructive",
          });
        });

    // Şirketleri çek
    const fetchCompanies = companyAPI.getAll()
        .then(data => {
          setCompanies(Array.isArray(data) ? data : []);
        })
        .catch(e => {
          console.error('Companies fetch error:', e);
          toast({
            title: "Error",
            description: "Failed to load companies. Please refresh the page.",
            variant: "destructive",
          });
        });

    // Her iki API çağrısı tamamlandığında loading'i kapat
    Promise.all([fetchRoles, fetchCompanies])
        .finally(() => setIsLoadingData(false));
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
        title: "🎉 Account created!",
        description: "Welcome to RouteWise. You're now logged in.",
        variant: "default",
      });
      navigate('/');
    }  catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different details.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl w-full items-center justify-center">

          {/* Left Side - Route Planning Animation */}
          <div className="flex-shrink-0 w-full lg:w-1/2 flex justify-center items-center relative h-[400px]">
            
            {/* Map Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Animated Route Map */}
            <svg viewBox="0 0 400 300" className="w-[400px] h-[300px] relative z-10">
              {/* Background roads */}
              <g className="opacity-20">
                <path d="M 50 150 L 350 150" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 200 50 L 200 250" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 100 100 L 300 200" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
              </g>

              {/* Main Route Path - görseldeki gibi */}
              <path 
                d={`M ${startPoint.x * 4} ${startPoint.y * 3} Q ${midPoint1.x * 4} ${midPoint1.y * 3} ${endPoint.x * 4} ${endPoint.y * 3}`}
                stroke="#3b82f6" 
                strokeWidth="6" 
                fill="none"
                strokeDasharray="10,5"
                className="opacity-60"
              />
              
              {/* Route Progress Overlay - hareket eden yol */}
              <path
                d={`M ${startPoint.x * 4} ${startPoint.y * 3} Q ${midPoint1.x * 4} ${midPoint1.y * 3} ${endPoint.x * 4} ${endPoint.y * 3}`}
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray="500"
                strokeDashoffset={500 - (pathProgress * 5)}
                className="drop-shadow-lg transition-all duration-100"
              />
              
              {/* Start point marker - A noktası */}
              <g className="animate-pulse">
                <circle 
                  cx={startPoint.x * 4} 
                  cy={startPoint.y * 3} 
                  r="12" 
                  fill="#ef4444"
                  stroke="#fff" 
                  strokeWidth="3"
                />
                <circle 
                  cx={startPoint.x * 4} 
                  cy={startPoint.y * 3} 
                  r="20" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  opacity="0.4"
                />
              </g>
              
              {/* End point marker - B noktası */}
              <g className="animate-pulse" style={{ animationDelay: "0.5s" }}>
                <circle 
                  cx={endPoint.x * 4} 
                  cy={endPoint.y * 3} 
                  r="12" 
                  fill="#10b981"
                  stroke="#fff" 
                  strokeWidth="3"
                />
                <circle 
                  cx={endPoint.x * 4} 
                  cy={endPoint.y * 3} 
                  r="20" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  opacity="0.4"
                />
              </g>
              
              {/* Waypoints along the path - yol üzerindeki noktalar */}
              {waypoints.map((point, index) => (
                <circle 
                  key={index}
                  cx={point.x * 4} 
                  cy={point.y * 3} 
                  r="4" 
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.8"
                />
              ))}
              
              {/* Moving vehicle - hareket eden araç */}
              <g
                style={{
                  offsetPath: `path("M ${startPoint.x * 4} ${startPoint.y * 3} Q ${midPoint1.x * 4} ${midPoint1.y * 3} ${endPoint.x * 4} ${endPoint.y * 3}")`,
                  offsetDistance: `${pathProgress}%`,
                  offsetRotate: 'auto',
                }}
                className="transition-all duration-100"
              >
                <circle r="8" fill="#6366f1" stroke="#fff" strokeWidth="3" />
                <circle r="16" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.5" className="animate-ping" />
              </g>

              {/* Location Icons - A ve B harfleri */}
              <g transform={`translate(${startPoint.x * 4 - 12}, ${startPoint.y * 3 - 18})`}>
                <rect x="0" y="0" width="24" height="24" fill="#ef4444" rx="3" />
                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">A</text>
              </g>
              <g transform={`translate(${endPoint.x * 4 - 12}, ${endPoint.y * 3 - 18})`}>
                <rect x="0" y="0" width="24" height="24" fill="#10b981" rx="3" />
                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">B</text>
              </g>
            </svg>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <img src="/Route-removebg-preview.png" alt="RouteWise Logo" className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                RouteWise
              </h1>
              <p className="text-blue-200 mt-2">Transportation Management System</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Create your account</h2>
                <p className="text-blue-200 mt-2">Join RouteWise to manage your transportation operations</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-blue-200 text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-blue-200 text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                  </div>
                </div>
                
                {/* Role Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="roleName" className="text-blue-200 text-sm font-medium">Role</label>
                  <select
                      id="roleName"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      required
                      disabled={isLoadingData}
                  >
                    <option value="" className="bg-slate-800 text-white">
                      {isLoadingData ? "Loading roles..." : "Select your role"}
                    </option>
                    {roles.map((role) => (
                        <option key={role.roleId} value={role.roleName} className="bg-slate-800 text-white">
                          {role.roleName.charAt(0).toUpperCase() + role.roleName.slice(1)}
                        </option>
                    ))}
                  </select>
                </div>
                
                {/* Company Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="companyId" className="text-blue-200 text-sm font-medium">Company</label>
                  <select
                      id="companyId"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      required
                      disabled={isLoadingData}
                  >
                    <option value="" className="bg-slate-800 text-white">
                      {isLoadingData ? "Loading companies..." : "Select your company"}
                    </option>
                    {companies.map((company) => (
                        <option key={company.companyId} value={company.companyId} className="bg-slate-800 text-white">
                          {company.companyName}
                        </option>
                    ))}
                  </select>
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-blue-200 text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-blue-200 text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                  </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    disabled={isLoading || isLoadingData}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-blue-200 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;
