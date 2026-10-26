import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'lg',
}) => {
  const sizeMap = {
    sm: { width: 140, height: 110, textScale: 'text-xs' },
    md: { width: 180, height: 140, textScale: 'text-sm' },
    lg: { width: 230, height: 175, textScale: 'text-base' },
    xl: { width: 280, height: 215, textScale: 'text-lg' },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 180"
        width={width}
        height={height}
        className="overflow-visible drop-shadow-sm"
      >
        {/* Text "RENDÍ" on top */}
        <text
          x="75"
          y="28"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="22"
          letterSpacing="1.5"
          fill="#111827"
        >
          RENDÍ
        </text>

        {/* Outer Shadow/Bevel of the R */}
        <path
          d="M 45 42 L 88 42 C 112 42 126 55 126 73 C 126 87 117 97 103 103 L 132 142 L 105 142 L 80 108 L 65 108 L 65 142 L 45 142 Z"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Main Body of the R */}
        <path
          d="M 47 44 L 88 44 C 110 44 122 56 122 73 C 122 86 113 96 100 101 L 128 140 L 107 140 L 82 106 L 65 106 L 65 140 L 47 140 Z"
          fill="#334155"
        />

        {/* Vertical stripes detail inside the stem of the R as seen in screenshot */}
        <rect x="52" y="50" width="5" height="84" rx="2" fill="#1e293b" />
        <rect x="60" y="50" width="5" height="52" rx="2" fill="#1e293b" />

        {/* Horizontal baseline bar under R */}
        <rect x="42" y="146" width="30" height="4.5" rx="2" fill="#334155" />

        {/* Inner white circle inside the loop of the R */}
        <circle cx="86" cy="73" r="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Green Checkmark inside the white circle */}
        <path
          d="M 77 73 L 83 79 L 95 67"
          fill="none"
          stroke="#4ade80"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Blue Plus Symbol (+) */}
        <g transform="translate(142, 60)">
          {/* Shadow of the plus */}
          <path
            d="M 12 0 L 22 0 C 23.5 0 24 0.5 24 2 L 24 12 L 34 12 C 35.5 12 36 12.5 36 14 L 36 24 C 36 25.5 35.5 26 34 26 L 24 26 L 24 36 C 24 37.5 23.5 38 22 38 L 12 38 C 10.5 38 10 37.5 10 36 L 10 26 L 0 26 C -1.5 26 -2 25.5 -2 24 L -2 14 C -2 12.5 -1.5 12 0 12 L 10 12 L 10 2 C 10 0.5 10.5 0 12 0 Z"
            fill="#1e3a8a"
            stroke="#172554"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Front blue face of the plus */}
          <path
            d="M 12 0 L 22 0 C 23 0 23.5 0.5 23.5 1.5 L 23.5 12 L 34 12 C 35 12 35.5 12.5 35.5 13.5 L 35.5 23.5 C 35.5 24.5 35 25 34 25 L 23.5 25 L 23.5 35.5 C 23.5 36.5 23 37 22 37 L 12 37 C 11 37 10.5 36.5 10.5 35.5 L 10.5 25 L 0 25 C -1 25 -1.5 24.5 -1.5 23.5 L -1.5 13.5 C -1.5 12.5 -1 12 0 12 L 10.5 12 L 10.5 1.5 C 10.5 0.5 11 0 12 0 Z"
            fill="#2563eb"
          />
        </g>

        {/* Text "MÁS" under the + */}
        <text
          x="159"
          y="136"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17"
          letterSpacing="1.5"
          fill="#111827"
        >
          MÁS
        </text>
      </svg>
    </div>
  );
};
