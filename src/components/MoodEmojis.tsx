import React from 'react';
import { MoodType } from '../types';

interface MoodEmojiProps {
  mood: MoodType;
  size?: number;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const MoodEmoji: React.FC<MoodEmojiProps> = ({
  mood,
  size = 44,
  className = '',
  selected = false,
  onClick,
}) => {
  const isInteractive = Boolean(onClick);

  const renderFace = () => {
    switch (mood) {
      case 'triste':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Drooping eyebrows */}
            <path d="M 28 32 Q 38 38 42 38" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 72 32 Q 62 38 58 38" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="34" cy="46" r="5" fill="#713f12" />
            <circle cx="66" cy="46" r="5" fill="#713f12" />
            {/* Sad downturned mouth */}
            <path d="M 32 72 Q 50 56 68 72" stroke="#713f12" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'feliz':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Blushing cheeks */}
            <ellipse cx="26" cy="56" rx="9" ry="6" fill="#f87171" opacity="0.6" />
            <ellipse cx="74" cy="56" rx="9" ry="6" fill="#f87171" opacity="0.6" />
            {/* Cheerful curved eye lines ^ ^ */}
            <path d="M 28 42 Q 36 32 44 42" stroke="#713f12" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 56 42 Q 64 32 72 42" stroke="#713f12" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Warm open smile */}
            <path d="M 32 58 Q 50 82 68 58" stroke="#713f12" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'pensativo':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
            {/* Question mark above */}
            <text x="76" y="22" fontSize="26" fontWeight="bold" fill="#374151" fontFamily="sans-serif">?</text>
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Thinking eyebrows */}
            <path d="M 28 35 Q 36 30 44 35" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 56 32 Q 64 26 72 32" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Eyes looking up */}
            <ellipse cx="36" cy="44" rx="4.5" ry="5.5" fill="#713f12" />
            <ellipse cx="64" cy="44" rx="4.5" ry="5.5" fill="#713f12" />
            {/* Flat thoughtful mouth */}
            <path d="M 36 64 Q 50 62 64 64" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Hand under chin */}
            <g transform="translate(42, 66)">
              <ellipse cx="14" cy="16" rx="14" ry="10" fill="#fde047" stroke="#ca8a04" strokeWidth="3" />
              <path d="M 4 14 Q 14 18 24 14" stroke="#713f12" strokeWidth="2.5" fill="none" />
            </g>
          </svg>
        );

      case 'estresado':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Distressed eyebrows */}
            <path d="M 28 34 Q 38 42 42 38" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 72 34 Q 62 42 58 38" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Shut tight / tearful eyes */}
            <path d="M 28 46 L 42 46" stroke="#713f12" strokeWidth="4" strokeLinecap="round" />
            <path d="M 58 46 L 72 46" stroke="#713f12" strokeWidth="4" strokeLinecap="round" />
            {/* Tears streaming */}
            <path d="M 24 52 Q 22 66 26 70 Q 30 66 28 52 Z" fill="#60a5fa" />
            <path d="M 76 52 Q 78 66 74 70 Q 70 66 72 52 Z" fill="#60a5fa" />
            {/* Wavy stressed mouth */}
            <path d="M 34 68 Q 42 62 50 68 Q 58 74 66 68" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'dormido':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
            {/* zz floating */}
            <text x="74" y="24" fontSize="20" fontWeight="bold" fill="#a855f7" fontFamily="sans-serif">z</text>
            <text x="86" y="14" fontSize="16" fontWeight="bold" fill="#c084fc" fontFamily="sans-serif">z</text>
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Relaxed closed sleeping eyes */}
            <path d="M 28 46 Q 36 52 44 46" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 56 46 Q 64 52 72 46" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Snoring little 'o' mouth with snot bubble or open mouth */}
            <ellipse cx="50" cy="66" rx="7" ry="9" fill="#713f12" />
          </svg>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={`relative inline-flex items-center justify-center transition-all duration-200 rounded-full p-1 ${
        selected ? 'ring-4 ring-amber-500 scale-110 shadow-lg' : 'hover:scale-105 active:scale-95'
      } ${!isInteractive ? 'cursor-default' : 'cursor-pointer'} ${className}`}
      title={mood}
    >
      {renderFace()}
    </button>
  );
};
