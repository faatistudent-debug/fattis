/**
 * Date and Habit Compliance Utility Helpers
 */

import { DayHabitLog, CustomMealEntry } from '../types';

export const SPANISH_DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const SPANISH_MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export interface FormattedDateInfo {
  dayName: string;
  dayNumber: number;
  monthName: string;
  year: number;
  formatted: string;
  shortFormatted: string;
  isoDate: string;
}

export function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  if (!dateStr || !dateStr.includes('-')) {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }
  const parts = dateStr.split('-');
  return {
    year: parseInt(parts[0], 10) || 2026,
    month: parseInt(parts[1], 10) || 9,
    day: parseInt(parts[2], 10) || 19,
  };
}

export function formatFullDate(dateStr: string): FormattedDateInfo {
  const { year, month, day } = parseDateString(dateStr);
  const d = new Date(year, month - 1, day);
  const dayName = SPANISH_DAY_NAMES[d.getDay()] || 'Lunes';
  const monthName = SPANISH_MONTH_NAMES[month - 1] || 'Septiembre';

  return {
    dayName,
    dayNumber: day,
    monthName,
    year,
    formatted: `${dayName}, ${day} de ${monthName} de ${year}`,
    shortFormatted: `${day} de ${monthName}, ${year}`,
    isoDate: dateStr,
  };
}

export interface WeekDayInfo {
  label: string; // 'L', 'M', 'M', 'J', 'V', 'S', 'D'
  date: string; // 'YYYY-MM-DD'
  name: string; // 'Lunes', 'Martes', ...
  dayNumber: number;
  monthName: string;
  year: number;
  isToday: boolean;
}

export function getWeekDaysForDate(dateStr: string, todayDate?: string): WeekDayInfo[] {
  const { year, month, day } = parseDateString(dateStr);
  const current = new Date(year, month - 1, day);

  // Day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayOfWeek = current.getDay();
  // We want Monday (1) to be day 0, Sunday (0) to be day 6
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const week: WeekDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const dYear = d.getFullYear();
    const dMonth = String(d.getMonth() + 1).padStart(2, '0');
    const dDay = String(d.getDate()).padStart(2, '0');
    const iso = `${dYear}-${dMonth}-${dDay}`;

    week.push({
      label: labels[i],
      date: iso,
      name: SPANISH_DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      monthName: SPANISH_MONTH_NAMES[d.getMonth()],
      year: dYear,
      isToday: iso === todayDate,
    });
  }

  return week;
}

export type StandardMealSlot =
  | 'desayuno'
  | 'merienda_am'
  | 'almuerzo'
  | 'merienda_pm'
  | 'cena';

export const STANDARD_MEAL_CONFIG: {
  key: StandardMealSlot;
  label: string;
  defaultTime: string;
  regex: RegExp;
  icon: string;
}[] = [
  {
    key: 'desayuno',
    label: 'Desayuno',
    defaultTime: '08:00 am',
    regex: /desayuno|breakfast/i,
    icon: '🍳',
  },
  {
    key: 'merienda_am',
    label: 'Merienda AM',
    defaultTime: '10:30 am',
    regex: /merienda.*am|snack.*am|media.*mañana|merienda.*mañana|snack.*mañana/i,
    icon: '🍎',
  },
  {
    key: 'almuerzo',
    label: 'Almuerzo',
    defaultTime: '01:00 pm',
    regex: /almuerzo|lunch|comida/i,
    icon: '🥗',
  },
  {
    key: 'merienda_pm',
    label: 'Merienda PM',
    defaultTime: '04:30 pm',
    regex: /merienda.*pm|snack.*pm|merienda.*tarde|snack.*tarde|merienda/i,
    icon: '🥪',
  },
  {
    key: 'cena',
    label: 'Cena',
    defaultTime: '08:00 pm',
    regex: /cena|dinner/i,
    icon: '🍲',
  },
];

export interface MealCheckResult {
  slot: StandardMealSlot;
  label: string;
  isRegistered: boolean;
  entry?: CustomMealEntry;
  time?: string;
  photoUrl?: string;
  description?: string;
}

/**
 * Checks if a specific meal slot is registered in a day's log.
 * Strictly adheres to whether the user actually registered/filled it.
 */
export function checkMealSlot(
  log: DayHabitLog | undefined,
  slot: StandardMealSlot
): MealCheckResult {
  const config = STANDARD_MEAL_CONFIG.find((c) => c.key === slot)!;

  if (!log) {
    return {
      slot,
      label: config.label,
      isRegistered: false,
    };
  }

  // 1. Check custom meals array (user wrote custom meal)
  if (log.customMeals && log.customMeals.length > 0) {
    const found = log.customMeals.find((m) => config.regex.test(m.title));
    if (found) {
      return {
        slot,
        label: config.label,
        isRegistered: true,
        entry: found,
        time: found.time,
        photoUrl: found.photoUrl,
        description: found.description,
      };
    }
  }

  // 2. If no matching customMeal entry exists, check boolean log.meals[slot]
  // BUT if customMeals has items and NONE matched this slot, it means the user logged meals
  // but explicitly did NOT fill this one!
  const hasCustomMeals = log.customMeals && log.customMeals.length > 0;
  if (!hasCustomMeals && log.meals && log.meals[slot] === true) {
    return {
      slot,
      label: config.label,
      isRegistered: true,
      time: config.defaultTime,
    };
  }

  return {
    slot,
    label: config.label,
    isRegistered: false,
  };
}

/**
 * Calculates water consumption stats from water glasses count.
 */
export function calculateWaterStats(waterGlasses: number = 0) {
  const ml = Math.max(0, waterGlasses * 250);
  const liters = (ml / 1000).toFixed(ml % 1000 === 0 ? 1 : 2);
  const targetMl = 2000;
  const targetGlasses = 8;
  const percentage = Math.min(100, Math.round((ml / targetMl) * 100));

  let statusText = 'Sin registro';
  let badgeColor = 'bg-gray-100 text-gray-600 border-gray-200';

  if (waterGlasses >= 8) {
    statusText = 'Meta alcanzada';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  } else if (waterGlasses >= 6) {
    statusText = 'Buen nivel';
    badgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
  } else if (waterGlasses >= 3) {
    statusText = 'Regular';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (waterGlasses > 0) {
    statusText = 'Bajo consumo';
    badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
  }

  return {
    glasses: waterGlasses,
    ml,
    liters,
    targetMl,
    targetGlasses,
    percentage,
    statusText,
    badgeColor,
  };
}
