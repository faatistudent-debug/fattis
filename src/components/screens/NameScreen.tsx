import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';

interface NameScreenProps {
  initialName: string;
  onContinue: (name: string) => void;
  onBack?: () => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ initialName, onContinue, onBack }) => {
  const [name, setName] = useState(initialName || '');
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }
    setError('');
    onContinue(name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] h-full p-6 text-center select-none animate-fadeIn">
      {/* Back button if available */}
      <div className="w-full flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-gray-700 bg-white/70 px-3 py-1 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            ← Volver
          </button>
        ) : <div />}
      </div>

      {/* Brand Logo */}
      <div className="flex flex-col items-center">
        <BrandLogo size="md" className="mb-4" />

        {/* Subtitle Pill */}
        <div className="bg-[#cbd5e1]/80 backdrop-blur-xs rounded-full px-6 py-2.5 border border-white/60 shadow-xs mt-2 mb-6">
          <p className="text-gray-900 font-bold text-sm tracking-wide">
            Queremos conocerte mejor
          </p>
        </div>

        {/* Question */}
        <h2 className="text-gray-900 font-extrabold text-base md:text-lg mb-3">
          ¿Cómo te llamas?
        </h2>

        {/* Input Container */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Escribe tu nombre..."
            autoFocus
            className="w-full py-3 px-4 rounded-xl bg-[#cbd5e1]/90 border border-gray-300 text-gray-900 font-bold text-center text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner transition-all placeholder-gray-500"
          />

          {error && <p className="text-red-600 text-xs mt-2 font-medium">{error}</p>}
        </form>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-xs pb-6 pt-4">
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full py-3 px-6 rounded-xl bg-[#e2e8f0] hover:bg-white text-gray-900 font-bold text-base shadow-md hover:shadow-lg border border-gray-300 transition-all transform active:scale-95 cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
