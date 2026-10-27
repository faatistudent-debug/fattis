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
          className="text-xs font-bold text-gray-800 bg-white/80 px-3 py-1 rounded-full hover:bg-white transition-colors cursor-pointer border border-gray-300"
        >
          ← Volver
        </button>
        <span className="text-xs font-black text-amber-950 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300">
          Paso 1: Deporte & Perfil
        </span>
      </div>

      <div className="space-y-4">
        {/* Section 1: Deporte */}
        <div>
          {/* Header pill: Deporte */}
          <div className="bg-[#fecdd3] border border-[#fda4af] py-2 px-4 rounded-xl text-center shadow-xs mb-2.5">
            <h3 className="text-gray-900 font-black text-sm tracking-wide">
              ¿Qué deporte practicas?
            </h3>
            <p className="text-[10px] text-gray-700 font-bold mt-0.5">
              Selecciona tu disciplina principal:
            </p>
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
          <div className="text-center mt-1.5">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wide bg-white/80 px-3 py-0.5 rounded-full border border-gray-300 shadow-2xs">
              Deporte seleccionado: {sports.find((s) => s.id === profile.sport)?.label || profile.sport}
            </span>
          </div>
        </div>

        {/* Section 2: Datos importantes sobre vos */}
        <div className="bg-[#cbd5e1]/70 p-3.5 rounded-2xl border border-white/60 space-y-3.5">
          <div className="bg-[#d5d0b5] py-1.5 px-4 rounded-xl text-center shadow-xs">
            <h4 className="text-gray-900 font-black text-xs tracking-wide">
              Datos importantes sobre vos
            </h4>
          </div>

          {/* Subheader: Edad */}
          <div>
            <div className="bg-[#cbd5e1] py-0.5 px-3 rounded-lg text-center mb-1.5 w-24 mx-auto shadow-2xs">
              <span className="text-[11px] font-black text-gray-900">Edad</span>
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
                    className={`py-3 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${bgColors[age]} ${
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
              <span className="text-[11px] font-black text-gray-900">Sexo</span>
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
                    className={`py-3 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border ${bgClass} ${
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

          {/* Account profile confirmation */}
          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-300 flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800">Modo de cuenta:</span>
            <span className="font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-lg shadow-2xs">
              🥋 Deportista Rendí+
            </span>
          </div>
        </div>
      </div>

      {/* Continue to Training Data */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm shadow-md hover:shadow-lg border-2 border-amber-500 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continuar a Datos de Entrenamiento</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
