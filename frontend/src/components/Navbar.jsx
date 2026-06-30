import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cpu, LayoutDashboard, Upload, BookOpen, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Custom magnetic links list
  const mainLinks = token ? [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/upload', label: 'Upload Resume', icon: Upload },
    { path: '/templates', label: 'Templates', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ] : [
    { path: '/', label: 'Home' },
    { path: '/#features', label: 'Features' },
    { path: '/#pricing', label: 'Pricing' },
  ];

  return (
    <div className="w-full flex justify-center px-4 pt-4 sticky top-0 z-[9999] pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-6xl rounded-full border border-white/[0.08] bg-[#0E1628]/60 backdrop-blur-xl px-6 py-3 shadow-2xl flex justify-between items-center transition-all duration-300">
        
        {/* Logo with Glow animation */}
        <Link to="/" className="flex items-center gap-2.5 group relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D946EF] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Cpu className="w-4.5 h-4.5 text-white relative z-10" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            ATS<span className="text-[#22D3EE] font-semibold">Scanner</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-4">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredLink(link.path)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1.5 transition-colors duration-300 ${
                  active ? 'text-[#22D3EE]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="hidden md:inline">{link.label}</span>
                
                {/* Sliding sliding underline */}
                {hoveredLink === link.path && (
                  <motion.div
                    layoutId="navbar-hover-underline"
                    className="absolute inset-0 bg-white/[0.04] rounded-full border border-white/[0.04] -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}

          {token ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/15 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-slate-300 hover:text-white px-4 py-2 font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
