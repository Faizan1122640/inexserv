import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Fast 500ms display, 300ms smooth fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#074476] flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 180x180 ViewBox SVG for 100% exact ratio matching inexserv.com */}
      <svg viewBox="0 0 180 180" className="w-44 h-44 md:w-48 md:h-48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Diagonal Gradient (top-left green to bottom-right royal blue) */}
          <linearGradient id="iesSoundwaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676" />
            <stop offset="35%" stopColor="#04A552" />
            <stop offset="65%" stopColor="#00b0ff" />
            <stop offset="100%" stopColor="#0040dd" />
          </linearGradient>

          {/* Smooth continuous rotation */}
          <style>{`
            @keyframes inexservSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin-arc-path {
              animation: inexservSpin 1.1s linear infinite;
              transform-origin: 90px 90px;
            }
          `}</style>
        </defs>

        {/* 2. Middle static track ring */}
        <circle cx="90" cy="90" r="35" stroke="rgba(0, 180, 180, 0.18)" strokeWidth="1.5" />

        {/* 3. Spinning bright green arc with rounded line caps */}
        <circle
          cx="90"
          cy="90"
          r="35"
          stroke="#04A552"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="65 249"
          className="spin-arc-path"
        />

        {/* 4. Center Exact Rhombus Soundwave Icon */}
        <g fill="url(#iesSoundwaveGrad)" transform="translate(90, 90) scale(0.38) translate(-50, -50)">
          {/* Column 1 */}
          <rect x="14" y="47.5" width="4.5" height="5" rx="2.25" />
          {/* Column 2 */}
          <rect x="22" y="40" width="4.5" height="20" rx="2.25" />
          {/* Column 3 */}
          <rect x="30" y="32.5" width="4.5" height="35" rx="2.25" />
          {/* Column 4 */}
          <rect x="38" y="25" width="4.5" height="50" rx="2.25" />
          {/* Column 5 (Center Tallest Bar) */}
          <rect x="46" y="17.5" width="4.5" height="65" rx="2.25" />
          {/* Column 6 */}
          <rect x="54" y="25" width="4.5" height="50" rx="2.25" />
          {/* Column 7 */}
          <rect x="62" y="32.5" width="4.5" height="35" rx="2.25" />
          {/* Column 8 */}
          <rect x="70" y="40" width="4.5" height="20" rx="2.25" />
          {/* Column 9 */}
          <rect x="78" y="47.5" width="4.5" height="5" rx="2.25" />
        </g>
      </svg>
    </div>
  );
}
