import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, BarChart3, Clock, ArrowRight, Eye, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_resumes: 0,
    average_ats_score: 0,
    scans_this_month: 0,
    recent_resumes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/resume/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      setError('Could not retrieve dashboard statistics. Ensure your backend server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Your Dashboard</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your resumes and view your ATS scores.</p>
        </div>
        <Link
          to="/upload"
          className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 glow-cyan hover:scale-[1.03] transition-all"
        >
          <Plus className="w-5 h-5" /> Analyze New Resume
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-300 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-brand-card/40 rounded-2xl border border-brand-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-brand-border">
            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Total Resumes</span>
              <span className="text-4xl font-extrabold text-white mt-1 block">{stats.total_resumes}</span>
            </div>
            <div className="w-12 h-12 bg-neon-blue/10 border border-neon-blue/20 rounded-xl flex items-center justify-center text-neon-blue">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-brand-border">
            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Average ATS Score</span>
              <span className="text-4xl font-extrabold text-white mt-1 block">
                {stats.average_ats_score > 0 ? `${stats.average_ats_score}/100` : 'N/A'}
              </span>
            </div>
            <div className="w-12 h-12 bg-neon-purple/10 border border-neon-purple/20 rounded-xl flex items-center justify-center text-neon-purple">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-brand-border">
            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Scans This Month</span>
              <span className="text-4xl font-extrabold text-white mt-1 block">{stats.scans_this_month}</span>
            </div>
            <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center justify-center text-neon-green">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Resumes List Table/Cards */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border">
        <h2 className="text-xl font-bold text-white mb-6">Recent Uploads</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-brand-card/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : stats.recent_resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-brand-muted mb-4 opacity-50" />
            <p className="text-white font-medium">No resumes found</p>
            <p className="text-brand-muted text-sm mt-1 mb-6">Analyze your first resume to view details here.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-card hover:bg-brand-border text-white text-sm font-semibold rounded-xl border border-brand-border transition-all"
            >
              Upload PDF <Plus className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border pb-4">
                  <th className="pb-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">File Name</th>
                  <th className="pb-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Uploaded At</th>
                  <th className="pb-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Contact Name</th>
                  <th className="pb-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Primary Email</th>
                  <th className="pb-4 text-right pb-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {stats.recent_resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-white/5 transition-all group">
                    <td className="py-4 flex items-center gap-2 text-white font-semibold">
                      <FileText className="w-5 h-5 text-neon-blue" />
                      <span className="truncate max-w-[200px]" title={resume.filename}>{resume.filename}</span>
                    </td>
                    <td className="py-4 text-sm text-brand-muted">
                      {new Date(resume.uploaded_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 text-sm text-brand-muted">
                      {resume.parsed_data?.name || 'Unknown'}
                    </td>
                    <td className="py-4 text-sm text-brand-muted">
                      {resume.parsed_data?.email || 'N/A'}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => navigate(`/result?resumeId=${resume.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/20 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Eye className="w-4. h-4." /> View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
