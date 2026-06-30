import React from 'react';
import { Download, FileText, CheckCircle2, AlertCircle, FileSpreadsheet, Layers, Columns } from 'lucide-react';

export default function ResumeTemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "SaaS Professional (Recommended)",
      type: "Single-Column Layout",
      description: "Clean, chronologically ordered structure with high readability. Tested to be 100% compatible with modern parser engines.",
      tags: ["Tech", "Product", "Sales"],
      color: "border-neon-blue",
      tips: [
        "Use standard font sizes: 10-12pt for body, 14-16pt for titles.",
        "Ensure sections are ordered logically (Header -> Experience -> Projects -> Education -> Skills)."
      ]
    },
    {
      id: 2,
      name: "Minimalist Modern",
      type: "High Density Layout",
      description: "Optimized for candidates with extensive histories. Packs experience details efficiently without bloating page lengths.",
      tags: ["Engineering", "Research", "Finance"],
      color: "border-neon-purple",
      tips: [
        "Include quantifiable metrics in every work experience line.",
        "Avoid using charts, icons, or complex tables in the layout."
      ]
    },
    {
      id: 3,
      name: "Creative Hybrid",
      type: "Modern Elegant",
      description: "Features a clean left column for metadata/skills, and a wide right column for professional timelines.",
      tags: ["Design", "Marketing", "Consulting"],
      color: "border-neon-pink",
      tips: [
        "Perfect for human recruiters, but ensure parsing filters can scan it.",
        "Save as standard PDF formats to preserve structural text layers."
      ]
    }
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-white">ATS-Optimized Templates</h1>
        <p className="text-brand-muted text-sm mt-1">Free layouts and expert layout guidelines to maximize parsing efficiency.</p>
      </div>

      {/* Guide Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-neon-green" /> Why Layout Matters
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Most Applicant Tracking Systems (ATS) convert PDF uploads into plain text tables during processing. 
            If your resume uses complex multi-column tables, graphics, headers/footers, or text boxes, the parsing engine may misread and discard critical details.
          </p>
        </div>
        <div className="p-4 bg-brand-dark rounded-xl border border-brand-border space-y-2">
          <span className="text-xs font-semibold text-neon-blue uppercase tracking-wider block">Rule of Thumb</span>
          <p className="text-xs text-brand-muted leading-relaxed">
            "Keep it text-based and single-column. If you cannot copy and paste all text easily in order from top to bottom, the ATS scanner won't be able to either."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className={`glass-panel p-6 rounded-2xl border ${tpl.color} flex flex-col justify-between min-h-[420px] h-auto transition-all hover:scale-[1.02]`}>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-dark/80 rounded-xl flex items-center justify-center border border-brand-border">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">{tpl.type}</span>
                <h4 className="text-lg font-bold text-white mt-1">{tpl.name}</h4>
              </div>
              <p className="text-brand-muted text-xs leading-relaxed">{tpl.description}</p>
              
              {/* Key Tips */}
              <div className="border-t border-brand-border/40 pt-3">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider block mb-1">Key Tip</span>
                <ul className="space-y-1.5">
                  {tpl.tips.map((tip, idx) => (
                    <li key={idx} className="text-[11px] text-brand-muted flex items-start gap-1 leading-relaxed">
                      <span className="text-neon-blue font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-brand-border/40 mt-4">
              <div className="flex gap-1.5">
                {tpl.tags.map((t, idx) => (
                  <span key={idx} className="text-[9px] font-bold text-brand-muted bg-white/5 border border-brand-border px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => alert('Template download is a mockup. Copy this standard layout framework structure for your document.')}
                className="text-xs font-semibold text-white bg-brand-card hover:bg-brand-border border border-brand-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
