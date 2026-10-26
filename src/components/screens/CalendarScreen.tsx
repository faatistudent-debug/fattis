import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DayHabitLog, MoodType } from '../../types';
import { MoodEmoji } from '../MoodEmojis';

interface CalendarScreenProps {
  logsHistory: Record<string, DayHabitLog>;
  onSelectDay?: (date: string) => void;
}

type CalendarViewMode = 'buenos_habitos' | 'diario_emocional' | 'estadisticas';

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  logsHistory,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('buenos_habitos');
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  // Septiembre 2026: Sept 1st is Tuesday.
  // Monday is column 0, Tuesday column 1 ... Sunday column 6
  // Leading empty days: 1 (Monday Aug 31 is blank or empty)
  // Total days in September: 30 days. Note: PDF page 8 shows days 1 to 31 in the graphic grid.
  // We'll render days 1 to 31 exactly as shown in the screenshot!
  const daysInGrid = Array.from({ length: 31 }, (_, i) => i + 1);

  const streakDays = [15, 16, 17, 18, 19];

  const handleTrophyClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fde047'],
    });
  };

  const getDayMood = (day: number): MoodType | null => {
    const formatted = `2026-09-${day < 10 ? '0' + day : day}`;
    if (logsHistory[formatted]?.mood) {
      return logsHistory[formatted].mood;
    }
    // Default mood mapping for the 5-day streak as shown on Page 9
    if (day === 15) return 'feliz';
    if (day === 16) return 'estresado';
    if (day === 17) return 'pensativo';
    if (day === 18) return 'feliz';
    if (day === 19) return 'feliz';
    return null;
  };

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn">
      {/* Header Banner: Calendario */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl text-left shadow-xs">
        <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
          Calendario
        </h2>
      </div>

      {/* Segmented Switcher: [Buenos hábitos] | [Diario Emocional] | [Estadísticas] */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#cbd5e1]/70 p-1 rounded-2xl border border-white/60">
        <button
          type="button"
          onClick={() => setViewMode('buenos_habitos')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            viewMode === 'buenos_habitos'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Buenos hábitos
        </button>

        <button
          type="button"
          onClick={() => setViewMode('diario_emocional')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            viewMode === 'diario_emocional'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Diario Emocional
        </button>

        <button
          type="button"
          onClick={() => setViewMode('estadisticas')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            viewMode === 'estadisticas'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Estadísticas
        </button>
      </div>

      {/* View Mode: Calendar Views (Page 8 & 9) */}
      {viewMode !== 'estadisticas' && (
        <div className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3.5 shadow-sm space-y-3">
          {/* Year & Month title */}
          <div className="text-center">
            <span className="block text-sm font-black text-gray-950 leading-none">2026</span>
            <span className="text-xs font-extrabold text-gray-700">Septiembre</span>
          </div>

          {/* Calendar Grid matching PDF Page 8 & 9 */}
          <div className="bg-[#f5eedc] border-2 border-gray-900 rounded-lg p-1.5 shadow-xs">
            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center font-black text-xs text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>

            {/* Days Grid: 7 columns */}
            <div className="grid grid-cols-7 gap-y-1 text-center font-bold text-xs text-gray-900">
              {daysInGrid.map((day) => {
                const isStreak = streakDays.includes(day);
                const mood = getDayMood(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const formatted = `2026-09-${day < 10 ? '0' + day : day}`;
                      setSelectedDayDetail(formatted);
                    }}
                    className={`h-7 w-full flex items-center justify-center border border-gray-400 text-xs transition-transform cursor-pointer relative ${
                      isStreak ? 'bg-[#fde68a] font-black' : 'bg-transparent hover:bg-amber-100/50'
                    }`}
                  >
                    {/* If in Diario Emocional view mode and has a mood, show the emoji */}
                    {viewMode === 'diario_emocional' && isStreak && mood ? (
                      <div className="scale-75">
                        <MoodEmoji mood={mood} size={28} />
                      </div>
                    ) : (
                      day
                    )}
                  </button>
                );
              })}
              {/* Empty trailing cells to fill 35 grid slots */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`blank-${i}`} className="h-7 w-full border border-gray-400 bg-gray-100/40" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Mode: Estadísticas & Gráficos (Page 10) */}
      {viewMode === 'estadisticas' && (
        <div className="space-y-3">
          {/* Hábitos más practicados Bar Chart */}
          <div className="bg-[#cbd5e1]/70 p-3.5 rounded-3xl border border-white/60 shadow-xs">
            <div className="bg-[#fde68a] py-1 px-3 rounded-xl text-left shadow-2xs mb-3 inline-block">
              <span className="text-xs font-black text-gray-900">Hábitos más practicados</span>
            </div>

            {/* Chart Area */}
            <div className="flex items-end justify-between px-3 pt-2 pb-1 relative h-36 border-b-2 border-gray-400">
              {/* Y Axis Guide Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 text-[10px] font-bold text-gray-700">
                <div className="border-b border-gray-300 w-full flex justify-between">
                  <span>3</span>
                </div>
                <div className="border-b border-gray-300 w-full flex justify-between">
                  <span>2</span>
                </div>
                <div className="border-b border-gray-300 w-full flex justify-between">
                  <span>1</span>
                </div>
                <div className="border-b border-gray-400 w-full flex justify-between">
                  <span>0</span>
                </div>
              </div>

              {/* 4 Bars */}
              {/* 1. Comidas (height 3) */}
              <div className="z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-10 bg-[#f5eedc] border border-[#e4dcbf] rounded-t-lg shadow-sm h-28 flex items-start justify-center pt-1 font-black text-xs text-amber-900">
                  3
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-sm shadow-2xs">
                  🥗
                </div>
              </div>

              {/* 2. Hidratación (height 2) */}
              <div className="z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-10 bg-[#f5eedc] border border-[#e4dcbf] rounded-t-lg shadow-sm h-20 flex items-start justify-center pt-1 font-black text-xs text-amber-900">
                  2
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-sm shadow-2xs">
                  🥤
                </div>
              </div>

              {/* 3. Entrenamiento (height 2.5) */}
              <div className="z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-10 bg-[#f5eedc] border border-[#e4dcbf] rounded-t-lg shadow-sm h-24 flex items-start justify-center pt-1 font-black text-xs text-amber-900">
                  2.5
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-sm shadow-2xs">
                  🥋
                </div>
              </div>

              {/* 4. Sueño (height 1) */}
              <div className="z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-10 bg-[#f5eedc] border border-[#e4dcbf] rounded-t-lg shadow-sm h-12 flex items-start justify-center pt-1 font-black text-xs text-amber-900">
                  1
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-sm shadow-2xs">
                  🌙
                </div>
              </div>
            </div>
          </div>

          {/* Progreso por mes Line Chart */}
          <div className="bg-[#cbd5e1]/70 p-3.5 rounded-3xl border border-white/60 shadow-xs">
            <div className="bg-[#fde68a] py-1 px-3 rounded-xl text-left shadow-2xs mb-2 inline-block">
              <span className="text-xs font-black text-gray-900">Progreso por mes</span>
            </div>

            {/* SVG Line Graph */}
            <div className="relative h-28 w-full pt-2">
              <svg viewBox="0 0 300 90" className="w-full h-full overflow-visible">
                {/* Horizontal guide lines */}
                <line x1="30" y1="10" x2="290" y2="10" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="30" y1="35" x2="290" y2="35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="30" y1="60" x2="290" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="30" y1="80" x2="290" y2="80" stroke="#64748b" strokeWidth="2" />

                {/* Y labels */}
                <text x="18" y="14" fontSize="9" fontWeight="bold" fill="#334155">3</text>
                <text x="18" y="39" fontSize="9" fontWeight="bold" fill="#334155">2</text>
                <text x="18" y="64" fontSize="9" fontWeight="bold" fill="#334155">1</text>
                <text x="18" y="83" fontSize="9" fontWeight="bold" fill="#334155">0</text>

                {/* Smooth Yellow Curve */}
                <path
                  d="M 50 80 Q 120 78 140 60 T 210 18 L 270 12"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Glowing Nodes */}
                <circle cx="50" cy="80" r="4" fill="#ca8a04" stroke="#ffffff" strokeWidth="2" />
                <circle cx="140" cy="60" r="4.5" fill="#ca8a04" stroke="#ffffff" strokeWidth="2" />
                <circle cx="210" cy="18" r="5" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                <rect x="206" y="14" width="8" height="8" rx="2" fill="#ca8a04" />
              </svg>

              {/* X labels */}
              <div className="flex justify-between pl-8 pr-3 text-[10px] font-bold text-gray-700 mt-1">
                <span>Jul / 2026</span>
                <span>Ago / 2026</span>
                <span>Sep / 2026</span>
                <span>Oct / 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Banner: "Mejor racha:" matching Page 8 & 9 */}
      <div className="space-y-2">
        <div className="bg-[#fde68a] border-2 border-[#fcd34d] py-1.5 px-4 rounded-xl text-left shadow-2xs">
          <h3 className="text-gray-900 font-extrabold text-sm tracking-wide">
            Mejor racha:
          </h3>
        </div>

        <div className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3 shadow-xs flex items-center justify-between gap-2">
          {/* Badge 5 Días */}
          <div className="w-14 h-14 rounded-full bg-[#fde047] border-3 border-amber-400 flex flex-col items-center justify-center shrink-0 shadow-xs">
            <span className="text-lg font-black text-gray-950 leading-none">5</span>
            <span className="text-[10px] font-bold text-gray-800 leading-tight">Días</span>
          </div>

          {/* Description */}
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-bold text-gray-900 leading-tight">
              ¡Hoy completaste cinco días seguidos cumpliendo con todos tus tiempos de comida!
            </p>
            <div className="bg-amber-100/80 px-2 py-0.5 rounded-md inline-block">
              <span className="text-[10px] font-extrabold text-amber-900">
                Tu mejor racha: 15 | Septiembre - 19 | Septiembre
              </span>
            </div>
          </div>

          {/* Trophy Illustration with Confetti Trigger */}
          <button
            type="button"
            onClick={handleTrophyClick}
            className="shrink-0 p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="¡Toca para celebrar con confeti!"
          >
            <svg viewBox="0 0 100 100" width="52" height="52" className="drop-shadow-md">
              <path d="M 30 18 L 70 18 L 65 52 C 65 62 58 70 50 70 C 42 70 35 62 35 52 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
              <path d="M 30 24 C 18 24 16 38 24 44 C 28 47 34 46 34 46" stroke="#ca8a04" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 70 24 C 82 24 84 38 76 44 C 72 47 66 46 66 46" stroke="#ca8a04" strokeWidth="4" fill="none" strokeLinecap="round" />
              <rect x="46" y="70" width="8" height="12" fill="#ca8a04" />
              <polygon points="36,92 64,92 60,82 40,82" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <ellipse cx="50" cy="24" rx="16" ry="4" fill="#fef08a" />
              {/* Star on trophy cup */}
              <polygon points="50,32 52,38 58,38 53,42 55,48 50,44 45,48 47,42 42,38 48,38" fill="#ffffff" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Detail Modal if tapped */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fdfbf7] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-[#fde68a] text-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-base text-gray-900">
                Registro del {selectedDayDetail}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedDayDetail(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold">Estado Emocional:</span>
                <span className="capitalize font-black text-amber-900">
                  {logsHistory[selectedDayDetail]?.mood || 'Feliz y enfocado'}
                </span>
              </div>
              <p className="italic text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                "{logsHistory[selectedDayDetail]?.moodNote || 'Buen rendimiento y comidas completas.'}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-sky-50 p-2 rounded-xl border border-sky-200">
                  <span className="block text-[10px] text-gray-500">Hidratación</span>
                  <span className="font-black text-sky-900">8 de 8 vasos</span>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="block text-[10px] text-gray-500">Tiempos de comida</span>
                  <span className="font-black text-emerald-900">5 de 5 cumplidos</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDayDetail(null)}
              className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-500 rounded-xl font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
