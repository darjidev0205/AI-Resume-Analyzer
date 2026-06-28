import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, LayoutDashboard, Upload, BookOpen, User, LogOut, Cpu } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-brand-border py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center glow-cyan transition-transform group-hover:scale-105 duration-300">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white hidden sm:inline-block">
          ATS<span className="text-neon-blue font-medium">Scanner</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 md:gap-6">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            <Link
              to="/upload"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/upload')
                  ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">Upload Resume</span>
            </Link>

            <Link
              to="/templates"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/templates')
                  ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Templates</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/profile')
                  ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{user.full_name || 'Profile'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-brand-muted hover:text-white px-4 py-2 text-sm font-medium transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-5 py-2 rounded-lg text-sm font-semibold glow-cyan hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
