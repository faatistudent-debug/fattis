import React, { useState } from 'react';
import { Recipe } from '../../types';
import { RECIPES_DATA } from '../../data/initialData';
import { RecipeModal } from '../RecipeModal';

interface RecipesScreenProps {
  onBack: () => void;
  recipes?: Recipe[];
  onDeleteRecipe?: (id: string) => void;
  canDelete?: boolean;
  currentUserId?: string;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  onBack,
  recipes = RECIPES_DATA,
  onDeleteRecipe,
  canDelete = false,
  currentUserId,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<
    'Popular' | 'Autocuidado' | 'Salud' | 'Ejercicios'
  >('Popular');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Dynamically extract all meal time categories from published recipes + default base categories
  const categories: string[] = Array.from(
    new Set([
      'Desayunos',
      'Meriendas',
      'Almuerzos',
      ...recipes.map((r) => r.category).filter(Boolean),
    ])
  );

  const handleConfirmDelete = (id: string) => {
    if (onDeleteRecipe) {
      onDeleteRecipe(id);
      setRecipeToDelete(null);
      if (activeRecipe?.id === id) {
        setActiveRecipe(null);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn overflow-y-auto max-h-[85vh]">
      {/* Top Banner: Explorar */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
          Explorar
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full cursor-pointer transition-colors"
        >
          ← Volver a temas
        </button>
      </div>

      {/* Filter Category Pills */}
      <div className="grid grid-cols-4 gap-1.5">
        {(['Popular', 'Autocuidado', 'Salud', 'Ejercicios'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`py-2 px-1 rounded-xl text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-gray-950 shadow-sm ring-1 ring-gray-300'
                  : 'bg-white/80 text-gray-700 hover:bg-white shadow-2xs'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Subheader: Recetas saludables */}
      <div className="bg-[#f5eedc] border border-[#e4dcbf] py-2 px-4 rounded-2xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-200 border border-amber-300 flex items-center justify-center text-sm">
            🥞
          </div>
          <h3 className="text-gray-900 font-black text-sm">Recetas saludables</h3>
        </div>
        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
          {recipes.length} platillos disponibles
        </span>
      </div>

      {/* Confirm Delete Prompt Modal/Banner */}
      {recipeToDelete && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 shadow-md text-center space-y-2 animate-fadeIn">
          <span className="text-xs font-black text-rose-950 block">
            ¿Eliminar "{recipeToDelete.title}" del catálogo?
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleConfirmDelete(recipeToDelete.id)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Sí, eliminar
            </button>
            <button
              type="button"
              onClick={() => setRecipeToDelete(null)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Empty State Banner if no recipes added yet */}
      {recipes.length === 0 && (
        <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-3xl p-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center mx-auto text-lg">
            🥗
          </div>
          <h4 className="text-xs font-black text-amber-950">
            Aún no hay recetas registradas
          </h4>
          <p className="text-[11px] text-amber-800 leading-tight">
            Accede al <strong>Panel de Nutricionista</strong> para prescribir platillos con fotos y asignarlos a cualquier tiempo de comida (Desayuno, Almuerzo, Pre-entreno, Cena, etc.).
          </p>
        </div>
      )}

      {/* 3 Categories: Desayunos, Meriendas, Almuerzos */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const recipesInCat = recipes.filter((r) => r.category === cat);
          return (
            <div
              key={cat}
              className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3 shadow-xs space-y-2"
            >
              {/* Category Tag */}
              <div className="bg-[#fed7aa] border border-[#fdba74] py-1 px-3 rounded-xl inline-block shadow-2xs">
                <span className="text-xs font-black text-amber-950">{cat}</span>
              </div>

              {recipesInCat.length === 0 ? (
                <div className="py-3 px-2 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300">
                  <span className="text-[10px] text-gray-500 font-semibold italic">
                    Sin recetas agregadas en {cat.toLowerCase()}
                  </span>
                </div>
              ) : (
                /* recipe cards in horizontal row / grid */
                <div className="grid grid-cols-3 gap-2">
                  {recipesInCat.map((rec) => (
                    <div
                      key={rec.id}
                      className="group relative flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-1.5 transition-all border border-transparent hover:border-amber-300 shadow-2xs hover:shadow-sm"
                    >
                      {/* Delete button on card ONLY if current user is the author */}
                      {onDeleteRecipe && currentUserId && rec.authorId === currentUserId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecipeToDelete(rec);
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs cursor-pointer z-10"
                          title="Eliminar mi receta"
                        >
                          ✕
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveRecipe(rec)}
                        className="w-full flex flex-col items-center cursor-pointer text-left"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200 shadow-xs mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-800 text-center leading-tight line-clamp-2">
                          {rec.title}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] font-extrabold text-amber-800">
                            {rec.calories} kcal
                          </span>
                          {rec.authorId && rec.authorId === currentUserId && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                              Tuya
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recipe Modal */}
      {activeRecipe && (
        <RecipeModal
          recipe={activeRecipe}
          onClose={() => setActiveRecipe(null)}
          onDelete={onDeleteRecipe}
          canDelete={canDelete}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};
