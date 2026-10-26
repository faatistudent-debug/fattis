import React, { useState, useRef, useEffect } from 'react';
import { CustomMealEntry } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface CustomMealModalProps {
  isOpen: boolean;
  initialMeal?: CustomMealEntry | null;
  onClose: () => void;
  onSave: (meal: CustomMealEntry) => void;
}

export const CustomMealModal: React.FC<CustomMealModalProps> = ({
  isOpen,
  initialMeal,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Helper to format current time e.g. "01:30 pm"
  const getCurrentFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 is 12
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (initialMeal) {
      setTitle(initialMeal.title || '');
      setTime(initialMeal.time || getCurrentFormattedTime());
      setDescription(initialMeal.description || '');
      setPhotoUrl(initialMeal.photoUrl);
    } else {
      setTitle('');
      setTime(getCurrentFormattedTime());
      setDescription('');
      setPhotoUrl(undefined);
    }
    setErrorMsg('');
  }, [initialMeal, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      setErrorMsg('');
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.72);
      setPhotoUrl(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo procesar la foto. Intenta con otra imagen.');
    } finally {
      setIsProcessingPhoto(false);
      // Reset input value so same file can be re-selected if desired
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle && !cleanDesc && !photoUrl) {
      setErrorMsg('Por favor escribe el nombre de la comida, describe qué comiste o toma una foto.');
      return;
    }

    const mealData: CustomMealEntry = {
      id: initialMeal?.id || `meal-${Date.now()}`,
      title: cleanTitle || 'Tiempo de comida',
      time: time.trim() || getCurrentFormattedTime(),
      description: cleanDesc,
      photoUrl: photoUrl,
      createdAt: initialMeal?.createdAt || new Date().toISOString(),
    };

    onSave(mealData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-sm w-full p-4 shadow-2xl border-4 border-[#fde68a] text-gray-900 relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors cursor-pointer text-sm"
          title="Cerrar"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3 pr-7">
          <div className="w-8 h-8 rounded-xl bg-amber-300 text-amber-950 flex items-center justify-center font-black text-base shadow-2xs shrink-0">
            📸
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-950 leading-tight">
              {initialMeal ? 'Editar comida' : 'Registrar tiempo de comida'}
            </h3>
            <p className="text-[10px] text-gray-600">
              Escribe lo que comiste y toma una foto de tu plato
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-[11px] font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          {/* Field 1: Custom Meal Title (No preset options! Fully writable) */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-800 mb-1">
              Nombre del tiempo de comida:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe aquí (ej: Desayuno, Almuerzo, Merienda, Batido...)"
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-2xs"
              autoFocus={!initialMeal}
            />
          </div>

          {/* Field 2: Meal Time */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-800 mb-1">
              Hora:
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ej: 08:30 am, 01:15 pm..."
              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Field 3: What did you eat? */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-800 mb-1">
              ¿Qué comiste? (Escribe los alimentos y porciones):
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe aquí los alimentos de tu comida (ej: Huevos revueltos, frijoles molidos, tostadas integrales y café sin azúcar)..."
              className="w-full p-2.5 text-xs font-medium rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-2xs resize-none"
            />
          </div>

          {/* Field 4: Photo Capture & Upload */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-2.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-gray-900">
                Foto de lo que comiste:
              </label>
              {photoUrl && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Foto lista
                </span>
              )}
            </div>

            {/* Hidden file inputs: one with capture="environment" for direct camera, one for gallery */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Photo preview if available */}
            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-amber-300 bg-black/5 shadow-inner">
                <img
                  src={photoUrl}
                  alt="Comida capturada"
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-2 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-xs cursor-pointer"
                  >
                    📷 Tomar otra
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(undefined)}
                    className="px-2 py-1 bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    ✕ Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isProcessingPhoto}
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-2.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-950 rounded-xl font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span className="text-xl mb-0.5">📷</span>
                    <span>Tomar foto</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingPhoto}
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-amber-50 active:bg-amber-100 text-gray-800 border border-gray-300 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span className="text-xl mb-0.5">🖼️</span>
                    <span>Subir de galería</span>
                  </button>
                </div>

                {isProcessingPhoto && (
                  <p className="text-[10px] text-amber-900 font-bold text-center animate-pulse">
                    Procesando foto...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 font-bold text-xs text-gray-700 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessingPhoto}
              className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-black text-xs text-gray-950 shadow-md transition-all cursor-pointer"
            >
              Guardar comida ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
