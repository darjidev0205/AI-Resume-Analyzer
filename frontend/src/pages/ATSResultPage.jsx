import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { FileText, CheckCircle2, AlertCircle, Sparkles, Award, Star, Info, Loader2, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import API from '../services/api';
import ScoreCircle from '../components/ScoreCircle';

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
        // Take latest analysis
        const sorted = [...response.data.analysis_results].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAnalysis(sorted[0]);
      }
      
      // If there are job matches, default the latest job match result
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
        <p className="text-brand-muted text-sm">Loading ATS report statistics...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Analysis Failed</h2>
        <p className="text-brand-muted text-sm">{error || 'Resume details could not be found.'}</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-brand-card hover:bg-brand-border rounded-xl text-sm border border-brand-border text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Preformat data for Recharts breakdown
  const chartData = analysis
    ? [
        { name: 'Summary', score: analysis.summary_score, fill: '#8884d8' },
        { name: 'Skills', score: analysis.skills_score, fill: '#82ca9d' },
        { name: 'Experience', score: analysis.experience_score, fill: '#ffc658' },
        { name: 'Education', score: analysis.education_score, fill: '#ff8042' },
        { name: 'Format', score: analysis.formatting_score, fill: '#00f0ff' }
      ]
    : [];

  return (
    <div className="space-y-10">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 border border-brand-border hover:border-neon-blue/30 rounded-xl bg-brand-card text-brand-muted hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white truncate max-w-[400px]" title={resume.filename}>
            {resume.filename}
          </h1>
          <p className="text-brand-muted text-xs">Uploaded {new Date(resume.uploaded_at).toLocaleString()}</p>
        </div>
      </div>

      {/* If resume is parsed but not analyzed */}
      {!analysis ? (
        <div className="glass-panel p-8 rounded-2xl border border-brand-border text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Analysis Result Available</h3>
          <p className="text-brand-muted text-sm">We couldn't locate any scoring results for this resume. Start a scan.</p>
          <button
            onClick={fetchResultData}
            className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold rounded-xl"
          >
            Run New Analysis
          </button>
        </div>
      ) : (
        <>
          {/* Row 1: Scores and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Circle Card */}
            <div className="glass-panel p-8 rounded-2xl border border-brand-border flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple" />
              <ScoreCircle score={analysis.ats_score} size={200} />
              
              <div className="mt-6 text-center">
                <span className="text-sm font-semibold text-brand-muted">Overall Compatibility</span>
                <p className="text-xs text-brand-muted mt-2 max-w-[250px] leading-relaxed">
                  {analysis.ats_score >= 75
                    ? 'Excellent layout and keywords match. High probability of passing recruiter filters.'
                    : analysis.ats_score >= 50
                    ? 'Good baseline. Optimize missing skills and bullet points to maximize score.'
                    : 'Critical issues detected. Complete missing details and format elements.'}
                </p>
              </div>
            </div>

            {/* Score breakdown Chart */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">ATS Metric Breakdown</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#121826', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      itemStyle={{ color: '#00f0ff' }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Matched & Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matched Keywords */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />
                <h3 className="text-lg font-bold text-white">Matched Keywords ({analysis.matched_keywords?.length || 0})</h3>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
                {analysis.matched_keywords?.length === 0 ? (
                  <span className="text-brand-muted text-sm">No matched keywords found.</span>
                ) : (
                  analysis.matched_keywords?.map((kw, i) => (
                    <span key={i} className="text-xs font-semibold text-neon-green bg-neon-green/10 border border-neon-green/20 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-pink" />
                <h3 className="text-lg font-bold text-white">Missing Keywords ({analysis.missing_keywords?.length || 0})</h3>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
                {analysis.missing_keywords?.length === 0 ? (
                  <span className="text-brand-muted text-sm">Excellent! No major missing keywords.</span>
                ) : (
                  analysis.missing_keywords?.map((kw, i) => (
                    <span key={i} className="text-xs font-semibold text-neon-pink bg-neon-pink/10 border border-neon-pink/20 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Strengths, Weaknesses and Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Strengths */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-2 mb-4 text-neon-green">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="font-bold text-white">Strengths</h4>
              </div>
              <ul className="space-y-3">
                {analysis.strengths?.map((str, i) => (
                  <li key={i} className="text-sm text-brand-muted flex items-start gap-2">
                    <span className="text-neon-green select-none mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-2 mb-4 text-neon-pink">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-bold text-white">Weaknesses</h4>
              </div>
              <ul className="space-y-3">
                {analysis.weaknesses?.map((wk, i) => (
                  <li key={i} className="text-sm text-brand-muted flex items-start gap-2">
                    <span className="text-neon-pink select-none mt-0.5">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Tips */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-2 mb-4 text-neon-yellow">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-bold text-white">Actionable Tips</h4>
              </div>
              <ul className="space-y-3">
                {analysis.improvement_tips?.map((tip, i) => (
                  <li key={i} className="text-sm text-brand-muted flex items-start gap-2">
                    <span className="text-neon-yellow select-none mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 4: Recommended Bullet Points */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-neon-yellow" /> Recommended Bullet-Point Rewrites
            </h3>
            <div className="space-y-4">
              {analysis.recommended_bullet_points?.map((bullet, i) => (
                <div key={i} className="p-4 bg-brand-dark/50 border border-brand-border rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-neon-purple font-mono">{i + 1}</span>
                  </div>
                  <p className="text-sm text-brand-muted italic leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Description Matcher Section */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-border" id="job-match-section">
            <h3 className="text-lg font-bold text-white mb-2">Job Description Matcher</h3>
            <p className="text-brand-muted text-sm mb-6">Paste the description of the role you are targeting to verify how well this resume matches the criteria.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Input */}
              <form onSubmit={handleJobMatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior React Developer"
                    className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 px-4 text-white placeholder-brand-muted focus:outline-none focus:border-neon-blue transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Job Description / Requirements</label>
                  <textarea
                    required
                    rows={8}
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job description or requirements section here..."
                    className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 px-4 text-white placeholder-brand-muted focus:outline-none focus:border-neon-blue transition-all text-sm resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={matchLoading}
                  className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {matchLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Matching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Compare Compatibility
                    </>
                  )}
                </button>
              </form>

              {/* Match Result Display */}
              <div className="border border-brand-border/60 bg-brand-dark/30 rounded-2xl p-6 flex flex-col justify-center min-h-[300px]">
                {matchLoading ? (
                  <div className="text-center py-12 space-y-4 animate-pulse">
                    <Loader2 className="w-8 h-8 text-neon-purple animate-spin mx-auto" />
                    <p className="text-brand-muted text-sm">Matching profiles and calculating overlap...</p>
                  </div>
                ) : matchResult ? (
                  <div className="space-y-6">
                    {/* Score Gauge header */}
                    <div className="flex items-center justify-between border-b border-brand-border pb-4">
                      <div>
                        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Job Fit Rating</span>
                        <h4 className="text-lg font-bold text-white mt-0.5">{matchResult.job_title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold text-neon-blue block font-mono">{matchResult.match_score}%</span>
                        <span className="text-xs text-brand-muted">compatibility</span>
                      </div>
                    </div>

                    {/* Keywords lists */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-neon-green uppercase tracking-wider block mb-2">Matched Key Criteria</span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.matched_keywords?.length === 0 ? (
                            <span className="text-xs text-brand-muted">None found.</span>
                          ) : (
                            matchResult.matched_keywords?.map((kw, i) => (
                              <span key={i} className="text-[10px] font-semibold text-neon-green bg-neon-green/5 border border-neon-green/15 px-2 py-1 rounded">
                                {kw}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-neon-pink uppercase tracking-wider block mb-2">Key Gaps (Missing)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.missing_keywords?.length === 0 ? (
                            <span className="text-xs text-brand-muted">None. Great job!</span>
                          ) : (
                            matchResult.missing_keywords?.map((kw, i) => (
                              <span key={i} className="text-[10px] font-semibold text-neon-pink bg-neon-pink/5 border border-neon-pink/15 px-2 py-1 rounded">
                                {kw}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feedback box */}
                    <div className="p-4 bg-brand-card/50 border border-brand-border rounded-xl text-sm text-brand-muted leading-relaxed">
                      <span className="font-semibold text-white block mb-1 text-xs uppercase tracking-wider text-neon-purple">Match Analyst Feedback</span>
                      {matchResult.feedback}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-brand-muted">
                    <Info className="w-10 h-10 mx-auto text-brand-muted/40 mb-3" />
                    <p className="text-white font-medium text-sm">Compare Against Roles</p>
                    <p className="text-xs mt-1 max-w-[280px] mx-auto leading-relaxed">Paste the job description on the left to measure keyword matches and identify compatibility gaps.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
