import { SportType } from '../../types';
import { SportIcon } from '../SportIcons';

interface ReadyScreenProps {
  onStart: () => void;
  sport?: SportType;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({ onStart, sport = 'taekwondo' }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] h-full p-6 text-center select-none animate-fadeIn">
      {/* Top Header */}
      <div className="pt-4">
        <span className="text-xs font-black text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-300">
          ✓ Configuración Completa
        </span>
        <h2 className="text-xl font-black text-gray-900 mt-2">
          ¡Excelente, todo listo!
        </h2>
        <p className="text-xs text-gray-700 font-semibold max-w-xs mt-1">
          Tus datos de deporte y entrenamiento quedaron guardados. A continuación podrás gestionar todos tus tiempos de comida y hábitos diarios.
        </p>
      </div>

      {/* Big Sport Badge */}
      <div className="flex flex-col items-center my-4">
        <div
          className="relative rounded-3xl bg-[#fed7aa] p-6 shadow-xl border-4 border-[#fcd34d] flex items-center justify-center transform hover:scale-105 transition-all"
          style={{ width: 170, height: 170 }}
        >
          <SportIcon sport={sport} size={120} className="text-gray-900" />
        </div>
        <span className="mt-3 text-xs font-black text-gray-900 uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full border border-gray-300 shadow-2xs">
          Deporte: {sport.toUpperCase()}
        </span>
      </div>

      {/* Button: Empezar con tiempos de comida */}
      <div className="w-full max-w-xs pb-6">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-base shadow-lg border-2 border-amber-500 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Ir a Tiempos de Comida</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
