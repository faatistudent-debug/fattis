import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onDelete?: (recipeId: string) => void;
  canDelete?: boolean;
  currentUserId?: string;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onDelete,
  canDelete = false,
  currentUserId,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!recipe) return null;

  const isAuthor = Boolean(
    currentUserId && recipe.authorId && recipe.authorId === currentUserId
  );

  const handleDelete = () => {
    if (onDelete && (isAuthor || !recipe.authorId)) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-md w-full p-5 shadow-2xl border-4 border-[#fde68a] text-gray-900 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer"
          title="Cerrar"
        >
          ✕
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Header image & badge */}
          <div className="relative rounded-2xl overflow-hidden h-48 bg-amber-100 shadow-inner group">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black text-amber-800 shadow-sm">
              {recipe.category} • {recipe.prepTime}
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-xs">
              📸 Foto del platillo
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">
              {recipe.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              {recipe.description}
            </p>

            {/* Author Attribution & Lock Indicator */}
            <div className="flex items-center justify-between gap-2 bg-[#fefce8] border border-amber-300/80 px-3 py-1.5 rounded-xl text-[11px] shadow-2xs">
              <span className="font-bold text-amber-950 truncate">
                👤 Creado por: <strong>{recipe.authorName || 'Nutricionista Rendí+'}</strong>
              </span>
              {isAuthor ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                  ✓ Tu Receta
                </span>
              ) : (
                <span className="text-[10px] bg-gray-200/80 text-gray-700 font-bold px-2 py-0.5 rounded-full border border-gray-300 shrink-0">
                  🔒 Solo Lectura
                </span>
              )}
            </div>
          </div>

          {/* Macros Bar */}
          <div className="grid grid-cols-4 gap-2 bg-[#f5eedc] p-2.5 rounded-2xl text-center border border-[#e4dcbf]">
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Calorías</span>
              <span className="text-xs font-black text-gray-900">{recipe.calories} kcal</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Proteína</span>
              <span className="text-xs font-black text-emerald-700">{recipe.protein}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Carbos</span>
              <span className="text-xs font-black text-blue-700">{recipe.carbs}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Grasas</span>
              <span className="text-xs font-black text-amber-700">{recipe.fats}</span>
            </div>
          </div>

          {/* Athlete Benefit Note */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🥋</span>
              <h4 className="text-xs font-extrabold text-emerald-950">
                Beneficio para el Rendimiento
              </h4>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {recipe.athleteBenefit}
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Ingredientes
            </h4>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-800">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Preparación paso a paso
            </h4>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-800">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
          {/* Delete Option: ONLY for the Author who created it */}
          {onDelete && isAuthor ? (
            <div>
              {confirmDelete ? (
                <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl text-center space-y-2 animate-fadeIn">
                  <span className="text-xs font-black text-rose-950 block">
                    ¿Eliminar tu receta "{recipe.title}" del catálogo?
                  </span>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg cursor-pointer transition-all"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 font-black text-xs text-rose-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🗑️</span>
                  <span>Eliminar mi receta del catálogo</span>
                </button>
              )}
            </div>
          ) : !isAuthor && recipe.authorName ? (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-2 text-center text-[10px] text-slate-600 font-semibold">
              🔒 Esta receta fue guardada por {recipe.authorName} y nadie más puede modificarla o eliminarla.
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-extrabold text-xs text-gray-950 transition-all cursor-pointer shadow-sm"
          >
            Cerrar receta
          </button>
        </div>
      </div>
    </div>
  );
};
