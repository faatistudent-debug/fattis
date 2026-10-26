import React, { useState } from 'react';
import { DayHabitLog, CustomMealEntry } from '../../types';
import {
  formatFullDate,
  getWeekDaysForDate,
  STANDARD_MEAL_CONFIG,
  checkMealSlot,
  calculateWaterStats,
  StandardMealSlot,
} from '../../utils/dateUtils';
import { PhotoViewerModal } from '../PhotoViewerModal';
import { CustomMealModal } from '../CustomMealModal';

interface WeeklyComplianceScreenProps {
  logsHistory: Record<string, DayHabitLog>;
  todayDate?: string;
  onUpdateDayLog: (date: string, updates: Partial<DayHabitLog>) => void;
  onNavigateToHome?: () => void;
}

export const WeeklyComplianceScreen: React.FC<WeeklyComplianceScreenProps> = ({
  logsHistory,
  todayDate = '2026-09-19',
  onUpdateDayLog,
}) => {
  // Compute the 7 days of the active week containing todayDate
  const weekDays = getWeekDaysForDate(todayDate, todayDate);

  // Selected date defaults to todayDate if present in week, otherwise first day
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  // Modal states for photo viewing and adding/editing meals
  const [viewingPhotoMeal, setViewingPhotoMeal] = useState<CustomMealEntry | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<CustomMealEntry | null>(null);

  const selectedDateInfo = formatFullDate(selectedDate);

  // Log for the currently selected day
  const currentLog: DayHabitLog = logsHistory[selectedDate] || {
    date: selectedDate,
    meals: {
      desayuno: false,
      merienda_am: false,
      almuerzo: false,
      merienda_pm: false,
      cena: false,
    },
    customMeals: [],
    waterGlasses: 0,
    sleepHours: 0,
    sleepCompleted: false,
    trainingHours: 0,
    trainingCompleted: false,
    restQuality: 'Bueno',
  };

  // Water stats for selected day
  const waterStats = calculateWaterStats(currentLog.waterGlasses);

  // Check each of the 5 standard meal slots strictly
  const mealResults = STANDARD_MEAL_CONFIG.map((config) =>
    checkMealSlot(currentLog, config.key)
  );

  const registeredMealsCount = mealResults.filter((m) => m.isRegistered).length;

  // Additional custom meals logged that don't match standard 5 slots
  const extraCustomMeals = (currentLog.customMeals || []).filter((meal) => {
    return !STANDARD_MEAL_CONFIG.some((config) => config.regex.test(meal.title));
  });

  // Calculate week-wide totals for water and meals
  const weekSummary = weekDays.reduce(
    (acc, day) => {
      const dayLog = logsHistory[day.date];
      if (dayLog) {
        acc.totalWaterMl += (dayLog.waterGlasses || 0) * 250;
        acc.totalWaterGlasses += dayLog.waterGlasses || 0;
        // count registered meals
        const mealsCount = STANDARD_MEAL_CONFIG.filter(
          (c) => checkMealSlot(dayLog, c.key).isRegistered
        ).length;
        acc.totalMeals += mealsCount;
        if (dayLog.customMeals) {
          const extras = dayLog.customMeals.filter(
            (m) => !STANDARD_MEAL_CONFIG.some((c) => c.regex.test(m.title))
          ).length;
          acc.totalMeals += extras;
        }
      }
      return acc;
    },
    { totalWaterMl: 0, totalWaterGlasses: 0, totalMeals: 0 }
  );

  const handleToggleMealSlot = (slot: StandardMealSlot) => {
    const isCurrentlyDone = checkMealSlot(currentLog, slot).isRegistered;
    const config = STANDARD_MEAL_CONFIG.find((c) => c.key === slot)!;

    if (isCurrentlyDone) {
      // Remove or uncheck: remove from customMeals if present, and set boolean to false
      const remainingCustom = (currentLog.customMeals || []).filter(
        (m) => !config.regex.test(m.title)
      );
      onUpdateDayLog(selectedDate, {
        meals: { ...currentLog.meals, [slot]: false },
        customMeals: remainingCustom,
      });
    } else {
      // Open the modal to write meal and take photo
      setEditingMeal({
        id: `meal-${slot}-${Date.now()}`,
        title: config.label,
        time: config.defaultTime,
        description: '',
        createdAt: new Date().toISOString(),
      });
      setIsMealModalOpen(true);
    }
  };

  const handleSaveMealFromModal = (meal: CustomMealEntry) => {
    const currentList = currentLog.customMeals || [];
    const exists = currentList.some((m) => m.id === meal.id);
    let updatedList: CustomMealEntry[];
    if (exists) {
      updatedList = currentList.map((m) => (m.id === meal.id ? meal : m));
    } else {
      updatedList = [...currentList, meal];
    }

    // Determine which slot this matches
    const matchedConfig = STANDARD_MEAL_CONFIG.find((c) => c.regex.test(meal.title));
    const updatedMealsObj = { ...currentLog.meals };
    if (matchedConfig) {
      updatedMealsObj[matchedConfig.key] = true;
    }

    onUpdateDayLog(selectedDate, {
      customMeals: updatedList,
      meals: updatedMealsObj,
    });
  };

  const handleWaterClick = (index: number) => {
    let newCount = index + 1;
    if (currentLog.waterGlasses === index + 1) {
      newCount = index;
    }
    onUpdateDayLog(selectedDate, { waterGlasses: newCount });
  };

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn">
      {/* Top Header Banner: Cumplimiento semanal with Week Dates & Year */}
      <div className="bg-[#fde68a] border-2 border-[#fcd34d] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">
            Cumplimiento semanal
          </h2>
          <span className="text-[11px] font-extrabold text-amber-900 block">
            Semana del {weekDays[0].dayNumber} de {weekDays[0].monthName} al{' '}
            {weekDays[6].dayNumber} de {weekDays[6].monthName}, {weekDays[6].year}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-amber-950 bg-amber-300/80 px-2 py-0.5 rounded-lg border border-amber-400/80">
            {weekSummary.totalMeals} comidas • {(weekSummary.totalWaterMl / 1000).toFixed(1)}L
          </span>
        </div>
      </div>

      {/* Week Day Overview with Day, Meals Count & Exact Water Consumed */}
      <div className="bg-[#cbd5e1]/70 px-3 py-2.5 rounded-2xl border border-white/60">
        <div className="flex items-center justify-between gap-1">
          {weekDays.map((day) => {
            const dayLog = logsHistory[day.date];
            const isSelected = selectedDate === day.date;

            // Check if user filled meals strictly
            const dayMealsCount = dayLog
              ? STANDARD_MEAL_CONFIG.filter((c) => checkMealSlot(dayLog, c.key).isRegistered)
                  .length
              : 0;

            const dayWaterGlasses = dayLog ? dayLog.waterGlasses || 0 : 0;
            const dayWaterMl = dayWaterGlasses * 250;

            // A day is considered completed if breakfast, lunch and dinner were actually filled
            const hasDesayuno = dayLog && checkMealSlot(dayLog, 'desayuno').isRegistered;
            const hasAlmuerzo = dayLog && checkMealSlot(dayLog, 'almuerzo').isRegistered;
            const hasCena = dayLog && checkMealSlot(dayLog, 'cena').isRegistered;
            const isDayComplete = hasDesayuno && hasAlmuerzo && hasCena;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={`flex-1 flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 border-2 border-amber-500 scale-103 shadow-xs'
                    : 'bg-white/80 hover:bg-white border border-gray-200'
                }`}
                title={`${day.name} ${day.dayNumber} de ${day.monthName} (${dayWaterMl} ml consumidos)`}
              >
                {/* Day Letter in Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs relative ${
                    isDayComplete
                      ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 shadow-2xs'
                      : dayMealsCount > 0
                      ? 'border-2 border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-2 border-dashed border-rose-400 bg-white text-gray-500'
                  }`}
                >
                  {day.label}
                </div>

                {/* Day Number */}
                <span className="text-[10px] font-black text-gray-800 mt-1">
                  {day.dayNumber}
                </span>

                {/* Exact Water Consumed reflected for each day */}
                <div className="mt-1 flex items-center gap-0.5 text-[9px] font-black">
                  <span className="text-sky-700">💧</span>
                  <span
                    className={`${
                      dayWaterGlasses >= 6
                        ? 'text-sky-900 font-black'
                        : dayWaterGlasses > 0
                        ? 'text-sky-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {dayWaterMl >= 1000 ? `${(dayWaterMl / 1000).toFixed(1)}L` : `${dayWaterMl}m`}
                  </span>
                </div>

                {/* Mini Meal count badge */}
                <span
                  className={`text-[8px] font-bold px-1 rounded mt-0.5 ${
                    dayMealsCount >= 3
                      ? 'bg-emerald-100 text-emerald-800'
                      : dayMealsCount > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {dayMealsCount}/5
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Date Display Banner (Fecha, Mes y Año) */}
        <div className="mt-2.5 bg-white/90 border border-amber-300/80 rounded-xl px-3 py-1.5 flex items-center justify-between flex-wrap gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📅</span>
            <span className="text-[11px] font-black text-gray-900">
              Día seleccionado:
            </span>
            <span className="text-[11px] font-black text-amber-950">
              {selectedDateInfo.formatted}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-amber-900">
            <span className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300/60">
              Día: {selectedDateInfo.dayNumber}
            </span>
            <span className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300/60">
              Mes: {selectedDateInfo.monthName}
            </span>
            <span className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300/60">
              Año: {selectedDateInfo.year}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Meal Slots + Hydration + Sleep/Rest */}
      <div className="grid grid-cols-12 gap-2.5 flex-1">
        {/* Left Column (7 cols): Strict Meal Times List */}
        <div className="col-span-7 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-gray-900">
              Tiempos de comida ({registeredMealsCount}/5)
            </span>
            <button
              type="button"
              onClick={() => {
                setEditingMeal(null);
                setIsMealModalOpen(true);
              }}
              className="text-[10px] font-black bg-amber-400 hover:bg-amber-500 text-gray-950 px-2 py-0.5 rounded-lg shadow-2xs cursor-pointer transition-colors"
            >
              + Registrar
            </button>
          </div>

          {mealResults.map((meal) => {
            return (
              <div
                key={meal.slot}
                onClick={() => handleToggleMealSlot(meal.slot)}
                className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  meal.isRegistered
                    ? 'bg-[#f5eedc] border-[#fde68a] hover:bg-[#faebd7]'
                    : 'bg-white/70 border-dashed border-gray-300 hover:bg-white/95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Status Pill */}
                    <div
                      className={`w-2.5 h-6 rounded-full ${
                        meal.isRegistered ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-gray-900">
                          {meal.label}
                        </span>
                        {meal.isRegistered && meal.time && (
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded">
                            {meal.time}
                          </span>
                        )}
                      </div>

                      {/* Detail if registered vs if not registered */}
                      {meal.isRegistered ? (
                        <p className="text-[10px] font-medium text-gray-700 truncate max-w-[170px]">
                          {meal.description || 'Comida registrada'}
                        </p>
                      ) : (
                        <p className="text-[10px] font-semibold text-rose-600">
                          ○ No llenado en tiempos de comida
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Photo thumbnail if photo was taken */}
                    {meal.photoUrl && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (meal.entry) setViewingPhotoMeal(meal.entry);
                        }}
                        className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                        title="Ver foto"
                      >
                        <img
                          src={meal.photoUrl}
                          alt={meal.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Completion Icon */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        meal.isRegistered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                    >
                      {meal.isRegistered ? '✓' : '○'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Any extra custom meal entries logged */}
          {extraCustomMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-2 rounded-xl border bg-[#fdfbf7] border-amber-300 shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 rounded-full bg-amber-400" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-900">{meal.title}</span>
                    <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded">
                      {meal.time}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-700 truncate max-w-[170px]">
                    {meal.description || 'Comida personalizada'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {meal.photoUrl && (
                  <div
                    onClick={() => setViewingPhotoMeal(meal)}
                    className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                    title="Ver foto"
                  >
                    <img
                      src={meal.photoUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-xs font-black">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (5 cols): Water Consumption Reflected + Sleep & Training */}
        <div className="col-span-5 flex flex-col gap-2">
          {/* Water Consumption Card (Strictly Reflects Consumption) */}
          <div className="bg-[#f0f9ff] border-2 border-sky-300 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">💧</span>
                  <span className="text-[11px] font-black text-sky-950 leading-tight">
                    Agua consumida
                  </span>
                </div>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${waterStats.badgeColor}`}
                >
                  {waterStats.statusText}
                </span>
              </div>

              {/* Exact water quantity */}
              <div className="text-center my-1.5">
                <span className="text-xl font-black text-sky-950">
                  {waterStats.ml} ml
                </span>
                <span className="block text-[10px] font-bold text-sky-800">
                  {waterStats.glasses} de {waterStats.targetGlasses} vasos (250 ml c/u)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterStats.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-sky-700 mt-1">
                <span>0 ml</span>
                <span>Meta: 2000 ml</span>
              </div>
            </div>

            {/* Quick 8-glass visual indicator */}
            <div className="grid grid-cols-4 gap-1 mt-2">
              {Array.from({ length: 8 }).map((_, idx) => {
                const isDrunk = idx < currentLog.waterGlasses;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleWaterClick(idx)}
                    className={`h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all cursor-pointer border ${
                      isDrunk
                        ? 'bg-sky-400 border-sky-500 text-white shadow-2xs'
                        : 'bg-white border-sky-200 text-sky-300 hover:bg-sky-50'
                    }`}
                    title={`Vaso ${idx + 1} (250 ml)`}
                  >
                    {isDrunk ? '✓' : idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horas de sueño card */}
          <div
            onClick={() => {
              const nextHours = currentLog.sleepHours >= 9 ? 5 : currentLog.sleepHours + 1;
              onUpdateDayLog(selectedDate, { sleepHours: nextHours, sleepCompleted: true });
            }}
            className="bg-[#f5eedc] border border-[#e4dcbf] rounded-2xl p-2.5 flex flex-col justify-between shadow-xs cursor-pointer hover:bg-[#faebd7] transition-all"
            title="Toca para ajustar horas de sueño"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-gray-900 leading-tight">
                Horas de sueño
              </span>
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                {currentLog.sleepHours >= 7 ? 'Óptimo' : 'Recuperar'}
              </span>
            </div>

            <div className="text-center my-1">
              <span className="text-xl font-black text-gray-900">
                {currentLog.sleepHours || 0}h
              </span>
              <span className="block text-[9px] font-bold text-gray-500">
                Meta: 8 hrs
              </span>
            </div>

            <div className="w-full bg-amber-400 h-1.5 rounded-full" />
          </div>

          {/* Descanso / Entrenamiento */}
          <div
            onClick={() => {
              const qualities: ('Bajo' | 'Bueno' | 'Excelente')[] = [
                'Bajo',
                'Bueno',
                'Excelente',
              ];
              const currentIndex = qualities.indexOf(currentLog.restQuality || 'Bueno');
              const nextQuality = qualities[(currentIndex + 1) % qualities.length];
              onUpdateDayLog(selectedDate, { restQuality: nextQuality });
            }}
            className="bg-[#f5eedc] border border-[#e4dcbf] rounded-2xl p-2 flex items-center justify-between shadow-xs cursor-pointer hover:bg-[#faebd7] transition-all"
            title="Toca para cambiar nivel de descanso"
          >
            <div>
              <span className="text-[10px] font-black text-gray-900 block">
                Descanso:
              </span>
              <span className="text-[11px] font-black text-emerald-800">
                {currentLog.restQuality || 'Bueno'}
              </span>
            </div>
            <div className="text-xs font-black text-amber-900 bg-amber-200/90 px-2 py-1 rounded-lg">
              {currentLog.trainingHours || 2}h entreno
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing photo full size */}
      <PhotoViewerModal
        isOpen={Boolean(viewingPhotoMeal)}
        photoUrl={viewingPhotoMeal?.photoUrl}
        title={viewingPhotoMeal?.title}
        time={viewingPhotoMeal?.time}
        description={viewingPhotoMeal?.description}
        onClose={() => setViewingPhotoMeal(null)}
      />

      {/* Modal for adding/editing meal directly from weekly compliance */}
      <CustomMealModal
        isOpen={isMealModalOpen}
        initialMeal={editingMeal}
        onClose={() => {
          setIsMealModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveMealFromModal}
      />
    </div>
  );
};
