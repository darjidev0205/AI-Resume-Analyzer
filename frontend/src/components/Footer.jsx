import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-[#070b13] py-8 px-6 md:px-12 text-center text-brand-muted text-sm flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center">
          <Cpu className="w-3. h-3. text-white" />
        </div>
        <span className="font-bold text-white">
          ATS<span className="text-neon-blue">Scanner</span>
        </span>
      </div>
      <p className="text-xs">&copy; {new Date().getFullYear()} ATS Resume & Analysis platform. All rights reserved.</p>
      <div className="flex gap-4 text-xs">
        <a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-neon-blue transition-colors">Support</a>
      </div>
    </footer>
  );
}
