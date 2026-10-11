import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'monochrome';
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  customLogoUrl,
  size = 'md',
}) => {
  // If the admin has uploaded an official image logo in settings, render it faithfully
  if (customLogoUrl && customLogoUrl.trim() !== '') {
    const sizeClasses = {
      sm: 'h-8 max-w-[150px]',
      md: 'h-11 max-w-[200px]',
      lg: 'h-16 max-w-[280px]',
      xl: 'h-24 max-w-[360px]',
    }[size];

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="Saikat Photography Official Logo"
          className={`${sizeClasses} object-contain transition-transform duration-300`}
        />
      </div>
    );
  }

  // Exact Brand SVG Identity:
  // - Dark background compatibility
  // - Strong rich crimson red brush-stroke element
  // - White handwritten signature "Saikat"
  // - White uppercase tracked "P H O T O G R A P H Y"
  const dimensions = {
    sm: { width: 140, height: 42, textScale: 'text-xs' },
    md: { width: 190, height: 56, textScale: 'text-sm' },
    lg: { width: 250, height: 74, textScale: 'text-base' },
    xl: { width: 320, height: 95, textScale: 'text-lg' },
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      title="Saikat Photography"
      aria-label="Saikat Photography Logo"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 280 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-[1.02]"
      >
        <defs>
          <linearGradient id="brushRedGradient" x1="20" y1="20" x2="260" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4121B" />
            <stop offset="45%" stopColor="#E51E2B" />
            <stop offset="85%" stopColor="#B30F17" />
            <stop offset="100%" stopColor="#8A0910" />
          </linearGradient>
          <filter id="brushGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E51E2B" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Dynamic Artistic Red Brush Stroke Element */}
        <g filter="url(#brushGlow)">
          <path
            d="M 28 36 C 45 28, 70 24, 105 25 C 145 26, 175 22, 215 28 C 235 31, 252 38, 256 42 C 259 45, 251 47, 240 46 C 210 44, 180 50, 140 48 C 100 46, 65 52, 35 48 C 22 46, 18 41, 28 36 Z"
            fill="url(#brushRedGradient)"
            opacity="0.95"
          />
          {/* Expressive textured brush splashes & whiskers */}
          <path
            d="M 12 39 C 25 35, 42 33, 62 34 C 50 38, 30 42, 14 43 C 10 43, 8 40, 12 39 Z"
            fill="#B30F17"
            opacity="0.8"
          />
          <path
            d="M 220 30 C 242 32, 264 37, 274 44 C 265 47, 245 45, 230 42 C 224 40, 221 34, 220 30 Z"
            fill="#E51E2B"
            opacity="0.85"
          />
          <path
            d="M 85 24 C 130 19, 185 22, 235 29 C 190 28, 140 26, 92 27 Z"
            fill="#FF434F"
            opacity="0.6"
          />
        </g>

        {/* White Handwritten Signature "Saikat" */}
        <g id="signature-saikat">
          {/* Distinctive cursive "S" with flowing loop and cross-cut */}
          <path
            d="M 44 48 C 42 35, 48 18, 62 14 C 70 12, 76 15, 75 22 C 73 29, 64 35, 52 39 C 62 43, 76 44, 82 38 C 84 36, 84 34, 82 34 C 79 34, 76 38, 70 41 C 60 46, 47 49, 44 48 Z"
            fill="#FFFFFF"
          />
          {/* Flowing connector "a" */}
          <path
            d="M 86 42 C 84 38, 88 33, 95 33 C 101 33, 104 37, 103 43 C 98 44, 90 44, 88 42 C 86 40, 89 36, 95 36 C 98 36, 100 38, 100 41 C 102 41, 105 35, 106 33 C 106 37, 104 43, 107 43 C 109 43, 110 41, 112 37"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cursive "i" with flourish dot */}
          <path
            d="M 113 36 L 115 44 C 116 45, 118 45, 121 41"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="117" cy="30" r="1.8" fill="#FFFFFF" />
          {/* Tall expressive "k" */}
          <path
            d="M 124 16 L 126 44 M 133 34 L 126 39 L 135 45"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Soft "a" */}
          <path
            d="M 142 36 C 137 36, 136 40, 137 43 C 139 45, 144 45, 147 42 L 147 45"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossing "t" with artistic flourish crossbar */}
          <path
            d="M 154 22 L 155 43 C 156 45, 159 45, 163 42"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 148 31 C 158 29, 168 28, 178 28"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Artistic tail stroke echoing photographer's quill flourish */}
          <path
            d="M 163 42 C 178 39, 196 35, 214 36 C 220 36, 226 38, 222 40 C 215 42, 198 44, 185 45"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Clean, Wide-Tracked "PHOTOGRAPHY" in Pure White */}
        <text
          x="140"
          y="68"
          fill="#FFFFFF"
          textAnchor="middle"
          fontSize="12.5"
          fontWeight="600"
          letterSpacing="0.46em"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          className="uppercase tracking-[0.46em]"
        >
          PHOTOGRAPHY
        </text>

        {/* Subtle decorative aperture dot */}
        <circle cx="258" cy="65" r="1.5" fill="#E51E2B" />
      </svg>
    </div>
  );
};

export default BrandLogo;
