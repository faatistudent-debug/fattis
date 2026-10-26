import React from 'react';
import { SportType } from '../types';

interface SportIconProps {
  sport: SportType;
  className?: string;
  size?: number;
}

export const SportIcon: React.FC<SportIconProps> = ({ sport, className = '', size = 36 }) => {
  switch (sport) {
    case 'taekwondo':
      // Two sparring martial artists (one delivering a side kick, one in guard)
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          {/* Fighter 1 (Attacking Left/Center) */}
          {/* Head */}
          <circle cx="34" cy="36" r="6" />
          {/* Body */}
          <path d="M 32 44 L 40 56 L 39 70 L 37 84" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Right leg kicking horizontally */}
          <path d="M 40 56 L 56 46 L 75 36" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Arm / guard */}
          <path d="M 33 46 L 24 45 L 26 55" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Fighter 2 (Defending Right) */}
          {/* Head */}
          <circle cx="70" cy="36" r="6" />
          {/* Torso & Legs leaning back in guard */}
          <path d="M 68 44 L 60 58 L 52 74 L 44 86" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 60 58 L 68 76 L 73 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* High block arm */}
          <path d="M 66 45 L 56 36 L 54 28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'natacion':
      // Swimmer diving/gliding horizontally
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          <circle cx="28" cy="40" r="6" />
          {/* Swimmer torso & legs */}
          <path d="M 33 43 C 44 45 56 47 68 47 L 85 43" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Forward stroke arm */}
          <path d="M 38 45 L 54 38 L 74 38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Water waves below */}
          <path d="M 15 65 Q 28 58 40 65 T 65 65 T 90 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 22 75 Q 35 68 48 75 T 75 75 T 95 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'voleibol':
      // Player jumping to spike ball
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          {/* Volleyball */}
          <circle cx="74" cy="22" r="5" />
          {/* Player Head */}
          <circle cx="48" cy="34" r="6" />
          {/* Spiking arm reaching towards ball */}
          <path d="M 47 41 L 58 32 L 67 25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Torso arched in air */}
          <path d="M 47 41 L 43 56 L 39 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Legs bent backward in jump */}
          <path d="M 43 56 L 32 66 L 24 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 39 70 L 32 82 L 40 90" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'baloncesto':
      // Basketball player shooting into basket
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          {/* Basketball */}
          <circle cx="72" cy="26" r="6" />
          {/* Player Head */}
          <circle cx="46" cy="34" r="6" />
          {/* Arms shooting upward */}
          <path d="M 46 41 L 58 30 L 66 28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 44 43 L 52 36 L 62 36" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Torso straight in air */}
          <path d="M 45 42 L 44 60 L 42 74" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Jump legs */}
          <path d="M 44 60 L 36 74 L 38 88" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 42 74 L 46 88" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'atletismo':
      // Sprinter lunging from blocks
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          <circle cx="68" cy="36" r="6" />
          {/* Torso angled forward */}
          <path d="M 64 42 L 50 54 L 38 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Arms pumping */}
          <path d="M 58 45 L 72 45 L 80 54" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 52 48 L 42 42 L 35 46" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Front driving knee */}
          <path d="M 50 54 L 56 68 L 62 80" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Back trailing leg */}
          <path d="M 38 60 L 26 64 L 14 74" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'esgrima':
      // Fencer lunging with foil
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
          <circle cx="48" cy="32" r="6" />
          {/* Torso */}
          <path d="M 47 38 L 44 54" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Sword arm extended with foil */}
          <path d="M 46 41 L 62 41 L 76 41" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Blade extending far */}
          <line x1="76" y1="41" x2="95" y2="41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Foil guard bell */}
          <line x1="76" y1="37" x2="76" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Off hand arched back */}
          <path d="M 43 42 L 34 35 L 30 26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Front lunging leg */}
          <path d="M 44 54 L 58 66 L 66 84" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Back straight leg */}
          <path d="M 44 54 L 32 68 L 18 84" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
  }
};

export const MartialArtsBadge: React.FC<{ size?: number; className?: string }> = ({ size = 160, className = '' }) => {
  return (
    <div
      className={`relative rounded-2xl bg-[#fed7aa] p-6 shadow-md border-4 border-[#fcd34d] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <SportIcon sport="taekwondo" size={size * 0.75} className="text-gray-900" />
    </div>
  );
};
