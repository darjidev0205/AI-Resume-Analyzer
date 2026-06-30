import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, CheckCircle2, AlertCircle, Sparkles, Award, Star, Info, 
  Loader2, ArrowLeft, RefreshCw, Send, Download, Share2, Compare, 
  Check, ArrowRight, Zap, Target, BookOpen, Clock, Copy, Plus, 
  HelpCircle, ChevronDown, ChevronUp, Printer, Mail, Code
} from 'lucide-react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Count-up helper component for stats
function CountUp({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = typeof end === 'number' ? end : parseInt(end.replace(/\D/g, ''));
    if (start === endVal) return;
    
    const duration = 1500;
    const incrementTime = Math.max(Math.floor(duration / (endVal / 5)), 25);
    
    const timer = setInterval(() => {
      start += Math.ceil(endVal / 30);
      if (start >= endVal) {
        clearInterval(timer);
        setCount(endVal);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [end]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function ATSResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');

  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Job Matching Form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState('');

  // AI Coach interactive chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Resume Coach. I have analyzed your CV and layout details. How can I help you improve your score today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Copied state
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Active tab for details
  const [activeSegment, setActiveSegment] = useState('overview');

  const fetchResultData = async () => {
    if (!resumeId) {
      setError('Invalid URL parameters. Missing resume ID.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/resume/${resumeId}`);
      setResume(response.data);
      
      if (response.data.analysis_results && response.data.analysis_results.length > 0) {
        const sorted = [...response.data.analysis_results].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAnalysis(sorted[0]);
      }
      
      if (response.data.job_matches && response.data.job_matches.length > 0) {
        const sortedMatches = [...response.data.job_matches].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setMatchResult(sortedMatches[0]);
        setJobTitle(sortedMatches[0].job_title);
        setJobDesc(sortedMatches[0].job_description);
      }
    } catch (err) {
      setError('Could not retrieve analysis details. Verify the backend service status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultData();
  }, [resumeId]);

  const handleJobMatch = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) return;

    setMatchLoading(true);
    setMatchError('');
    setMatchResult(null);

    try {
      const formData = new FormData();
      formData.append('resume_id', resumeId);
      formData.append('job_title', jobTitle);
      formData.append('job_description', jobDesc);

      const response = await API.post('/resume/job-match', formData);
      setMatchResult(response.data);
    } catch (err) {
      setMatchError('Job matching calculation failed. Check backend endpoint.');
    } finally {
      setMatchLoading(false);
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    // Simulate AI response based on resume context
    setTimeout(() => {
      let reply = "Based on your formatting score, I recommend aligning your margins and structuring the experience section chronologically.";
      if (chatInput.toLowerCase().includes('score') || chatInput.toLowerCase().includes('ats')) {
        reply = `Your overall score is ${analysis?.ats_score || 70}%. You can raise it past 85% by addressing the missing keywords like ${analysis?.missing_keywords?.[0] || 'Cloud API'} and upgrading your action verbs.`;
      } else if (chatInput.toLowerCase().includes('format') || chatInput.toLowerCase().includes('layout')) {
        reply = "Your PDF layout is fully readable by parsers, but make sure to avoid using double-column formats as standard ATS engines prefer a single-column layout.";
      } else if (chatInput.toLowerCase().includes('keyword')) {
        reply = `I suggest inserting keywords like ${analysis?.missing_keywords?.slice(0, 3).join(', ') || 'Docker, AWS'} seamlessly inside your experience achievements.`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setChatLoading(false);
    }, 1200);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 bg-[#070B14]">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE] animate-spin" />
          <Cpu className="w-6 h-6 text-[#22D3EE] animate-pulse" />
        </div>
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">Running Deep ATS Analysis...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-bounce" />
        <h2 className="text-2xl font-black text-white">Analysis Failed</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{error || 'Resume details could not be found.'}</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E1628]/80 hover:bg-[#0E1628] border border-white/[0.08] rounded-2xl text-sm text-white transition-all hover:scale-[1.02]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const score = analysis?.ats_score || 0;
  const ratingStatus = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  const ratingColor = score >= 75 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : score >= 50 ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]';

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#070B14] text-white selection:bg-[#22D3EE]/30 pb-20">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 pt-6">
        
        {/* TOP ROW BREADCRUMB / ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 border border-white/[0.08] hover:border-[#22D3EE]/30 rounded-2xl bg-[#0E1628]/40 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white truncate max-w-[280px] sm:max-w-md" title={resume.filename}>
                  {resume.filename}
                </h1>
                <span className="px-2 py-0.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-md text-[9px] font-bold text-[#22D3EE] uppercase tracking-wider">PDF</span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">Uploaded on {new Date(resume.uploaded_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0E1628]/40 hover:bg-[#0E1628]/80 text-xs font-semibold text-slate-300 hover:text-white transition-all hover:scale-[1.02]">
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button className="flex-grow sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold text-xs hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.02]">
              <Sparkles className="w-4 h-4" /> Boost ATS Index
            </button>
          </div>
        </div>

        {!analysis ? (
          <div className="glass-card p-10 rounded-[32px] border border-white/[0.08] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
            <AlertCircle className="w-14 h-14 text-amber-400 mx-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.25)] animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No Analysis Result Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">We couldn't locate any scoring results for this resume. Start a fresh analysis.</p>
            </div>
            <button
              onClick={fetchResultData}
              className="px-6 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.02]"
            >
              Analyze Resume Now
            </button>
          </div>
        ) : (
          <>
            {/* HERO SCORE & OVERVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: ATS Metadata & Review Stats */}
              <div className="lg:col-span-8 glass-card rounded-[32px] p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#22D3EE]/5 rounded-full blur-3xl -z-10" />
                
                <div className="space-y-6">
                  {/* Badge & Headers */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-bold text-[#10B981] flex items-center gap-1 uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AI Analysis Complete
                      </span>
                      <span className="px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/25 rounded-full text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest">
                        ATS Ready
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      Recruiter Compatibility Review
                    </h2>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                    Our AI parser completed standard tests including keyword densities, section layouts, font hierarchies, and action-verb frequencies. Review the breakdown to target corporate ATS thresholds.
                  </p>
                </div>

                {/* Sub-Score Widgets grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/[0.04]">
                  {[
                    { label: 'Skills Coverage', val: analysis.skills_score, color: '#22D3EE' },
                    { label: 'Formatting', val: analysis.formatting_score, color: '#8B5CF6' },
                    { label: 'Experience Audit', val: analysis.experience_score, color: '#D946EF' },
                    { label: 'Education Value', val: analysis.education_score, color: '#10B981' }
                  ].map((sub, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{sub.label}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono">{sub.val}%</span>
                      </div>
                      <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sub.val}%`, backgroundColor: sub.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Score Gauge */}
              <div className="lg:col-span-4 glass-card rounded-[32px] p-6 sm:p-8 border border-white/[0.08] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] opacity-10 blur-3xl -z-10" />

                {/* Custom SVG Ring Gauge */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle cx="88" cy="88" r="76" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                    {/* Indicator Circle */}
                    <circle 
                      cx="88" 
                      cy="88" 
                      r="76" 
                      stroke="url(#resultGaugeGlow)" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={2*Math.PI*76} 
                      strokeDashoffset={2*Math.PI*76 - (score/100)*(2*Math.PI*76)} 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="resultGaugeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white font-mono leading-none">
                      <CountUp end={score} />
                    </span>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">ATS Index</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${ratingColor}`}>
                    {ratingStatus}
                  </span>
                  <p className="text-slate-400 text-xs px-4 mt-2 leading-relaxed">
                    {score >= 75
                      ? 'Excellent match rate. Fits core corporate requirements and parsing templates.'
                      : score >= 50
                      ? 'Good parameters. Align missing industry terminologies to hit 85%+ rating.'
                      : 'High parser failure risk. Formatting margins and styling segments need revisions.'}
                  </p>
                </div>
              </div>
            </div>

            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Keywords Density', val: `${analysis.matched_keywords?.length || 0} / ${(analysis.matched_keywords?.length || 0) + (analysis.missing_keywords?.length || 0)}`, icon: Target, desc: 'Target terminology matches', color: '#22D3EE' },
                { label: 'Layout Score', val: `${analysis.formatting_score}%`, icon: FileText, desc: 'Parser formatting safety', color: '#8B5CF6' },
                { label: 'Action Verbs', val: '8 / 10', icon: Zap, desc: 'Empirical bullet density', color: '#D946EF' },
                { label: 'AI Improvement Rating', val: '+18%', icon: Sparkles, desc: 'Estimated optimization delta', color: '#10B981' }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-[24px] p-5 border border-white/[0.06] flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] group-hover:bg-white/[0.02] rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-slate-400 group-hover:text-white transition-colors" style={{ '--tw-border-opacity': '0.1' }}>
                        <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-white font-mono">{kpi.val}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{kpi.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* SEGMENTED TABBED CONTENT CONTROLS */}
            <div className="flex border-b border-white/[0.06] pb-1 gap-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Analysis Overview' },
                { id: 'keywords', label: 'Terminology Saturation' },
                { id: 'rewrites', label: 'AI Bullet Enhancements' },
                { id: 'matcher', label: 'Job description Matcher' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSegment(tab.id)}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wider transition-all relative shrink-0 focus:outline-none ${
                    activeSegment === tab.id ? 'text-[#22D3EE]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeSegment === tab.id && (
                    <motion.div 
                      layoutId="result-active-line" 
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-[#22D3EE]" 
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT RENDERERS */}
            <AnimatePresence mode="wait">
              {activeSegment === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Strengths Card */}
                  <div className="glass-card rounded-[28px] p-6 border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2.5 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <h4 className="font-bold text-white text-base">Key Strengths</h4>
                    </div>
                    <ul className="space-y-4">
                      {analysis.strengths?.map((str, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-3 bg-white/[0.01] border border-white/[0.03] p-3.5 rounded-xl">
                          <span className="text-emerald-400 select-none font-bold">✔</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Card */}
                  <div className="glass-card rounded-[28px] p-6 border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2.5 text-rose-400">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-bold text-white text-base">Weaknesses</h4>
                    </div>
                    <ul className="space-y-4">
                      {analysis.weaknesses?.map((wk, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-3 bg-white/[0.01] border border-white/[0.03] p-3.5 rounded-xl">
                          <span className="text-rose-400 select-none font-bold">⚠</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable Tips Card */}
                  <div className="glass-card rounded-[28px] p-6 border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2.5 text-amber-400">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="font-bold text-white text-base">Roadmap Actions</h4>
                    </div>
                    <ul className="space-y-4">
                      {analysis.improvement_tips?.map((tip, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-3 bg-white/[0.01] border border-white/[0.03] p-3.5 rounded-xl">
                          <span className="text-amber-400 select-none font-bold">★</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSegment === 'keywords' && (
                <motion.div
                  key="keywords"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Matched Keywords */}
                  <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <h3 className="text-base font-bold text-white">Matched Industry Terms ({analysis.matched_keywords?.length || 0})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pr-2">
                      {analysis.matched_keywords?.length === 0 ? (
                        <span className="text-slate-500 text-xs">No matched keywords found.</span>
                      ) : (
                        analysis.matched_keywords?.map((kw, i) => (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.05)] cursor-default"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> {kw}
                          </motion.span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D946EF] shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                      <h3 className="text-base font-bold text-white">Missing Industry Gaps ({analysis.missing_keywords?.length || 0})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pr-2">
                      {analysis.missing_keywords?.length === 0 ? (
                        <span className="text-emerald-400 text-xs">Excellent! No major keyword voids detected.</span>
                      ) : (
                        analysis.missing_keywords?.map((kw, i) => (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            className="text-xs font-semibold text-[#D946EF] bg-[#D946EF]/10 border border-[#D946EF]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_8px_rgba(217,70,239,0.05)] cursor-default"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#D946EF]" /> {kw}
                          </motion.span>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSegment === 'rewrites' && (
                <motion.div
                  key="rewrites"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-white/[0.06] space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" /> AI Suggested Bullet-Point Upgrades
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">Copy and paste these optimized achievement lines to bypass standard verb scanners.</p>
                    </div>

                    <div className="space-y-4">
                      {analysis.recommended_bullet_points?.map((bullet, i) => (
                        <div key={i} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-start justify-between gap-4 group">
                          <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-[#8B5CF6] font-mono">{i + 1}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                              {bullet}
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(bullet, i)}
                            className="p-2 bg-[#0E1628]/60 hover:bg-[#22D3EE]/10 text-slate-400 hover:text-[#22D3EE] rounded-xl border border-white/[0.06] transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedIndex === i ? (
                              <span className="text-[10px] font-bold text-emerald-400 px-1">Copied</span>
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSegment === 'matcher' && (
                <motion.div
                  key="matcher"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 sm:p-8 rounded-[28px] border border-white/[0.08] shadow-2xl"
                >
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-white">Target Job Description Matcher</h3>
                    <p className="text-slate-400 text-xs mt-1">Check how well your CV aligns to standard corporate openings by pasting the target requirements below.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Input */}
                    <form onSubmit={handleJobMatch} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Target Job Title</label>
                        <input
                          type="text"
                          required
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. Lead React Architect"
                          className="w-full bg-[#0E1628]/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#22D3EE] transition-all text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Job Description Requirements</label>
                        <textarea
                          required
                          rows={6}
                          value={jobDesc}
                          onChange={(e) => setJobDesc(e.target.value)}
                          placeholder="Paste requirements, stack guidelines, or specifications..."
                          className="w-full bg-[#0E1628]/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#22D3EE] transition-all text-xs sm:text-sm resize-y"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={matchLoading}
                        className="px-6 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
                      >
                        {matchLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Calculating overlap...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Verify Compatibility Score
                          </>
                        )}
                      </button>
                    </form>

                    {/* Match Result Display */}
                    <div className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-6 flex flex-col justify-center min-h-[250px]">
                      {matchLoading ? (
                        <div className="text-center py-10 space-y-4 animate-pulse">
                          <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin mx-auto" />
                          <p className="text-slate-500 text-xs">Aligning profiles and estimating keyword densities...</p>
                        </div>
                      ) : matchResult ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Job Fit Index</span>
                              <h4 className="text-base font-bold text-white mt-0.5">{matchResult.job_title}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-[#22D3EE] block font-mono">{matchResult.match_score}%</span>
                              <span className="text-[10px] text-slate-500">Overlap</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">Matched Key Criteria</span>
                              <div className="flex flex-wrap gap-1.5">
                                {matchResult.matched_keywords?.length === 0 ? (
                                  <span className="text-xs text-slate-500">None found.</span>
                                ) : (
                                  matchResult.matched_keywords?.map((kw, i) => (
                                    <span key={i} className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-2 py-1 rounded">
                                      {kw}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-[#D946EF] uppercase tracking-wider block mb-2">Gaps / Voids</span>
                              <div className="flex flex-wrap gap-1.5">
                                {matchResult.missing_keywords?.length === 0 ? (
                                  <span className="text-xs text-emerald-400">None. Fully optimized!</span>
                                ) : (
                                  matchResult.missing_keywords?.map((kw, i) => (
                                    <span key={i} className="text-[10px] font-semibold text-[#D946EF] bg-[#D946EF]/5 border border-[#D946EF]/15 px-2 py-1 rounded">
                                      {kw}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-[#0E1628]/40 border border-white/[0.06] rounded-xl text-xs text-slate-400 leading-relaxed">
                            <span className="font-bold text-white block mb-1 text-[9px] uppercase tracking-wider text-[#8B5CF6]">AI Recruiter Feedback</span>
                            {matchResult.feedback}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-500 space-y-2">
                          <Info className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                          <p className="text-white font-bold text-xs">Run Compatibility Verification</p>
                          <p className="text-[11px] max-w-[250px] mx-auto leading-relaxed">Paste the job post text inside the left panel to verify keyword coverage values.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SPLIT SECTION: AI COACH & RESUME PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: AI Resume Coach */}
              <div className="lg:col-span-6 glass-card rounded-[32px] p-6 sm:p-8 border border-white/[0.08] flex flex-col h-[500px] justify-between relative shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-[#8B5CF6]" />
                    <h3 className="text-base font-bold text-white">Interactive AI Resume Coach</h3>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-4 border-b border-white/[0.06] pb-3">Discuss specific parsing issues or ask how to phrase experience bullet points.</p>
                </div>

                {/* Message Log */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-semibold' 
                          : 'bg-white/[0.03] border border-white/[0.06] text-slate-300'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Coach is typing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about formatting rules or keyword alignments..."
                    className="flex-grow bg-[#0E1628]/40 border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-all"
                  />
                  <button 
                    type="submit" 
                    className="p-3 bg-[#8B5CF6] hover:bg-[#9B6DF7] text-[#050816] rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>

              {/* Right Side: Actionable Roadmap & Priority Lists */}
              <div className="lg:col-span-6 glass-card rounded-[32px] p-6 sm:p-8 border border-white/[0.08] space-y-6 shadow-2xl">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#22D3EE]" /> Optimization Roadmap
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Suggested priority actions to maximize matching indicators.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { priority: 'High', action: 'Integrate missing cloud skills keywords', points: '+12 ATS', desc: 'Add terminologies like Docker, AWS, or Kubernetes.', time: '10 min', difficulty: 'Easy' },
                    { priority: 'Medium', action: 'Upgrade experience verb strengths', points: '+8 ATS', desc: 'Replace weak terms with impact-oriented verbs like orchestrated, executed.', time: '15 min', difficulty: 'Medium' },
                    { priority: 'Low', action: 'Verify section header readability margins', desc: 'Keep headers simple and standard (e.g. Experience, Education).', time: '5 min', difficulty: 'Easy' }
                  ].map((road, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-start gap-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider shrink-0 ${
                        road.priority === 'High' ? 'bg-red-500/10 border-red-500/25 text-red-400' : road.priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-slate-500/10 border-slate-500/25 text-slate-400'
                      }`}>
                        {road.priority}
                      </span>
                      <div className="space-y-2 flex-grow">
                        <div className="flex justify-between items-baseline">
                          <p className="font-bold text-xs text-white">{road.action}</p>
                          <span className="text-[10px] font-black text-[#22D3EE] font-mono">{road.points}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{road.desc}</p>
                        
                        <div className="flex gap-4 pt-1 text-[9px] font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {road.time}</span>
                          <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {road.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SIDE-BY-SIDE CURRENT VS IDEAL COMPARISON */}
            <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#D946EF]/5 rounded-full blur-3xl -z-10" />
              
              <div className="mb-8">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compare className="w-5 h-5 text-[#D946EF]" /> Structural Comparison
                </h3>
                <p className="text-slate-400 text-xs mt-1">Side-by-side assessment of parsed parameters vs standard recruitment thresholds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Resume */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Current Document</span>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Formatting Margins</span>
                      <span className="font-semibold text-white">Acceptable</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>ATS Header Structure</span>
                      <span className="font-semibold text-white">Readable</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Term Coverage Index</span>
                      <span className="font-semibold text-rose-400">Needs Addition ({analysis.missing_keywords?.length || 0} voids)</span>
                    </div>
                  </div>
                </div>

                {/* Ideal ATS Resume */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest">Ideal ATS Blueprint</span>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Formatting Margins</span>
                      <span className="font-semibold text-emerald-400">Standard 0.75" bounds</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>ATS Header Structure</span>
                      <span className="font-semibold text-emerald-400">Single-column tables</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Term Coverage Index</span>
                      <span className="font-semibold text-emerald-400">0 keyword gaps remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPORT OPTIONS FOOTER CARD */}
            <div className="glass-card rounded-[28px] p-6 border border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left bg-gradient-to-r from-white/[0.01] to-[#22D3EE]/5">
              <div>
                <h4 className="font-bold text-sm text-white">Export & Share Report</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Download full parsing score history or print compatibility summaries.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0E1628]/40 hover:bg-[#0E1628] text-xs font-semibold text-slate-300 transition-all hover:scale-105 cursor-pointer">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0E1628]/40 hover:bg-[#0E1628] text-xs font-semibold text-slate-300 transition-all hover:scale-105 cursor-pointer">
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0E1628]/40 hover:bg-[#0E1628] text-xs font-semibold text-slate-300 transition-all hover:scale-105 cursor-pointer">
                  <Code className="w-4 h-4" /> JSON
                </button>
              </div>
            </div>

          </>
        )}
      </div>

    </div>
  );
}
