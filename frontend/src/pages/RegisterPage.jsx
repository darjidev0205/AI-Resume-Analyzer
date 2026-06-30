import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      });

      const { access_token, user } = response.data;
      login(access_token, user);

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Failed to connect to the backend server. Please verify it is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 md:my-20 px-4 w-full">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-brand-border shadow-neon relative">
        {/* Glow Element */}
        <div className="absolute top-0 right-10 w-20 h-20 bg-neon-blue/20 blur-xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
          <p className="text-brand-muted text-sm">Join to analyze and optimize your resume for ATS.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-11 pr-4 text-white placeholder-brand-muted focus:outline-none focus:border-neon-blue transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-11 pr-4 text-white placeholder-brand-muted focus:outline-none focus:border-neon-blue transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-11 pr-4 text-white placeholder-brand-muted focus:outline-none focus:border-neon-blue transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all glow-cyan disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> Register
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-purple hover:underline font-medium">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
