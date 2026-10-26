import React from 'react';
import { ExploreArticle } from '../types';

interface ArticleModalProps {
  article: ExploreArticle | null;
  onClose: () => void;
  onOpenRecipes?: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onOpenRecipes,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-md w-full p-5 shadow-2xl border-4 border-[#fde68a] text-gray-900 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Header */}
          <div>
            <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-2">
              {article.category}
            </span>
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              {article.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Action if Recetas saludables */}
          {article.id === 'recetas' && onOpenRecipes && (
            <div className="bg-amber-100/80 p-3 rounded-2xl border border-amber-300 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-950">Catálogo de Recetas</p>
                <p className="text-[11px] text-amber-800">Desayunos, meriendas y almuerzos listos</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRecipes();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-extrabold text-xs text-gray-900 shadow-sm cursor-pointer"
              >
                Ver recetas →
              </button>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-2.5 text-xs text-gray-800 leading-relaxed">
            {article.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Tips Box */}
          <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
            <h4 className="text-xs font-black uppercase text-sky-950 mb-2 flex items-center gap-1.5">
              <span>💡</span> Consejos Prácticos para tu Rutina
            </h4>
            <ul className="space-y-1.5">
              {article.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-sky-900">
                  <span className="text-sky-600 font-bold shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#e2e8f0] hover:bg-white font-extrabold text-xs text-gray-900 transition-all cursor-pointer shadow-sm border border-gray-300"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
