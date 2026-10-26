import React from 'react';
import {
  UserProfile,
  BeltColor,
  TrainingDuration,
  TrainingIntensity,
  TrainingSchedule,
} from '../../types';
import { SportIcon } from '../SportIcons';

interface TrainingScreenProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  profile,
  onChange,
  onContinue,
  onBack,
}) => {
  const beltColors: { id: BeltColor; hex: string; border: string; label: string }[] = [
    { id: 'blanco', hex: '#ffffff', border: '#cbd5e1', label: 'Blanco' },
    { id: 'amarillo', hex: '#fde047', border: '#ca8a04', label: 'Amarillo' },
    { id: 'verde', hex: '#bbf7d0', border: '#16a34a', label: 'Verde' },
    { id: 'celeste', hex: '#bae6fd', border: '#0284c7', label: 'Celeste' },
    { id: 'rojo', hex: '#f87171', border: '#dc2626', label: 'Rojo' },
    { id: 'negro', hex: '#1e293b', border: '#0f172a', label: 'Negro' },
  ];

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-4 select-none animate-fadeIn overflow-y-auto max-h-[85vh]">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray-700 bg-white/70 px-3 py-1 rounded-full hover:bg-white transition-colors cursor-pointer"
        >
          ← Volver
        </button>
        <span className="text-xs font-bold text-gray-700">Paso 3 de 3</span>
      </div>

      <div className="space-y-3.5">
        {/* Block 1: Color de cinta - Only for sports with belts like Taekwondo */}
        {profile.sport === 'taekwondo' && (
          <div className="bg-[#e4dcbf] p-3 rounded-2xl shadow-xs border border-[#d6cca9]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <SportIcon sport={profile.sport} size={36} className="text-gray-900" />
              </div>
              <h4 className="text-gray-900 font-extrabold text-sm">Color de cinta</h4>
            </div>

            <div className="flex items-center justify-between pl-1">
              <span className="text-[11px] font-semibold text-gray-800 leading-tight w-20">
                Selecciona un color:
              </span>
              <div className="flex items-center gap-2">
                {beltColors.map((belt) => {
                  const isSelected = profile.beltColor === belt.id;
                  return (
                    <button
                      key={belt.id}
                      type="button"
                      onClick={() => onChange({ beltColor: belt.id })}
                      style={{ backgroundColor: belt.hex }}
                      className={`w-7 h-7 rounded-full shadow-sm transition-transform cursor-pointer border-2 ${
                        isSelected ? 'ring-3 ring-amber-600 scale-120' : 'hover:scale-110'
                      }`}
                      title={belt.label}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Block 2: Frecuencia semanal de entrenamiento */}
        <div className="bg-[#e4dcbf] p-3 rounded-2xl shadow-xs border border-[#d6cca9]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <SportIcon sport={profile.sport} size={36} className="text-gray-900" />
            </div>
            <h4 className="text-gray-900 font-extrabold text-sm">
              Frecuencia semanal de entrenamiento
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-800 leading-tight w-20 shrink-0">
              Selecciona una frec:
            </span>
            <div className="grid grid-cols-7 gap-1 flex-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = profile.weeklyFrequency === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChange({ weeklyFrequency: num })}
                    className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-gray-950 font-black shadow-md ring-2 ring-amber-600 scale-105'
                        : 'bg-white/90 text-gray-800 hover:bg-white shadow-2xs font-bold'
                    }`}
                  >
                    <span className="text-xs leading-none">0{num}</span>
                    <span className="text-[9px] font-medium leading-tight">
                      {num === 1 ? 'día' : 'días'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block 3: Duración por sesión de entrenamiento */}
        <div className="bg-[#e4dcbf] p-3 rounded-2xl shadow-xs border border-[#d6cca9]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <SportIcon sport={profile.sport} size={36} className="text-gray-900" />
            </div>
            <h4 className="text-gray-900 font-extrabold text-sm">
              Duración por sesión de entrenamiento
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-800 leading-tight w-20 shrink-0">
              Selecciona un horario:
            </span>
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              {(['Menos de 1 hora', '1 a 2 horas', 'Más de 2 horas'] as TrainingDuration[]).map(
                (dur) => {
                  const isSelected = profile.sessionDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => onChange({ sessionDuration: dur })}
                      className={`py-2 px-1 rounded-xl text-center text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-gray-950 font-black shadow-md ring-2 ring-amber-600 scale-102'
                          : 'bg-white/90 text-gray-800 hover:bg-white shadow-2xs'
                      }`}
                    >
                      {dur}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Block 4: Intensidad habitual */}
        <div className="bg-[#cbd5e1] p-3 rounded-2xl shadow-xs border border-white/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <SportIcon sport={profile.sport} size={36} className="text-gray-900" />
            </div>
            <h4 className="text-gray-900 font-extrabold text-sm">Intensidad habitual</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-800 leading-tight w-20 shrink-0">
              Selecciona una opción:
            </span>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {(['Baja', 'Moderada', 'Alta'] as TrainingIntensity[]).map((intensity) => {
                const isSelected = profile.habitualIntensity === intensity;
                return (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => onChange({ habitualIntensity: intensity })}
                    className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-gray-950 font-black shadow-md ring-2 ring-amber-600 scale-102'
                        : 'bg-white/90 text-gray-800 hover:bg-white shadow-2xs'
                    }`}
                  >
                    {intensity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block 5: Horario habitual de entrenamiento */}
        <div className="bg-[#e4dcbf] p-3 rounded-2xl shadow-xs border border-[#d6cca9]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <SportIcon sport={profile.sport} size={36} className="text-gray-900" />
            </div>
            <h4 className="text-gray-900 font-extrabold text-sm">
              Horario habitual de entrenamiento
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-800 leading-tight w-20 shrink-0">
              Selecciona una opción:
            </span>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {(['Mañana', 'Tarde', 'Noche'] as TrainingSchedule[]).map((schedule) => {
                const isSelected = profile.habitualSchedule === schedule;
                return (
                  <button
                    key={schedule}
                    type="button"
                    onClick={() => onChange({ habitualSchedule: schedule })}
                    className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-gray-950 font-black shadow-md ring-2 ring-amber-600 scale-102'
                        : 'bg-white/90 text-gray-800 hover:bg-white shadow-2xs'
                    }`}
                  >
                    {schedule}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3 px-6 rounded-xl bg-[#e2e8f0] hover:bg-white text-gray-900 font-bold text-sm shadow-md hover:shadow-lg border border-gray-300 transition-all transform active:scale-95 cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
