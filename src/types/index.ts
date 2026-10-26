export type SportType = 'taekwondo' | 'natacion' | 'voleibol' | 'baloncesto' | 'atletismo' | 'esgrima';

export type AgeGroup = '12 - 17 a' | '18 - 29 a' | '> 30 a';

export type Gender = 'Masculino' | 'Femenino';

export type RoleType = 'Deportista' | 'Nutricionista' | 'Entrenador';

export type BeltColor = 'blanco' | 'amarillo' | 'verde' | 'celeste' | 'rojo' | 'negro';

export type TrainingDuration = 'Menos de 1 hora' | '1 a 2 horas' | 'Más de 2 horas';

export type TrainingIntensity = 'Baja' | 'Moderada' | 'Alta';

export type TrainingSchedule = 'Mañana' | 'Tarde' | 'Noche';

export type MoodType = 'triste' | 'feliz' | 'pensativo' | 'estresado' | 'dormido';

export interface UserProfile {
  name: string;
  sport: SportType;
  ageGroup: AgeGroup;
  gender: Gender;
  role: RoleType;
  beltColor: BeltColor;
  weeklyFrequency: number; // 1 to 7
  sessionDuration: TrainingDuration;
  habitualIntensity: TrainingIntensity;
  habitualSchedule: TrainingSchedule;
  completedOnboarding: boolean;
}

export interface AthleteData {
  id: string;
  name: string;
  sport: SportType;
  ageGroup: AgeGroup;
  gender: Gender;
  beltColor: BeltColor;
  weeklyFrequency: number;
  sessionDuration: TrainingDuration;
  habitualIntensity: TrainingIntensity;
  habitualSchedule: TrainingSchedule;
  todayLog: DayHabitLog;
  logsHistory: Record<string, DayHabitLog>;
  injuries: InjuryRecord[];
  activeNutriTip?: string;
}

export interface StaffProfile {
  name: string;
}

export type MealType = 'desayuno' | 'merienda_am' | 'almuerzo' | 'merienda_pm' | 'cena';

export interface MealItem {
  id: MealType;
  name: string;
  time: string;
  completed: boolean;
  foodName?: string;
  calories?: number;
  proteinGrams?: number;
  notes?: string;
  imageUrl?: string;
}

export interface CustomMealEntry {
  id: string;
  title: string; // The user writes whatever meal time it is (e.g. Desayuno, Merienda, Almuerzo, Snack...)
  time: string; // e.g. "08:30 am" or "13:30"
  description: string; // The user writes what they ate
  photoUrl?: string; // Captured photo or image url
  createdAt?: string;
}

export interface DayHabitLog {
  userId?: string;
  date: string; // YYYY-MM-DD
  mood?: MoodType;
  moodNote?: string;
  meals: Record<MealType, boolean>;
  customMeals?: CustomMealEntry[];
  waterGlasses: number; // 0 to 8
  sleepHours: number;
  sleepCompleted: boolean;
  trainingHours: number;
  trainingCompleted: boolean;
  restQuality?: 'Bajo' | 'Bueno' | 'Excelente';
}

export interface Recipe {
  id: string;
  category: string;
  title: string;
  prepTime: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  athleteBenefit: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  createdAt?: string;
}

export interface ExploreArticle {
  id: string;
  title: string;
  category: 'Popular' | 'Autocuidado' | 'Salud' | 'Ejercicios';
  icon: string;
  summary: string;
  content: string[];
  tips: string[];
}

export type InjuryStatus = 'Activa' | 'En recuperación' | 'Dada de alta';
export type InjurySeverity = 'Leve' | 'Moderada' | 'Grave';

export interface InjuryRecord {
  id: string;
  title: string;
  date: string;
  status: InjuryStatus;
  severity: InjurySeverity;
  bodyArea: string;
  description: string;
  restrictions: string[];
  treatment: string;
  recoveryProgress: number; // 0 to 100%
  notes?: string;
}

export interface NutritionPlanNote {
  id: string;
  author: string;
  date: string;
  targetCalories: number;
  targetProtein: number;
  targetWaterGlasses: number;
  title: string;
  recommendations: string[];
  activeNutriTip: string;
}

