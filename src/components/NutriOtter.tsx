import React from 'react';

interface NutriOtterProps {
  size?: number;
  className?: string;
}

export const NutriOtter: React.FC<NutriOtterProps> = ({ size = 110, className = '' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 120 140" width={size} height={size * 1.16} className="overflow-visible">
        {/* Shadow */}
        <ellipse cx="60" cy="132" rx="34" ry="7" fill="#cbd5e1" opacity="0.6" />

        {/* Tail sticking out behind */}
        <path
          d="M 80 115 C 98 120 115 125 110 134 C 104 138 90 130 76 124 Z"
          fill="#a06c40"
          stroke="#784d28"
          strokeWidth="2.5"
        />

        {/* Otter Ears */}
        <ellipse cx="36" cy="32" rx="7" ry="5.5" fill="#8c582f" stroke="#683d1c" strokeWidth="2" />
        <ellipse cx="36" cy="32" rx="4" ry="3" fill="#d49b6a" />
        <ellipse cx="84" cy="32" rx="7" ry="5.5" fill="#8c582f" stroke="#683d1c" strokeWidth="2" />
        <ellipse cx="84" cy="32" rx="4" ry="3" fill="#d49b6a" />

        {/* Otter Head */}
        <ellipse cx="60" cy="46" rx="28" ry="24" fill="#a06c40" stroke="#784d28" strokeWidth="3" />

        {/* Muzzle (Light fur) */}
        <ellipse cx="60" cy="54" rx="16" ry="11" fill="#f5dfc6" />

        {/* Nose */}
        <polygon points="56,48 64,48 60,53" fill="#2d1e16" />

        {/* Cute Mouth */}
        <path d="M 56 54 Q 60 58 64 54" stroke="#2d1e16" strokeWidth="2" strokeLinecap="round" fill="none" />
        <line x1="60" y1="52" x2="60" y2="55" stroke="#2d1e16" strokeWidth="2" />

        {/* Whiskers */}
        <line x1="42" y1="52" x2="30" y2="50" stroke="#2d1e16" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="56" x2="32" y2="58" stroke="#2d1e16" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="78" y1="52" x2="90" y2="50" stroke="#2d1e16" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="78" y1="56" x2="88" y2="58" stroke="#2d1e16" strokeWidth="1.5" strokeLinecap="round" />

        {/* Big sparkling eyes */}
        <ellipse cx="48" cy="43" rx="4" ry="5" fill="#1e1b18" />
        <circle cx="46.5" cy="41.5" r="1.5" fill="#ffffff" />
        <ellipse cx="72" cy="43" rx="4" ry="5" fill="#1e1b18" />
        <circle cx="70.5" cy="41.5" r="1.5" fill="#ffffff" />

        {/* Doctor Glasses / Spectacles */}
        <rect x="42" y="38" width="13" height="11" rx="4" fill="none" stroke="#2563eb" strokeWidth="2" />
        <rect x="65" y="38" width="13" height="11" rx="4" fill="none" stroke="#2563eb" strokeWidth="2" />
        <line x1="55" y1="43" x2="65" y2="43" stroke="#2563eb" strokeWidth="2" />

        {/* Otter Body (under coat) */}
        <ellipse cx="60" cy="92" rx="24" ry="30" fill="#a06c40" />

        {/* Doctor Lab Coat (White) */}
        <path
          d="M 38 72 L 32 120 L 54 120 L 56 80 L 60 76 L 64 80 L 66 120 L 88 120 L 82 72 Z"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Lab coat lapels & tie */}
        <path d="M 46 72 L 56 94 L 56 72 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M 74 72 L 64 94 L 64 72 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Teal doctor tie */}
        <polygon points="58,74 62,74 63,88 60,92 57,88" fill="#0d9488" />

        {/* Stethoscope around neck */}
        <path
          d="M 44 76 C 40 88 42 102 50 102 C 55 102 56 96 56 92"
          stroke="#475569"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="50" cy="102" r="3.5" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />

        {/* Coat Pockets */}
        <rect x="36" y="98" width="10" height="9" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
        <rect x="74" y="98" width="10" height="9" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Nutrition pen in pocket */}
        <line x1="39" y1="95" x2="39" y2="100" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="42" y1="95" x2="42" y2="100" stroke="#3b82f6" strokeWidth="1.5" />

        {/* Right arm holding Coffee Mug / clipboard */}
        <path d="M 78 80 L 92 88 L 86 98" stroke="#a06c40" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Coffee Cup / Thermo */}
        <g transform="translate(86, 88)">
          <rect x="0" y="2" width="14" height="18" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <rect x="1" y="0" width="12" height="3" rx="1" fill="#78350f" />
          <path d="M 14 6 C 18 6 18 14 14 14" stroke="#b45309" strokeWidth="2" fill="none" />
          {/* Steam */}
          <path d="M 4 -3 Q 6 -7 4 -9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 9 -3 Q 11 -7 9 -9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Left arm waving / holding clipboard */}
        <path d="M 40 80 L 26 90 L 32 98" stroke="#a06c40" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Feet / Paws */}
        <ellipse cx="44" cy="126" rx="7" ry="5" fill="#8c582f" stroke="#683d1c" strokeWidth="2" />
        <ellipse cx="76" cy="126" rx="7" ry="5" fill="#8c582f" stroke="#683d1c" strokeWidth="2" />
      </svg>
    </div>
  );
};
