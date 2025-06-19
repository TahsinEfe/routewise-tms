import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Simulate route calculation progress
  useEffect(() => {
    const interval = setInterval(() => {
      setRouteProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      alert('Login failed. Please check your credentials.');
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

          {/* Main Route SVG */}
          <svg viewBox="0 0 400 300" className="w-[400px] h-[300px] relative z-10">
            {/* Background roads */}
            <g className="opacity-30">
              <path d="M 50 150 L 350 150" stroke="#64748b" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 200 50 L 200 250" stroke="#64748b" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 100 100 L 300 200" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
            </g>

            {/* Main Route Path */}
            <path
              id="mainRoute"
              d="M 60 250 Q 120 180 160 160 T 240 140 Q 280 120 340 80"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,4"
              className="drop-shadow-lg"
            />

            {/* Route Progress Overlay */}
            <path
              d="M 60 250 Q 120 180 160 160 T 240 140 Q 280 120 340 80"
              stroke="#10b981"
              strokeWidth="6"
              fill="none"
              strokeDasharray="300"
              strokeDashoffset={300 - (routeProgress * 3)}
              className="drop-shadow-lg transition-all duration-100"
            />

            {/* Start Point */}
            <g className="animate-pulse">
              <circle cx="60" cy="250" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <circle cx="60" cy="250" r="16" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
            </g>

            {/* End Point */}
            <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <circle cx="340" cy="80" r="8" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="340" cy="80" r="16" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" />
            </g>

            {/* Waypoints */}
            <circle cx="160" cy="160" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
            <circle cx="240" cy="140" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />

            {/* Moving Vehicle */}
            <g
              style={{
                offsetPath: 'path("M 60 250 Q 120 180 160 160 T 240 140 Q 280 120 340 80")',
                offsetDistance: `${routeProgress}%`,
                offsetRotate: 'auto',
              }}
              className="transition-all duration-100"
            >
              <circle r="6" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle r="12" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.5" className="animate-ping" />
            </g>

            {/* Location Icons */}
            <g transform="translate(50, 235)">
              <rect x="0" y="0" width="20" height="20" fill="#ef4444" rx="2" />
              <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A</text>
            </g>
            <g transform="translate(330, 65)">
              <rect x="0" y="0" width="20" height="20" fill="#10b981" rx="2" />
              <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">B</text>
            </g>
          </svg>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
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
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="text-blue-200 mt-2">Sign in to your account to continue</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-blue-200 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;