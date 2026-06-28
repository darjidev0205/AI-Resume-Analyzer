import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: idle, 1: uploading, 2: extracting, 3: AI scanning
  const [error, setError] = useState('');

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Please select a PDF file. Other file types are currently not supported.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    
    try {
      // Step 1: Uploading
      setStep(1);
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await API.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const resumeId = uploadRes.data.id;
      
      // Step 2: Extracting details & keywords
      setStep(2);
      // Brief timeout to mimic realistic parsing steps
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: AI Scanning
      setStep(3);
      const analyzeForm = new FormData();
      analyzeForm.append('resume_id', resumeId);
      
      await API.post('/resume/analyze', analyzeForm);
      
      // Complete!
      navigate(`/result?resumeId=${resumeId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'An error occurred during resume uploading and scanning. Please check your connection.'
      );
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white">Upload Your Resume</h1>
        <p className="text-brand-muted text-sm mt-1">Upload a PDF resume to get your ATS rating and AI review tips.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload Box */}
      {!loading ? (
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
              dragActive
                ? 'border-neon-blue bg-neon-blue/5 shadow-neon'
                : file
                ? 'border-brand-border bg-[#121826]/30'
                : 'border-brand-border hover:border-neon-blue/40 hover:bg-white/5'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            {file ? (
              <>
                <div className="w-16 h-16 bg-neon-blue/10 border border-neon-blue/20 rounded-2xl flex items-center justify-center text-neon-blue mb-4 shadow-neon">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 truncate max-w-[400px]">{file.name}</h3>
                <p className="text-xs text-brand-muted mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF file</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/5 border border-brand-border rounded-2xl flex items-center justify-center text-brand-muted mb-4 group-hover:text-neon-blue transition-colors">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Resume PDF Here</h3>
                <p className="text-sm text-brand-muted mb-1">or click to browse your local files</p>
                <p className="text-xs text-brand-muted opacity-70">Supports PDF format only (Max 5MB)</p>
              </>
            )}
          </div>

          {file && (
            <button
              onClick={handleUpload}
              className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 glow-cyan hover:scale-[1.01] transition-all"
            >
              <Sparkles className="w-5 h-5 animate-pulse" /> Start ATS Scan & Analysis
            </button>
          )}
        </div>
      ) : (
        /* Animated Loading Progress */
        <div className="glass-panel rounded-2xl p-12 text-center border border-brand-border flex flex-col items-center justify-center min-h-[350px]">
          <Loader2 className="w-12 h-12 text-neon-blue animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume</h3>
          <p className="text-brand-muted text-sm max-w-sm mb-8">Please wait while the engine parses and scores your profile against top criteria.</p>
          
          <div className="w-full max-w-md space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 1 ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-brand-dark border border-brand-border text-brand-muted'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5 text-neon-blue" /> : '1'}
              </div>
              <span className={`text-sm ${step === 1 ? 'text-white font-semibold' : 'text-brand-muted'}`}>Uploading document file...</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 2 ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-brand-dark border border-brand-border text-brand-muted'}`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5 text-neon-blue" /> : '2'}
              </div>
              <span className={`text-sm ${step === 2 ? 'text-white font-semibold' : 'text-brand-muted'}`}>Extracting layout and contact details...</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 3 ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-brand-dark border border-brand-border text-brand-muted'}`}>
                {step > 3 ? <CheckCircle2 className="w-5 h-5 text-neon-blue" /> : '3'}
              </div>
              <span className={`text-sm ${step === 3 ? 'text-white font-semibold' : 'text-brand-muted'}`}>Performing deep AI rating check...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
