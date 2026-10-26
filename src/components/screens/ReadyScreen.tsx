import { SportType } from '../../types';
import { SportIcon } from '../SportIcons';

interface ReadyScreenProps {
  onStart: () => void;
  sport?: SportType;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({ onStart, sport = 'taekwondo' }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] h-full p-8 text-center select-none animate-fadeIn">
      {/* Top spacer */}
      <div className="h-10" />

      {/* Big Sport Badge */}
      <div className="flex flex-col items-center">
        <div
          className="relative rounded-2xl bg-[#fed7aa] p-6 shadow-xl border-4 border-[#fcd34d] flex items-center justify-center transform hover:scale-105 transition-all"
          style={{ width: 190, height: 190 }}
        >
          <SportIcon sport={sport} size={140} className="text-gray-900" />
        </div>
      </div>

      {/* Button: Vamos a empezar */}
      <div className="w-full max-w-xs pb-10">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl bg-[#fed7aa] hover:bg-[#fde68a] text-gray-950 font-extrabold text-base shadow-lg border-2 border-amber-300 transition-all transform active:scale-95 cursor-pointer"
        >
          Vamos a empezar
        </button>
      </div>
    </div>
  );
};
