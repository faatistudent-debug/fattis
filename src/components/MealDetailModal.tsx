import React, { useState } from 'react';
import { MealType } from '../types';

interface MealDetailModalProps {
  mealType: MealType;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (meal: MealType, completed: boolean) => void;
}

const MEAL_INFO: Record<
  MealType,
  {
    title: string;
    defaultTime: string;
    description: string;
    suggestions: string[];
    role: string;
  }
> = {
  desayuno: {
    title: 'Desayuno',
    defaultTime: '09:00 am',
    description: 'La primera comida recarga los depósitos hepáticos de glucógeno tras el ayuno nocturno.',
    suggestions: [
      'Huevos revueltos con tostadas y ensalada fresca',
      'Avocado toast con limón y semillas',
      'Plato de energía matutina con frijoles y huevo',
      'Avena cocida con leche y plátano en rodajas',
    ],
    role: 'Aporte de proteína biodisponible y carbohidratos de asimilación controlada.',
  },
  merienda_am: {
    title: 'Merienda AM',
    defaultTime: '11:30 am',
    description: 'Mantiene la glucemia estable y previene el catabolismo a media mañana.',
    suggestions: [
      'Yogur griego con frutos rojos',
      'Fruta de temporada y un puñado de almendras',
      'Tostada de centeno con queso fresco y tomate',
    ],
    role: 'Combustible cerebral y control de ansiedad antes del almuerzo.',
  },
  almuerzo: {
    title: 'Almuerzo',
    defaultTime: '01:30 pm',
    description: 'Comida central con alto aporte de macronutrientes para sostener la sesión vespertina.',
    suggestions: [
      'Pasta al dente con salsa de tomate y albahaca + pechuga magra',
      'Estofado magro con papas y vegetales al vapor',
      'Lasaña ligera de espinaca, pollo y vegetales',
      'Arroz integral con salmón o atún y vegetales verdes',
    ],
    role: 'Reabastecimiento muscular y micronutrientes esenciales (hierro, zinc).',
  },
  merienda_pm: {
    title: 'Merienda PM',
    defaultTime: '05:00 pm',
    description: 'Colación pre-entrenamiento clave para llegar con máxima energía al dojo o cancha.',
    suggestions: [
      'Sándwich tostado integral de pavo y queso magro',
      'Bento box de frutas, nueces y tostadas',
      'Batido de fruta con proteína y avena',
    ],
    role: 'Energía inmediata de fácil digestión sin pesadez estomacal.',
  },
  cena: {
    title: 'Cena',
    defaultTime: '08:30 pm',
    description: 'Favorece la regeneración tisular y la secreción de hormona de crecimiento durante el sueño.',
    suggestions: [
      'Pescado a la plancha con puré de batata o calabaza',
      'Omelette de claras con vegetales salteados y pan tostado',
      'Pechuga a la plancha con ensalada tibia de quinoa',
    ],
    role: 'Proteína lenta, magnesio y recuperación del sistema nervioso central.',
  },
};

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  mealType,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
}) => {
  const info = MEAL_INFO[mealType];
  const [selectedMeal, setSelectedMeal] = useState(info.suggestions[0]);
  const [time, setTime] = useState(info.defaultTime);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-[#fde68a] text-gray-900 overflow-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
            {info.title}
          </span>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
            {time}
          </span>
        </div>

        <p className="text-xs text-gray-600 mb-3 leading-relaxed">{info.description}</p>

        {/* Status Toggle */}
        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <span className="text-xs font-bold text-gray-800">
              {isCompleted ? '¡Comida completada hoy!' : 'Pendiente de registrar'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleComplete(mealType, !isCompleted)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
            }`}
          >
            {isCompleted ? 'Desmarcar' : 'Completar ✓'}
          </button>
        </div>

        {/* Meal Suggestions */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-800 mb-1.5">
            ¿Qué comiste en tu {info.title.toLowerCase()}?
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {info.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSelectedMeal(suggestion)}
                className={`w-full text-left p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                  selectedMeal === suggestion
                    ? 'bg-amber-100 border-amber-400 font-bold text-amber-950 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Athlete Benefit Note */}
        <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200 mb-4">
          <p className="text-[11px] text-sky-900 leading-tight">
            <strong>Impacto atlético:</strong> {info.role}
          </p>
        </div>

        {/* Confirm */}
        <button
          type="button"
          onClick={() => {
            onToggleComplete(mealType, true);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-extrabold text-sm text-gray-950 shadow-md transition-all cursor-pointer"
        >
          Guardar y Registrar
        </button>
      </div>
    </div>
  );
};
