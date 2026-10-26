import React, { useState } from 'react';
import { ExploreArticle } from '../../types';
import { EXPLORE_ARTICLES } from '../../data/initialData';
import { ArticleModal } from '../ArticleModal';
import { RecipesScreen } from './RecipesScreen';

import { Recipe, InjuryRecord } from '../../types';

interface ExploreScreenProps {
  recipes?: Recipe[];
  injuries?: InjuryRecord[];
  onOpenCoachView?: () => void;
  onDeleteRecipe?: (id: string) => void;
  canDelete?: boolean;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  recipes,
  injuries = [],
  onOpenCoachView,
  onDeleteRecipe,
  canDelete,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'Popular' | 'Autocuidado' | 'Salud' | 'Ejercicios'>('Popular');
  const [activeArticle, setActiveArticle] = useState<ExploreArticle | null>(null);
  const [showRecipesCatalog, setShowRecipesCatalog] = useState(false);

  const getEmojiIcon = (iconName: string) => {
    switch (iconName) {
      case 'pancakes':
        return '🥞';
      case 'grapes':
        return '🍇';
      case 'avocado':
        return '🥑';
      case 'bandage':
        return '🩹';
      case 'orange':
        return '🍊';
      case 'bottle':
        return '🥤';
      case 'wheat':
        return '🌾';
      case 'pillow':
        return '🛏️';
      case 'pill':
        return '💊';
      default:
        return '📖';
    }
  };

  const handleItemClick = (article: ExploreArticle) => {
    if (article.id === 'recetas') {
      setShowRecipesCatalog(true);
    } else {
      setActiveArticle(article);
    }
  };

  if (showRecipesCatalog) {
    return (
      <RecipesScreen
        onBack={() => setShowRecipesCatalog(false)}
        recipes={recipes}
        onDeleteRecipe={onDeleteRecipe}
        canDelete={canDelete}
      />
    );
  }

  // Filter articles or show all with tag preference
  const filteredArticles = EXPLORE_ARTICLES.filter(
    (a) => selectedFilter === 'Popular' || a.category === selectedFilter || a.id === 'recetas'
  );

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn overflow-y-auto max-h-[85vh]">
      {/* Top Banner: Explorar */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl text-left shadow-xs">
        <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
          Explorar
        </h2>
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

      {/* Topic List matching Page 11 */}
      <div className="space-y-1.5">
        {filteredArticles.map((article) => (
          <button
            key={article.id}
            type="button"
            onClick={() => handleItemClick(article)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#f5eedc] border border-[#e4dcbf] hover:bg-[#fbf4e6] hover:border-amber-300 transition-all cursor-pointer shadow-xs text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition-transform">
                {getEmojiIcon(article.icon)}
              </div>
              <span className="text-xs font-black text-gray-900 group-hover:text-amber-900">
                {article.title}
              </span>
            </div>

            <div className="text-gray-400 group-hover:text-amber-700 font-bold text-sm">
              →
            </div>
          </button>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          onOpenRecipes={() => setShowRecipesCatalog(true)}
        />
      )}
    </div>
  );
};
