import React, { useState } from 'react';
import { UserProfile, DayHabitLog, CustomMealEntry } from '../../types';
import { SportIcon } from '../SportIcons';
import { NutriOtter } from '../NutriOtter';
import { NUTRI_TIPS } from '../../data/initialData';
import { CustomMealModal } from '../CustomMealModal';
import { PhotoViewerModal } from '../PhotoViewerModal';
import { formatFullDate } from '../../utils/dateUtils';

interface HomeScreenProps {
  profile: UserProfile;
  todayLog: DayHabitLog;
  onUpdateLog: (updates: Partial<DayHabitLog>) => void;
  onNavigateToTab: (tab: 'weekly' | 'calendar' | 'explore') => void;
  activeNutriTip?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  todayLog,
  onUpdateLog,
  activeNutriTip,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<CustomMealEntry | null>(null);
  const [viewingPhotoMeal, setViewingPhotoMeal] = useState<CustomMealEntry | null>(null);

  const allTips = activeNutriTip ? [activeNutriTip, ...NUTRI_TIPS] : NUTRI_TIPS;

  const customMeals = todayLog.customMeals || [];
  const formattedDate = formatFullDate(todayLog.date);

  const syncMealsStatus = (mealsList: CustomMealEntry[]) => {
    return {
      desayuno: mealsList.some((m) => /desayuno|breakfast/i.test(m.title)),
      merienda_am: mealsList.some((m) =>
        /merienda.*am|snack.*am|media.*mañana|merienda.*mañana/i.test(m.title)
      ),
      almuerzo: mealsList.some((m) => /almuerzo|lunch|comida/i.test(m.title)),
      merienda_pm: mealsList.some((m) =>
        /merienda.*pm|snack.*pm|merienda.*tarde|snack.*tarde/i.test(m.title)
      ),
      cena: mealsList.some((m) => /cena|dinner/i.test(m.title)),
    };
  };

  const handleWaterClick = (index: number) => {
    let newCount = index + 1;
    if (todayLog.waterGlasses === index + 1) {
      newCount = index; // uncheck current
    }
    onUpdateLog({ waterGlasses: newCount });
  };

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % allTips.length);
  };

  const handleOpenAddModal = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meal: CustomMealEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleSaveCustomMeal = (meal: CustomMealEntry) => {
    let updated: CustomMealEntry[];
    const exists = customMeals.some((m) => m.id === meal.id);
    if (exists) {
      updated = customMeals.map((m) => (m.id === meal.id ? meal : m));
    } else {
      updated = [...customMeals, meal];
    }
    const syncedMeals = syncMealsStatus(updated);
    onUpdateLog({
      customMeals: updated,
      meals: syncedMeals,
    });
  };

  const handleDeleteCustomMeal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customMeals.filter((m) => m.id !== id);
    const syncedMeals = syncMealsStatus(updated);
    onUpdateLog({
      customMeals: updated,
      meals: syncedMeals,
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3">
      {/* Top Header Bar: Yellow Rounded Pill with Sport Icon, Name, and Full Date */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-300 flex items-center justify-center shadow-2xs">
            <SportIcon sport={profile.sport} size={28} className="text-gray-900" />
          </div>
          <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
            {profile.name ? `Hola, ${profile.name}` : '¡Hola!'}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Hoy
          </span>
          <span className="text-[11px] font-black text-amber-950 mt-0.5">
            {formattedDate.shortFormatted}
          </span>
        </div>
      </div>

      {/* Tus tiempos de comida hoy! */}
      <div className="bg-[#cbd5e1]/70 p-3 rounded-2xl border border-white/60">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-[#d5d0b5] py-1 px-3 rounded-xl shadow-xs">
            <span className="text-xs font-black text-gray-900">
              Tus tiempos de comida hoy!
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-950 px-2.5 py-1 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            title="Escribir comida y tomar foto"
          >
            <span>📸</span>
            <span>+ Registrar comida</span>
          </button>
        </div>

        {/* Explicit Date, Month, and Year for Meal Times */}
        <div className="bg-[#fefce8] border border-amber-300/80 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between flex-wrap gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📅</span>
            <span className="text-[11px] font-black text-amber-950">
              Fecha de comidas:
            </span>
            <span className="text-[11px] font-extrabold text-amber-900">
              {formattedDate.formatted}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-900">
            <span className="bg-amber-200/80 px-1.5 py-0.5 rounded-md font-black">
              Día: {formattedDate.dayNumber}
            </span>
            <span className="bg-amber-200/80 px-1.5 py-0.5 rounded-md font-black">
              Mes: {formattedDate.monthName}
            </span>
            <span className="bg-amber-200/80 px-1.5 py-0.5 rounded-md font-black">
              Año: {formattedDate.year}
            </span>
          </div>
        </div>

        {/* Meal cards container */}
        {customMeals.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
            {customMeals.map((meal) => (
              <div
                key={meal.id}
                className="w-40 shrink-0 bg-[#fdfbf7] rounded-2xl p-2.5 border-2 border-[#fcd34d] shadow-sm flex flex-col justify-between relative group hover:border-amber-400 transition-all"
              >
                {/* Top action icons */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg truncate max-w-[85px]">
                    {meal.time}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(meal, e)}
                      className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[10px] text-gray-700 font-bold cursor-pointer transition-colors"
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomMeal(meal.id, e)}
                      className="w-5 h-5 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center text-[10px] text-rose-700 font-bold cursor-pointer transition-colors"
                      title="Eliminar comida"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Photo or Placeholder with click-to-view */}
                {meal.photoUrl ? (
                  <div
                    onClick={() => setViewingPhotoMeal(meal)}
                    className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-100 mb-1.5 cursor-pointer group/photo border border-amber-200 shadow-inner"
                    title="Toca para ver foto en grande"
                  >
                    <img
                      src={meal.photoUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                      🔍 Ver foto
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={(e) => handleOpenEditModal(meal, e)}
                    className="w-full h-16 rounded-xl bg-amber-50/70 border border-dashed border-amber-300 flex flex-col items-center justify-center text-gray-500 mb-1.5 cursor-pointer hover:bg-amber-100/50 transition-colors"
                    title="Toca para agregar foto"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-[9px] font-bold text-amber-800">Agregar foto</span>
                  </div>
                )}

                {/* Meal Title written by user */}
                <h4 className="font-black text-xs text-gray-900 leading-tight truncate mb-0.5">
                  {meal.title}
                </h4>

                {/* Meal Description written by user */}
                <p className="text-[10px] font-medium text-gray-700 line-clamp-2 leading-snug">
                  {meal.description || 'Sin descripción'}
                </p>
              </div>
            ))}

            {/* Quick Card to Add Another Meal */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-24 shrink-0 bg-white/70 hover:bg-white rounded-2xl border-2 border-dashed border-amber-400 flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer shadow-2xs group"
              title="Registrar otro tiempo de comida"
            >
              <div className="w-8 h-8 rounded-full bg-amber-200 group-hover:bg-amber-300 flex items-center justify-center text-amber-950 font-black text-lg mb-1 shadow-2xs">
                +
              </div>
              <span className="text-[10px] font-extrabold text-gray-800 leading-tight">
                Agregar comida
              </span>
            </button>
          </div>
        ) : (
          /* Empty state: No meals registered yet */
          <div className="bg-[#fdfbf7] border-2 border-dashed border-amber-300 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center shadow-xs">
            <span className="text-3xl mb-1.5">🍽️📸</span>
            <h4 className="text-xs font-black text-gray-900 mb-1">
              ¡Aún no has registrado tus comidas de hoy!
            </h4>
            <p className="text-[10px] text-gray-600 mb-2.5 max-w-[260px] leading-relaxed">
              Escribe el nombre de tu comida, qué comiste y tómale una foto a tu plato.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📷</span>
              <span>Tomar foto y registrar comida</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidratémonos lo suficiente hoy! */}
      <div className="bg-[#cbd5e1]/70 p-3 rounded-2xl border border-white/60">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-black text-gray-900">
            Hidratémonos lo suficiente hoy!
          </span>
          <span className="text-[11px] font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
            {todayLog.waterGlasses * 250} ml / 2000 ml ({todayLog.waterGlasses} de 8 vasos)
          </span>
        </div>

        {/* Explicit Date, Month, and Year for Hydration */}
        <div className="bg-[#f0f9ff] border border-sky-300/80 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between flex-wrap gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">💧</span>
            <span className="text-[11px] font-black text-sky-950">
              Fecha de hidratación:
            </span>
            <span className="text-[11px] font-extrabold text-sky-900">
              {formattedDate.formatted}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-sky-900">
            <span className="bg-sky-200/80 px-1.5 py-0.5 rounded-md font-black">
              Día: {formattedDate.dayNumber}
            </span>
            <span className="bg-sky-200/80 px-1.5 py-0.5 rounded-md font-black">
              Mes: {formattedDate.monthName}
            </span>
            <span className="bg-sky-200/80 px-1.5 py-0.5 rounded-md font-black">
              Año: {formattedDate.year}
            </span>
          </div>
        </div>

        {/* 8 water glass boxes */}
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isChecked = idx < todayLog.waterGlasses;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleWaterClick(idx)}
                className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  isChecked
                    ? 'bg-[#bae6fd] border-[#38bdf8] text-sky-950 font-black text-lg shadow-xs scale-102'
                    : 'bg-[#f5eedc] border-[#e4dcbf] hover:bg-white text-transparent'
                }`}
                title={`Vaso ${idx + 1} (250 ml)`}
              >
                {isChecked ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom 3 Cards: Nutri Datos + Horas de sueño + Entrenamiento */}
      <div className="grid grid-cols-12 gap-2 pt-0.5">
        {/* Nutri Datos (6 cols) */}
        <div
          onClick={nextTip}
          className="col-span-6 bg-[#fde68a] border border-[#fcd34d] p-2.5 rounded-2xl shadow-xs flex flex-col justify-between cursor-pointer hover:bg-[#fed7aa] transition-all relative overflow-hidden"
          title="Toca para ver otro nutri-dato"
        >
          <div className="bg-white/90 py-0.5 px-2 rounded-lg text-center self-start shadow-2xs mb-1.5">
            <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
              NUTRI DATOS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold text-gray-900 leading-snug flex-1">
              {allTips[tipIndex % allTips.length]}
            </p>
            <div className="shrink-0 -mr-1">
              <NutriOtter size={60} />
            </div>
          </div>
        </div>

        {/* Horas de sueño (3 cols) */}
        <div
          onClick={() => {
            const nextHours = todayLog.sleepHours >= 10 ? 5 : todayLog.sleepHours + 1;
            onUpdateLog({ sleepHours: nextHours, sleepCompleted: true });
          }}
          className="col-span-3 bg-[#fde68a] border border-[#fcd34d] p-2 rounded-2xl shadow-xs flex flex-col items-center justify-between text-center cursor-pointer hover:bg-[#fed7aa] transition-all"
          title="Toca para ajustar horas de sueño"
        >
          <span className="text-[9px] font-bold text-gray-800 leading-tight">
            Horas de sueño
          </span>
          <span className="text-base font-black text-gray-950 my-1">
            {todayLog.sleepHours} hrs
          </span>
          <div className="text-gray-950 font-black text-lg leading-none">✓</div>
        </div>

        {/* Entrenamiento (3 cols) */}
        <div
          onClick={() => {
            const nextTraining = todayLog.trainingHours >= 6 ? 1 : todayLog.trainingHours + 0.5;
            onUpdateLog({ trainingHours: nextTraining, trainingCompleted: true });
          }}
          className="col-span-3 bg-[#fde68a] border border-[#fcd34d] p-2 rounded-2xl shadow-xs flex flex-col items-center justify-between text-center cursor-pointer hover:bg-[#fed7aa] transition-all"
          title="Toca para ajustar horas de entrenamiento"
        >
          <span className="text-[9px] font-bold text-gray-800 leading-tight">
            Entrenamiento
          </span>
          <span className="text-base font-black text-gray-950 my-1">
            {todayLog.trainingHours} hrs
          </span>
          <div className="text-gray-950 font-black text-lg leading-none">✓</div>
        </div>
      </div>

      {/* Custom Meal Modal (Add / Edit) */}
      <CustomMealModal
        isOpen={isModalOpen}
        initialMeal={editingMeal}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveCustomMeal}
      />

      {/* Fullscreen Photo Viewer Modal */}
      <PhotoViewerModal
        isOpen={Boolean(viewingPhotoMeal)}
        photoUrl={viewingPhotoMeal?.photoUrl}
        title={viewingPhotoMeal?.title}
        time={viewingPhotoMeal?.time}
        description={viewingPhotoMeal?.description}
        onClose={() => setViewingPhotoMeal(null)}
      />
    </div>
  );
};
