import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Cpu, CheckCircle2, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const token = localStorage.getItem('token');

  return (
    <div className="relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-neon-blue/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto py-12 md:py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-neon-blue text-sm font-semibold mb-6 animate-pulse"
        >
          <Sparkles className="w-4 h-4" /> Powered by Advanced AI parsing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
        >
          Optimize Your Resume to <br />
          <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Beat the ATS Systems
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-brand-muted max-w-2xl mb-10"
        >
          Upload your resume, find missing keywords, match job descriptions, and generate AI improvements to land your dream job interviews.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {token ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-bold text-white flex items-center gap-2 glow-cyan hover:scale-105 transition-all duration-300"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-bold text-white flex items-center gap-2 glow-cyan hover:scale-105 transition-all duration-300"
              >
                Scan Your Resume <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl border border-brand-border bg-brand-card/50 text-white font-bold hover:bg-brand-card hover:border-neon-blue/30 transition-all duration-300"
              >
                Learn More
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-12 md:mt-24 max-w-6xl mx-auto w-full px-4">
        {/* Feature 1 */}
        <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-neon-blue" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Resume Analysis</h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Get an in-depth breakdown of your resume score. OpenAI rates your summary, work experience bullets, formatting, and technical skills instantly.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="text-xl font-bold text-white">Keyword Matching</h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Paste target job descriptions and analyze the match index. Discover exactly which keywords and key technologies recruiters are looking for.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-neon-pink" />
          </div>
          <h3 className="text-xl font-bold text-white">Bullet-Point Rewriting</h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Automatically transform passive experience phrases into high-impact, quantified achievements backed by strong action verbs.
          </p>
        </div>
      </div>

      {/* Trust Badges / Stats */}
      <div className="mt-16 md:mt-32 max-w-5xl mx-auto border-t border-brand-border/60 pt-16 pb-12 w-full text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">25k+</div>
            <div className="text-xs md:text-sm text-brand-muted mt-2 uppercase font-medium">Resumes Scanned</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">83%</div>
            <div className="text-xs md:text-sm text-brand-muted mt-2 uppercase font-medium">Interview Rate Increase</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">&lt; 10s</div>
            <div className="text-xs md:text-sm text-brand-muted mt-2 uppercase font-medium">Average Parse Time</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">100%</div>
            <div className="text-xs md:text-sm text-brand-muted mt-2 uppercase font-medium">Privacy Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
