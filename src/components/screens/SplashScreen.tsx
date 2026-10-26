import React from 'react';
import { BrandLogo } from '../BrandLogo';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] h-full p-6 text-center select-none animate-fadeIn">
      {/* Top spacing */}
      <div className="h-6" />

      {/* Brand Logo & Slogan */}
      <div className="flex flex-col items-center max-w-sm">
        <BrandLogo size="lg" className="mb-6 transform hover:scale-105 transition-transform" />

        {/* Tagline Box - light grey/blue pill container with dark text */}
        <div className="bg-[#cbd5e1]/80 backdrop-blur-xs rounded-2xl px-5 py-4 border border-white/60 shadow-sm mt-4">
          <p className="text-gray-900 text-sm font-semibold leading-relaxed">
            ¡La forma más sencilla y eficaz de desarrollar hábitos alimenticios saludables para un excelente rendimiento deportivo!
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full max-w-xs pb-6 pt-4">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl bg-[#e2e8f0] hover:bg-white text-gray-900 font-bold text-base shadow-md hover:shadow-lg border border-gray-300 transition-all transform active:scale-95 cursor-pointer"
        >
          Vamos a empezar
        </button>
      </div>
    </div>
  );
};
