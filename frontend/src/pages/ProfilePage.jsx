import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, Key, Shield, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_resumes: 0,
    average_ats_score: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/resume/dashboard-stats');
        setStats({
          total_resumes: response.data.total_resumes,
          average_ats_score: response.data.average_ats_score
        });
      } catch (err) {
        console.error('Failed to load stats for profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10 px-4 w-full">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Your Profile</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your account credentials and see platform stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side Info Card */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-border md:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-brand-border/60 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-neon-blue" /> Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Full Name</span>
              <span className="text-base font-bold text-white mt-1 block">{user?.name || user?.full_name || 'N/A'}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Email Address</span>
              <span className="text-base font-bold text-white mt-1 block">{user?.email || 'N/A'}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Account Status</span>
              <span className="text-xs font-semibold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Standard Member
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Stats Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col justify-between h-[250px]">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-neon-purple" /> Scan Activity
          </h3>

          <div className="space-y-4 my-auto">
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-muted">Resumes Checked</span>
              <span className="font-bold text-white text-base">{loading ? '...' : stats.total_resumes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-muted">Avg Compatibility</span>
              <span className="font-bold text-neon-purple text-base">
                {loading ? '...' : stats.average_ats_score > 0 ? `${stats.average_ats_score}%` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="border-t border-brand-border/40 pt-4 text-center">
            <span className="text-[10px] text-brand-muted leading-relaxed block">
              You have a full-access account, enabling infinite local and standard scans.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
