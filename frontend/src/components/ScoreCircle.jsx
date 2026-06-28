import React, { useEffect, useState } from 'react';

export default function ScoreCircle({ score, size = 180, strokeWidth = 14 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Determine color matching score range
  let strokeColor = '#ef4444'; // Red
  let shadowColor = 'rgba(239, 68, 68, 0.4)';
  if (score >= 75) {
    strokeColor = '#00f0ff'; // Neon Cyan
    shadowColor = 'rgba(0, 240, 255, 0.4)';
  } else if (score >= 50) {
    strokeColor = '#ffea00'; // Neon Yellow
    shadowColor = 'rgba(255, 234, 0, 0.4)';
  }

  return (
    <div className="relative flex flex-col items-center justify-center animate-float">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle with dynamic color and transitions */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${strokeColor})`,
          }}
        />
      </svg>
      {/* Centered text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-white font-mono tracking-tighter" style={{ textShadow: `0 0 20px ${shadowColor}` }}>
          {progress}
        </span>
        <span className="text-xs text-brand-muted uppercase tracking-widest font-semibold mt-1">ATS Score</span>
      </div>
    </div>
  );
}
