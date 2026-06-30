import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Cpu, CheckCircle2, Shield, Zap, Sparkles, ArrowRight, 
  Star, Check, HelpCircle, ChevronDown, ChevronUp, Play, 
  Activity, Heart, Award, ArrowUpRight, CheckSquare, Search, 
  Database, RefreshCw, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Count-up helper component for stats
function CountUp({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end.replace(/\D/g, ''));
    if (start === endVal) return;
    
    const duration = 2000;
    const incrementTime = Math.max(Math.floor(duration / (endVal / 5)), 30);
    
    const timer = setInterval(() => {
      start += Math.ceil(endVal / 40);
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

export default function LandingPage() {
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('overview');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#050816] text-white selection:bg-[#22D3EE]/30 selection:text-white">
      {/* Custom Styles Injection */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        @keyframes mesh-drift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .float-widget {
          animation: float 6s ease-in-out infinite;
        }
        .float-widget-delayed {
          animation: float-reverse 7s ease-in-out infinite;
        }
        .mesh-bg {
          background: radial-gradient(circle at 10% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 45%),
                      radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.08) 0%, transparent 50%);
          background-size: 200% 200%;
          animation: mesh-drift 15s ease infinite;
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .glass-card {
          background: rgba(14, 22, 40, 0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .glow-button {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }
        .glow-button:hover {
          box-shadow: 0 0 35px rgba(34, 211, 238, 0.6);
        }
      `}</style>

      {/* Decorative Glows & Background Animations */}
      <div className="absolute top-0 inset-x-0 h-[100vh] mesh-bg grid-bg -z-10 pointer-events-none" />
      
      {/* Radial circles of blur */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[120px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/5 blur-[150px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Star Field Effect */}
      <div className="absolute inset-0 opacity-30 -z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* HERO SECTION */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/5 text-[#22D3EE] text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
            >
              <Sparkle className="w-4 h-4 text-[#22D3EE] fill-[#22D3EE]/20 animate-spin" style={{ animationDuration: '4s' }} />
              AI-Powered Resume Optimization
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-xl"
            >
              Optimize Your Resume to Beat Every <br />
              <span className="bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent drop-shadow-sm">
                ATS System
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-lg"
            >
              AI-powered resume optimization that helps you pass applicant tracking systems, increase interview callbacks, and secure your dream career.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start"
            >
              {token ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold rounded-2xl flex items-center justify-center gap-2 glow-button transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold rounded-2xl flex items-center justify-center gap-2 glow-button transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Analyze Resume Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#preview"
                    className="px-8 py-4 rounded-2xl border border-white/[0.08] bg-[#0E1628]/40 hover:bg-[#0E1628]/80 text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.03]"
                  >
                    <Play className="w-4 h-4 fill-white" /> Watch Demo
                  </a>
                </>
              )}
            </motion.div>

            {/* Micro proof badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-6 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-xs text-slate-500"
            >
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-[#22D3EE]" /> No credit card required
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-[#8B5CF6]" /> GDPR & SOC2 Compliant
              </div>
            </motion.div>
          </div>

          {/* Hero Right Dashboard Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] opacity-20 blur-[80px]" />

            <div className="relative w-full max-w-[500px] h-[450px]">
              
              {/* Main Card (ATS Score Gauge) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute top-8 left-4 w-[280px] glass-card rounded-3xl p-6 shadow-2xl z-20 border border-white/[0.08] float-widget"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Score</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] rounded-lg text-[9px] font-bold">Excellent</span>
                </div>
                
                {/* SVG Radial Gauge */}
                <div className="flex flex-col items-center justify-center my-4">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                      <circle cx="56" cy="56" r="48" stroke="url(#heroGauge)" strokeWidth="8" fill="transparent" strokeDasharray={2*Math.PI*48} strokeDashoffset={2*Math.PI*48 - 0.92*(2*Math.PI*48)} />
                      <defs>
                        <linearGradient id="heroGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22D3EE" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">92</span>
                      <span className="text-slate-500 text-[9px]">ATS index</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.04] flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Match score increased</span>
                  <span className="text-xs font-bold text-[#22D3EE] flex items-center">+18% 🔥</span>
                </div>
              </motion.div>

              {/* Card 2 (Keyword Match %) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute top-36 right-4 w-[240px] glass-card rounded-3xl p-5 shadow-2xl z-30 border border-white/[0.08] float-widget-delayed"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400">Keyword Density</span>
                  <span className="text-xs font-bold text-[#8B5CF6]">88% Match</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>React & Next.js</span>
                      <span>Matched</span>
                    </div>
                    <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#22D3EE] h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>FastAPI Backend</span>
                      <span>Matched</span>
                    </div>
                    <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>MongoDB / SQL</span>
                      <span>Missing</span>
                    </div>
                    <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 (Resume Preview/Suggestions) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-2 left-16 w-[320px] glass-card rounded-3xl p-5 shadow-2xl z-10 border border-white/[0.08]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-[#D946EF]" />
                  <span className="text-xs font-bold text-slate-300">AI Coach Coach Insights</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-[11px] leading-relaxed text-slate-400 space-y-1">
                  <p className="font-semibold text-white">Action Verb Upgrade Needed</p>
                  <p>Change <span className="text-red-400 line-through">"Responsible for managing team"</span> to <span className="text-[#22D3EE] font-bold">"Orchestrated a 12-person cross-functional team"</span> to boost impact score by 25 points.</p>
                </div>
              </motion.div>

              {/* Floating tech icons */}
              <div className="absolute top-2 left-1/2 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-lg float-widget">
                <span className="text-[10px] font-bold text-slate-400">Py</span>
              </div>
              <div className="absolute top-24 left-0 w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-lg float-widget-delayed">
                <FileText className="w-5 h-5 text-[#22D3EE]" />
              </div>
              <div className="absolute bottom-20 right-8 w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center shadow-lg float-widget">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STATISTICS */}
      <div className="border-y border-white/[0.04] bg-[#0E1628]/20 backdrop-blur-3xl py-16 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <div className="pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                <CountUp end="100,000" suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 uppercase tracking-widest font-semibold">Resumes Scanned</div>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                <CountUp end="98" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 uppercase tracking-widest font-semibold">ATS Success Rate</div>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                <CountUp end="50,000" suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 uppercase tracking-widest font-semibold">Interview Calls</div>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex justify-center items-center gap-1">
                <span>4.9</span>
                <span className="text-amber-400 text-3xl">★</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 uppercase tracking-widest font-semibold">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: HOW IT WORKS */}
      <div className="py-28 relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Optimisation Flow</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">How ATS Scanner Works</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">Transform your career path through our highly sophisticated step-by-step intelligence pipeline.</p>
        </div>

        <div className="relative">
          {/* Timeline Connector Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-[#22D3EE]/20 via-[#8B5CF6]/20 to-[#D946EF]/20 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {[
              { num: '01', title: 'Upload Resume', desc: 'Securely upload your resume in PDF format.', color: 'border-[#22D3EE]/30 text-[#22D3EE] bg-[#22D3EE]/5' },
              { num: '02', title: 'AI Parsing', desc: 'Extractor decodes formatting and content structure.', color: 'border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/5' },
              { num: '03', title: 'ATS Analysis', desc: 'Resume runs through layout scanner checks.', color: 'border-[#D946EF]/30 text-[#D946EF] bg-[#D946EF]/5' },
              { num: '04', title: 'Keyword Match', desc: 'We verify density against target job profiles.', color: 'border-[#22D3EE]/30 text-[#22D3EE] bg-[#22D3EE]/5' },
              { num: '05', title: 'AI Improvement', desc: 'Get customized action suggestions.', color: 'border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/5' },
              { num: '06', title: 'Download PDF', desc: 'Get your fully optimized, recruiter-ready CV.', color: 'border-[#D946EF]/30 text-[#D946EF] bg-[#D946EF]/5' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="glass-card rounded-[24px] p-6 border border-white/[0.06] flex flex-col justify-between min-h-[220px] relative group"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold ${step.color}`}>
                  {step.num}
                </div>
                <div className="space-y-2 mt-6">
                  <h4 className="text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors">{step.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: FEATURES BENTO GRID */}
      <div className="py-24 border-t border-white/[0.04] bg-[#0E1628]/10 backdrop-blur-3xl relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-bold text-[#22D3EE] uppercase tracking-widest">Premium Features</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">Engineered for Elite Results</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">Everything you need to bypass filters and land corporate offers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Card 1: ATS Scanner (Double Width) */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#22D3EE]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#22D3EE]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#22D3EE]/10 transition-colors" />
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-white">Heuristic ATS Scanner</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our system performs semantic assessments based on recruitment standard models, verifying formatting compatibility, section headers, readability, and sizing parameters.
                </p>
              </div>
            </div>

            {/* Card 2: OpenAI Review */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">OpenAI Assessment</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Leverages state-of-the-art LLMs to evaluate section content and suggest punchy achievements.
                </p>
              </div>
            </div>

            {/* Card 3: Keyword Analysis */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#D946EF]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D946EF]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D946EF]/10 border border-[#D946EF]/20 flex items-center justify-center text-[#D946EF]">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">Keyword Saturations</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Scours your PDF to map and highlight matched vs missing industry terms instantly.
                </p>
              </div>
            </div>

            {/* Card 4: Job Description Match (Double Width) */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#22D3EE]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#22D3EE]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-white">Target Role Matching</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Paste target descriptions to receive a precise match percentage and tailored optimization tips to rank high in recruiter dashboards.
                </p>
              </div>
            </div>

            {/* Card 5: Resume Templates */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">ATS-friendly Templates</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Browse optimized resume designs built specifically to satisfy parser restrictions.
                </p>
              </div>
            </div>

            {/* Card 6: PDF Parser */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#D946EF]/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D946EF]/10 border border-[#D946EF]/20 flex items-center justify-center text-[#D946EF]">
                  <Database className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">Layout PDF Parser</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Advanced text/content extraction tool pulls content layout and data sections reliably.
                </p>
              </div>
            </div>

            {/* Card 7: AI Resume Coach */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#22D3EE]/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">AI Resume Coach</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Discuss results directly with our integrated AI assistant to refine your CV layout.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 5: LIVE DASHBOARD PREVIEW */}
      <div id="preview" className="py-28 relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-[#D946EF] uppercase tracking-widest">Dashboard</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">The Intelligence Center</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">Preview the analytics panel you get once you run your first resume upload.</p>
        </div>

        <div className="glass-card rounded-[32px] overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col md:flex-row h-auto md:h-[600px]">
          {/* Dashboard Preview Sidebar */}
          <div className="w-full md:w-60 bg-[#0E1628]/40 border-b md:border-b-0 md:border-r border-white/[0.06] p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">ATS<span className="text-[#22D3EE] font-medium">Scanner</span></span>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button onClick={() => setActiveTab('overview')} className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-slate-400 hover:text-white'}`}>
                <Activity className="w-4 h-4" /> Overview
              </button>
              <button onClick={() => setActiveTab('keywords')} className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'keywords' ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-slate-400 hover:text-white'}`}>
                <Search className="w-4 h-4" /> Keywords
              </button>
              <button onClick={() => setActiveTab('coach')} className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'coach' ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-slate-400 hover:text-white'}`}>
                <Sparkles className="w-4 h-4" /> AI Insights
              </button>
            </nav>
          </div>

          {/* Dashboard Preview Content */}
          <div className="flex-1 p-6 md:p-8 bg-[#0E1628]/10 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-lg text-white">Assessment Overview</h5>
                    <span className="text-xs text-slate-500">Updated just now</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">ATS Rating</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">92</span>
                        <span className="text-slate-500 text-xs">/ 100</span>
                      </div>
                      <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#22D3EE] h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Resume Health</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">96%</span>
                      </div>
                      <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>
                    <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Keyword Density</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">88%</span>
                      </div>
                      <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#D946EF] h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-4">
                    <span className="text-xs font-bold text-slate-400">Score History Trend</span>
                    <div className="h-40 flex items-end gap-3 pt-6">
                      {[65, 72, 78, 85, 92].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <div className="bg-gradient-to-t from-[#8B5CF6] to-[#22D3EE] rounded-t-lg w-full transition-all duration-500 hover:brightness-110" style={{ height: `${h}%` }} />
                          <span className="text-[9px] text-slate-500 font-bold">Ver {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'keywords' && (
                <motion.div 
                  key="keywords"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h5 className="font-bold text-lg text-white">Keyword coverage</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 block border-b border-white/[0.04] pb-1.5">Matched (8)</span>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'FastAPI', 'Python', 'Tailwind CSS', 'Framer Motion', 'Git', 'Docker'].map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] rounded-full text-xs font-semibold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 block border-b border-white/[0.04] pb-1.5">Missing (3)</span>
                      <div className="flex flex-wrap gap-2">
                        {['Redis Caching', 'Kubernetes Orchestration', 'CI/CD Pipelines'].map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] rounded-full text-xs font-semibold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'coach' && (
                <motion.div 
                  key="coach"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h5 className="font-bold text-lg text-white">AI Coach Insights</h5>
                  <div className="space-y-3">
                    {[
                      { priority: 'High', title: 'Add metrics to experience bullet points', desc: 'Recruiters want quantitative proof. Change "managed software releases" to "coordinated 15+ microservices deployments increasing uptime to 99.9%".' },
                      { priority: 'Medium', title: 'Highlight cloud orchestration architecture', desc: 'Your profile has keywords matching Kubernetes but lacks visual details on system topology designs.' },
                      { priority: 'Low', title: 'Optimize PDF structure margins', desc: 'Slightly reduce top margins to keep the file structure strictly single-page format.' }
                    ].map((tip, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-start gap-4 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${tip.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : tip.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                          {tip.priority}
                        </span>
                        <div className="space-y-1">
                          <p className="font-bold text-white">{tip.title}</p>
                          <p className="text-slate-400 leading-relaxed">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SECTION 6: TESTIMONIALS */}
      <div className="py-24 border-t border-white/[0.04] bg-[#0E1628]/10 backdrop-blur-3xl relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Testimonials</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">Trusted by Top Talents</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">Read stories from developers and designers who secured offers at global companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Senior React Developer', company: 'Stripe', text: 'ATS Scanner completely changed my job hunting game. I went from zero responses to getting calls from Stripe and Netflix within a week of optimizing my keywords.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
              { name: 'David Chen', role: 'Full Stack Engineer', company: 'OpenAI', text: 'The AI Resume Coach provided highly specific suggestions that were spot on. Upgrading my action verbs boosted my score to 95 and directly landed my interview.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
              { name: 'Elena Rostova', role: 'Backend Lead', company: 'Linear', text: 'An absolute masterpiece of design and logic. The bento grid feature mappings show exactly what recruiters care about. Highly recommended.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="glass-card rounded-[24px] p-6 border border-white/[0.06] flex flex-col justify-between"
              >
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/[0.04]">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full border border-white/[0.1] object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{t.name}</h5>
                    <p className="text-[10px] text-slate-400">{t.role} • <span className="text-[#22D3EE]">{t.company}</span></p>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7: COMPANIES */}
      <div className="py-16 border-t border-white/[0.04] bg-[#050816] relative z-10">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-10">Trusted by Professionals from Elite Tech Hubs</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-30 grayscale contrast-200">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Stripe', 'OpenAI'].map((comp, idx) => (
              <span key={idx} className="text-lg font-black tracking-tighter text-white hover:opacity-100 transition-opacity cursor-default">
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: PRICING */}
      <div className="py-28 border-t border-white/[0.04] bg-[#0E1628]/10 backdrop-blur-3xl relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Pricing</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">Find Your Fit</h3>
            
            {/* Toggle monthly/yearly */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <span className={`text-xs ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setBillingPeriod(p => p === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 bg-white/[0.06] rounded-full border border-white/[0.1] relative p-0.5 transition-all focus:outline-none"
              >
                <div className={`w-5 h-5 bg-[#22D3EE] rounded-full transition-all ${billingPeriod === 'yearly' ? 'translate-x-6' : ''}`} />
              </button>
              <span className={`text-xs ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'} flex items-center gap-1.5`}>
                Yearly <span className="px-1.5 py-0.5 bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-md text-[9px] font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="glass-card rounded-[32px] p-8 border border-white/[0.06] flex flex-col justify-between min-h-[480px]">
              <div>
                <h4 className="text-base font-bold text-white">Basic Starter</h4>
                <p className="text-slate-400 text-xs mt-2">Perfect for starting optimization.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/[0.04]">
                  {['1 Resume Parse / month', 'Basic Score Breakdown', 'Common keyword coverage'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#22D3EE] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-xl text-xs font-bold text-center mt-8 block transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card rounded-[32px] p-8 border-2 border-[#8B5CF6]/60 flex flex-col justify-between min-h-[480px] relative">
              <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] rounded-full text-[10px] font-bold uppercase tracking-wider">Best Value</span>
              <div>
                <h4 className="text-base font-bold text-white">Professional</h4>
                <p className="text-slate-400 text-xs mt-2">Get fully optimized instantly.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">{billingPeriod === 'monthly' ? '$19' : '$15'}</span>
                  <span className="text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/[0.04]">
                  {['Unlimited PDF Parses', 'Advanced OpenAI Review', 'Full missing keyword saturation', 'Discuss suggestions with AI Coach', 'Export ATS-friendly templates'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-[#8B5CF6] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="w-full py-3.5 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-bold rounded-xl text-xs text-center mt-8 block transition-all glow-button">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card rounded-[32px] p-8 border border-white/[0.06] flex flex-col justify-between min-h-[480px]">
              <div>
                <h4 className="text-base font-bold text-white">Enterprise Elite</h4>
                <p className="text-slate-400 text-xs mt-2">For professional coaching academies.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">{billingPeriod === 'monthly' ? '$49' : '$39'}</span>
                  <span className="text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/[0.04]">
                  {['Everything in Pro', 'Custom API access points', 'Priority parsing server queues', 'Dedicated support SLA'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#D946EF] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-xl text-xs font-bold text-center mt-8 block transition-all">
                Contact Enterprise
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 9: FAQ */}
      <div className="py-24 border-t border-white/[0.04] relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-[#22D3EE] uppercase tracking-widest">FAQ</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {[
            { q: 'How does the ATS Scanner evaluate my resume?', a: 'Our scanner evaluates section divisions, readability patterns, styling hierarchies, font styling sizes, and keyword saturation ratios using the same standards built into leading corporate ATS suites.' },
            { q: 'Is my personal data kept secure?', a: 'Absolutely. We store files using encryption paradigms and do not distribute personal details to third parties. You can purge your resumes from our databases at any time.' },
            { q: 'Can I test my resume against specific roles?', a: 'Yes. The Job Description Matching feature lets you check your CV alignment against target job posts to get a precise keyword coverage score.' },
            { q: 'What AI engine drives the Coaching insights?', a: 'Our recommendation engine leverages advanced OpenAI API models to verify semantic context and generate high-impact suggestions.' },
          ].map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full p-5 text-left font-bold text-white flex items-center justify-between hover:bg-white/[0.01] transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                {faqOpen[i] ? <ChevronUp className="w-4 h-4 text-[#22D3EE]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {faqOpen[i] && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/[0.03]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
