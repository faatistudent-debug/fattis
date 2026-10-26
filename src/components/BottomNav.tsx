import React from 'react';

export type MainTab = 'home' | 'weekly' | 'calendar' | 'explore';

interface BottomNavProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="w-full bg-[#fde68a] border-t-2 border-[#fcd34d] px-6 py-2.5 flex items-center justify-around shadow-sm select-none rounded-b-[2rem]">
      {/* 1. Home / Casa */}
      <button
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' ? 'scale-110 text-gray-900 bg-amber-300/60 shadow-inner' : 'text-gray-700 hover:text-gray-900'
        }`}
        title="Inicio"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M 12 3 L 2 12 H 5 V 20 C 5 20.6 5.4 21 6 21 H 10 V 15 H 14 V 21 H 18 C 18.6 21 19 20.6 19 20 V 12 H 22 Z" />
        </svg>
      </button>

      {/* 2. Checklist / Cumplimiento */}
      <button
        type="button"
        onClick={() => onTabChange('weekly')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'weekly' ? 'scale-110 text-gray-900 bg-amber-300/60 shadow-inner' : 'text-gray-700 hover:text-gray-900'
        }`}
        title="Cumplimiento semanal"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="4" height="4" rx="1" fill={currentTab === 'weekly' ? 'currentColor' : 'none'} />
          <line x1="10" y1="6" x2="21" y2="6" strokeWidth="2.5" />
          <rect x="3" y="10" width="4" height="4" rx="1" fill={currentTab === 'weekly' ? 'currentColor' : 'none'} />
          <line x1="10" y1="12" x2="21" y2="12" strokeWidth="2.5" />
          <rect x="3" y="16" width="4" height="4" rx="1" fill={currentTab === 'weekly' ? 'currentColor' : 'none'} />
          <line x1="10" y1="18" x2="21" y2="18" strokeWidth="2.5" />
        </svg>
      </button>

      {/* 3. Calendar */}
      <button
        type="button"
        onClick={() => onTabChange('calendar')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'calendar' ? 'scale-110 text-gray-900 bg-amber-300/60 shadow-inner' : 'text-gray-700 hover:text-gray-900'
        }`}
        title="Calendario"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2.5" stroke="currentColor" />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2.5" stroke="currentColor" />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" stroke="currentColor" />
          {/* Mini days grid inside calendar */}
          <circle cx="7" cy="14" r="1.2" fill="#2563eb" />
          <circle cx="12" cy="14" r="1.2" fill="#2563eb" />
          <circle cx="17" cy="14" r="1.2" fill="#2563eb" />
          <circle cx="7" cy="18" r="1.2" fill="#2563eb" />
          <circle cx="12" cy="18" r="1.2" fill="#2563eb" />
          <circle cx="17" cy="18" r="1.2" fill="#2563eb" />
        </svg>
      </button>

      {/* 4. Compass / Explorar */}
      <button
        type="button"
        onClick={() => onTabChange('explore')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'explore' ? 'scale-110 text-gray-900 bg-amber-300/60 shadow-inner' : 'text-gray-700 hover:text-gray-900'
        }`}
        title="Explorar"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <polygon points="16,8 13.5,13.5 8,16 10.5,10.5" fill="currentColor" />
        </svg>
      </button>
    </nav>
  );
};
