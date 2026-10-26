import React from 'react';
import { SportType, AgeGroup, Gender, RoleType, UserProfile } from '../../types';
import { SportIcon } from '../SportIcons';

interface ProfileScreenProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onChange,
  onContinue,
  onBack,
}) => {
  const sports: { id: SportType; label: string }[] = [
    { id: 'taekwondo', label: 'Taekwondo' },
    { id: 'natacion', label: 'Natación' },
    { id: 'voleibol', label: 'Voleibol' },
    { id: 'baloncesto', label: 'Básquetbol' },
    { id: 'atletismo', label: 'Atletismo' },
    { id: 'esgrima', label: 'Esgrima' },
  ];

  return (
    <div className="flex flex-col justify-between min-h-[620px] p-5 select-none animate-fadeIn">
      {/* Top Bar with back */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray-700 bg-white/70 px-3 py-1 rounded-full hover:bg-white transition-colors cursor-pointer"
        >
          ← Volver
        </button>
        <span className="text-xs font-bold text-gray-700">Paso 2 de 3</span>
      </div>

      <div className="space-y-4">
        {/* Section 1: Deporte */}
        <div>
          {/* Header pill: Deporte (Pink/salmon) */}
          <div className="bg-[#fecdd3] border border-[#fda4af] py-1.5 px-4 rounded-xl text-center shadow-xs mb-2">
            <h3 className="text-gray-900 font-extrabold text-sm tracking-wide">
              Deporte
            </h3>
          </div>

          {/* Sports Cards */}
          <div className="grid grid-cols-6 gap-1">
            {sports.map((item) => {
              const isSelected = profile.sport === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange({ sport: item.id })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 transition-all cursor-pointer aspect-square ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50 scale-105 shadow-md'
                      : 'border-transparent hover:border-gray-300 shadow-xs'
                  }`}
                  title={item.label}
                >
                  <SportIcon
                    sport={item.id}
                    size={38}
                    className={isSelected ? 'text-amber-700' : 'text-gray-900'}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Datos importantes sobre vos */}
        <div className="bg-[#cbd5e1]/70 p-3.5 rounded-2xl border border-white/60 space-y-3.5">
          <div className="bg-[#d5d0b5] py-1.5 px-4 rounded-xl text-center shadow-xs">
            <h4 className="text-gray-900 font-bold text-xs tracking-wide">
              Datos importantes sobre vos
            </h4>
          </div>

          {/* Subheader: Edad */}
          <div>
            <div className="bg-[#cbd5e1] py-0.5 px-3 rounded-lg text-center mb-1.5 w-24 mx-auto shadow-2xs">
              <span className="text-[11px] font-bold text-gray-800">Edad</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['12 - 17 a', '18 - 29 a', '> 30 a'] as AgeGroup[]).map((age) => {
                const isSelected = profile.ageGroup === age;
                const bgColors: Record<AgeGroup, string> = {
                  '12 - 17 a': 'bg-[#86efac] text-emerald-950',
                  '18 - 29 a': 'bg-[#bbf7d0] text-emerald-950',
                  '> 30 a': 'bg-[#fef08a] text-amber-950',
                };
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => onChange({ ageGroup: age })}
                    className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${bgColors[age]} ${
                      isSelected
                        ? 'ring-2 ring-gray-900 shadow-md scale-102 border-gray-900'
                        : 'border-transparent opacity-85 hover:opacity-100 shadow-2xs'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subheader: Sexo */}
          <div>
            <div className="bg-[#cbd5e1] py-0.5 px-3 rounded-lg text-center mb-1.5 w-24 mx-auto shadow-2xs">
              <span className="text-[11px] font-bold text-gray-800">Sexo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['Masculino', 'Femenino'] as Gender[]).map((gender) => {
                const isSelected = profile.gender === gender;
                const bgClass =
                  gender === 'Masculino'
                    ? 'bg-[#bae6fd] text-sky-950'
                    : 'bg-[#fbcfe8] text-pink-950';
                return (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => onChange({ gender })}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${bgClass} ${
                      isSelected
                        ? 'ring-2 ring-gray-900 shadow-md scale-102 border-gray-900'
                        : 'border-transparent opacity-85 hover:opacity-100 shadow-2xs'
                    }`}
                  >
                    {gender}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subheader: Accede como */}
          <div>
            <div className="bg-[#cbd5e1] py-0.5 px-3 rounded-lg text-center mb-1.5 w-32 mx-auto shadow-2xs">
              <span className="text-[11px] font-bold text-gray-800">Accede como</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Deportista', 'Nutricionista', 'Entrenador'] as RoleType[]).map((role) => {
                const isSelected = profile.role === role;
                const bgClasses: Record<RoleType, string> = {
                  Deportista: 'bg-[#fef08a] text-amber-950',
                  Nutricionista: 'bg-[#bbf7d0] text-emerald-950',
                  Entrenador: 'bg-[#99f6e4] text-teal-950',
                };
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onChange({ role })}
                    className={`py-3 px-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border ${bgClasses[role]} ${
                      isSelected
                        ? 'ring-2 ring-gray-900 shadow-md scale-102 border-gray-900'
                        : 'border-transparent opacity-85 hover:opacity-100 shadow-2xs'
                    }`}
                  >
                    {role}
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
