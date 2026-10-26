import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DayHabitLog } from '../../types';

interface CalendarScreenProps {
  logsHistory: Record<string, DayHabitLog>;
  onSelectDay?: (date: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  logsHistory,
}) => {
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  // Septiembre 2026: days 1 to 31
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

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn">
      {/* Header Banner: Calendario de Hábitos */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl text-left shadow-xs flex items-center justify-between">
        <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
          Calendario de Hábitos
        </h2>
        <span className="text-[10px] font-black text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full uppercase">
          Cumplimiento
        </span>
      </div>

      {/* Calendar Grid matching PDF Page 8 */}
      <div className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3.5 shadow-sm space-y-3">
        {/* Year & Month title */}
        <div className="text-center">
          <span className="block text-sm font-black text-gray-950 leading-none">2026</span>
          <span className="text-xs font-extrabold text-gray-700">Septiembre</span>
        </div>

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
                  {day}
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

      {/* Bottom Banner: "Mejor racha:" matching Page 8 */}
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
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-sky-50 p-2 rounded-xl border border-sky-200">
                  <span className="block text-[10px] text-gray-500 font-bold">Hidratación</span>
                  <span className="font-black text-sky-900">
                    {logsHistory[selectedDayDetail]?.waterGlasses || 0} de 8 vasos
                  </span>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="block text-[10px] text-gray-500 font-bold">Comidas del Día</span>
                  <span className="font-black text-emerald-900">
                    {logsHistory[selectedDayDetail]?.customMeals?.length ||
                      Object.values(logsHistory[selectedDayDetail]?.meals || {}).filter(Boolean).length}{' '}
                    cumplidas
                  </span>
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
