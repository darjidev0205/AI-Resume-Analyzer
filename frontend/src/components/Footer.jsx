import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#050816] pt-16 pb-8 px-6 md:px-12 relative overflow-hidden z-10">
      
      {/* Top thin gradient divider line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent blur-[1px]" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-4 mb-12">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-base text-white">
              ATS<span className="text-[#22D3EE] font-semibold">Scanner</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The next-generation semantic intelligence platform built to maximize resume compatibility scoring and secure interview callbacks.
          </p>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform</span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">ATS Scanner</a></li>
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">AI Resume Coach</a></li>
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">PDF Extractor</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal</span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">SLA Guidelines</a></li>
            </ul>
          </div>
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="mailto:support@atsscanner.ai" className="hover:text-[#22D3EE] transition-colors">support@atsscanner.ai</a></li>
              <li><a href="#" className="hover:text-[#22D3EE] transition-colors">API Integration docs</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Socials */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
        <p className="text-[11px]">&copy; {new Date().getFullYear()} ATS Scanner AI. Engineered by Antigravity.</p>
        
        <div className="flex gap-6 text-[11px] items-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a>
        </div>
      </div>
    </footer>
  );
}
