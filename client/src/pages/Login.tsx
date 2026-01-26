import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Ship, Users, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';

// VesselHaven Logo Component
function VHLogo({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-16 h-12' : size === 'md' ? 'w-12 h-9' : 'w-8 h-6';
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClass}
    >
      <defs>
        <linearGradient id="vhGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d6a96" />
          <stop offset="100%" stopColor="#4ecdc4" />
        </linearGradient>
      </defs>
      <path
        d="M5 10 L25 65 L40 35"
        stroke="url(#vhGradLogin)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M40 35 L55 65 L75 10"
        stroke="url(#vhGradLogin)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M48 45 L68 45"
        stroke="url(#vhGradLogin)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'owner' | 'crew' | 'guest' | 'vendor'>('owner');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    { id: 'owner', label: 'Owner', icon: Ship },
    { id: 'crew', label: 'Crew', icon: Users },
    { id: 'guest', label: 'Guest', icon: Compass },
    { id: 'vendor', label: 'Vendor', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-ocean-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ocean-500/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <VHLogo size="lg" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="text-white">VESSEL</span>
                <span className="text-ocean-400">HAVEN</span>
              </h1>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Intelligent Yacht Management
          </h2>
          <p className="text-lg text-navy-300 mb-8 max-w-md">
            AI-powered platform for yacht owners, crew, and guests. Plan voyages, manage services,
            and experience luxury yachting like never before.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-ocean-400/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-ocean-400" />
              </div>
              <div>
                <p className="text-white font-semibold">AI Concierge</p>
                <p className="text-sm text-navy-300">Intelligent voyage planning & recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-ocean-400/20 rounded-xl">
                <Ship className="w-6 h-6 text-ocean-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Fleet Management</p>
                <p className="text-sm text-navy-300">Complete vessel tracking & maintenance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-ocean-400/20 rounded-xl">
                <Users className="w-6 h-6 text-ocean-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Crew Coordination</p>
                <p className="text-sm text-navy-300">Seamless crew & vendor management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <VHLogo size="md" />
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-white">VESSEL</span>
                <span className="text-ocean-400">HAVEN</span>
              </h1>
            </div>
            <p className="text-navy-400 text-sm">Intelligent Yacht Management</p>
          </div>

          {/* Login Card */}
          <div className="bg-navy-900/50 backdrop-blur-lg rounded-2xl p-8 border border-navy-800">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-navy-400 mb-6">Sign in to your VesselHaven account</p>

            {/* User Type Selection */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setUserType(type.id as any)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    userType === type.id
                      ? 'bg-gradient-to-br from-navy-700 to-ocean-700 text-white ring-2 ring-ocean-400'
                      : 'bg-navy-800/50 text-navy-400 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-ocean-500 focus:ring-ocean-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-navy-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-ocean-400 hover:text-ocean-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 bg-gradient-to-r from-navy-600 to-ocean-600 hover:from-navy-500 hover:to-ocean-500 text-white font-semibold rounded-xl transition-all"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-navy-500 text-sm">
                Demo: Enter any email and password to explore
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-navy-800">
              <p className="text-center text-navy-400 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-ocean-400 hover:text-ocean-300 font-medium">
                  Request Access
                </a>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-navy-500">Yachts Managed</p>
            </div>
            <div className="w-px h-8 bg-navy-800" />
            <div>
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-navy-500">Marinas</p>
            </div>
            <div className="w-px h-8 bg-navy-800" />
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-navy-500">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
