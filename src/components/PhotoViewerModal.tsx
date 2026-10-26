import React from 'react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  photoUrl?: string;
  title?: string;
  time?: string;
  description?: string;
  onClose: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  photoUrl,
  title,
  time,
  description,
  onClose,
}) => {
  if (!isOpen || !photoUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1e293b] text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-700 relative"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-[#0f172a]">
          <div>
            <h4 className="text-sm font-black text-amber-300 leading-tight">
              {title || 'Foto de comida'}
            </h4>
            {time && <span className="text-[10px] text-gray-400 font-medium">{time}</span>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Full Image */}
        <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photoUrl}
            alt={title || 'Foto de comida'}
            className="w-full h-auto max-h-[60vh] object-contain"
          />
        </div>

        {/* Food Description */}
        {description && (
          <div className="p-3 bg-[#0f172a] border-t border-gray-800">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 block mb-0.5">
              Lo que comió:
            </span>
            <p className="text-xs text-gray-200 leading-relaxed font-medium">
              {description}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="p-2.5 bg-[#0f172a] text-center border-t border-gray-800/80">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs rounded-xl cursor-pointer"
          >
            Cerrar foto
          </button>
        </div>
      </div>
    </div>
  );
};
