/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  DayHabitLog,
  Recipe,
  InjuryRecord,
  NutritionPlanNote,
  RoleType,
  AthleteData,
  SportType,
} from './types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_DAY_LOG,
  INITIAL_LOGS_HISTORY,
  INITIAL_INJURIES,
  INITIAL_NUTRITION_PLAN,
  INITIAL_ATHLETES,
  RECIPES_DATA,
} from './data/initialData';
import { BottomNav, MainTab } from './components/BottomNav';
import { SplashScreen } from './components/screens/SplashScreen';
import { NameScreen } from './components/screens/NameScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { TrainingScreen } from './components/screens/TrainingScreen';
import { ReadyScreen } from './components/screens/ReadyScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { WeeklyComplianceScreen } from './components/screens/WeeklyComplianceScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { RecipesScreen } from './components/screens/RecipesScreen';
import { NutritionistScreen } from './components/screens/NutritionistScreen';
import { CoachScreen } from './components/screens/CoachScreen';

export type ScreenId =
  | 'page1_splash'
  | 'page2_name'
  | 'page3_profile'
  | 'page4_training'
  | 'page5_ready'
  | 'page6_home'
  | 'page7_weekly'
  | 'page8_calendar'
  | 'page9_calendar_emotions'
  | 'page10_stats'
  | 'page11_explore'
  | 'page12_recipes'
  | 'page_nutritionist'
  | 'page_coach';

const SCREEN_LABELS: { id: ScreenId; pageNum: string; label: string }[] = [
  { id: 'page1_splash', pageNum: '1', label: 'Inicio / Rendí+' },
  { id: 'page2_name', pageNum: '2', label: 'Nombre' },
  { id: 'page3_profile', pageNum: '3', label: 'Deporte & Datos' },
  { id: 'page4_training', pageNum: '4', label: 'Entrenamiento' },
  { id: 'page5_ready', pageNum: '5', label: 'Listo para empezar' },
  { id: 'page6_home', pageNum: '6', label: 'Dashboard Hoy' },
  { id: 'page7_weekly', pageNum: '7', label: 'Cumplimiento semanal' },
  { id: 'page8_calendar', pageNum: '8', label: 'Calendario Hábitos' },
  { id: 'page9_calendar_emotions', pageNum: '9', label: 'Diario Emocional' },
  { id: 'page10_stats', pageNum: '10', label: 'Gráficos & Progreso' },
  { id: 'page11_explore', pageNum: '11', label: 'Explorar' },
  { id: 'page12_recipes', pageNum: '12', label: 'Recetas saludables' },
  { id: 'page_nutritionist', pageNum: 'Nutri', label: 'Panel Nutricionista (Info & Progreso)' },
  { id: 'page_coach', pageNum: 'Coach', label: 'Panel Entrenador (Lesiones & Progreso)' },
];

export default function App() {
  // Current user role: Deportista | Nutricionista | Entrenador
  const [currentRole, setCurrentRole] = useState<RoleType>(() => {
    try {
      const saved = localStorage.getItem('rendi_current_role');
      return (saved as RoleType) || 'Deportista';
    } catch {
      return 'Deportista';
    }
  });

  // Separate, distinct name for Nutricionista (NEVER mixed with athlete name)
  const [nutritionistName, setNutritionistName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rendi_nutritionist_name');
      return saved !== null ? saved : 'Claudia Morales';
    } catch {
      return 'Claudia Morales';
    }
  });

  // Separate, distinct name for Entrenador (NEVER mixed with athlete name)
  const [coachName, setCoachName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rendi_coach_name');
      return saved !== null ? saved : 'Carlos Medina';
    } catch {
      return 'Carlos Medina';
    }
  });

  // Registry of Athletes (each athlete that enters is saved here)
  const [athletes, setAthletes] = useState<AthleteData[]>(() => {
    try {
      const saved = localStorage.getItem('rendi_athletes_registry');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_ATHLETES;
    } catch {
      return INITIAL_ATHLETES;
    }
  });

  // Currently selected athlete ID
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rendi_selected_athlete_id');
      return saved || (athletes[0]?.id || 'ath-1');
    } catch {
      return athletes[0]?.id || 'ath-1';
    }
  });

  // Active athlete data
  const activeAthlete: AthleteData =
    athletes.find((a) => a.id === selectedAthleteId) || athletes[0] || {
      id: 'ath-new',
      name: '',
      sport: 'taekwondo',
      ageGroup: '18 - 29 a',
      gender: 'Masculino',
      beltColor: 'celeste',
      weeklyFrequency: 5,
      sessionDuration: '1 a 2 horas',
      habitualIntensity: 'Moderada',
      habitualSchedule: 'Tarde',
      todayLog: INITIAL_DAY_LOG,
      logsHistory: INITIAL_LOGS_HISTORY,
      injuries: INITIAL_INJURIES,
      activeNutriTip: 'Comer adecuadamente durante el día ayuda a disponer de energía para entrenar y recuperarse.',
    };

  // Current active screen
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    if (currentRole === 'Nutricionista') return 'page_nutritionist';
    if (currentRole === 'Entrenador') return 'page_coach';
    return 'page6_home';
  });

  // Nutrition Plan created/edited by Nutritionist
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanNote>(() => {
    try {
      const saved = localStorage.getItem('rendi_nutrition_plan');
      return saved ? JSON.parse(saved) : INITIAL_NUTRITION_PLAN;
    } catch {
      return INITIAL_NUTRITION_PLAN;
    }
  });

  // Recipes list (empty by default so Nutritionist adds them from profile)
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('rendi_recipes');
      if (saved) {
        const parsed: Recipe[] = JSON.parse(saved);
        return parsed.filter((r) => r.id.startsWith('recipe-custom-'));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Device mockup view framing toggle
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rendi_current_role', currentRole);
    } catch (e) {
      console.error(e);
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_nutritionist_name', nutritionistName);
    } catch (e) {
      console.error(e);
    }
  }, [nutritionistName]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_coach_name', coachName);
    } catch (e) {
      console.error(e);
    }
  }, [coachName]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_athletes_registry', JSON.stringify(athletes));
    } catch (e) {
      console.error(e);
    }
  }, [athletes]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_selected_athlete_id', selectedAthleteId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedAthleteId]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_nutrition_plan', JSON.stringify(nutritionPlan));
    } catch (e) {
      console.error(e);
    }
  }, [nutritionPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('rendi_recipes', JSON.stringify(recipes));
    } catch (e) {
      console.error(e);
    }
  }, [recipes]);

  // Update active athlete helper
  const updateActiveAthlete = (updates: Partial<AthleteData>) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === selectedAthleteId ? { ...a, ...updates } : a))
    );
  };

  const updateActiveAthleteTodayLog = (updates: Partial<DayHabitLog>) => {
    const updatedToday = { ...activeAthlete.todayLog, ...updates };
    const updatedHistory = {
      ...activeAthlete.logsHistory,
      [updatedToday.date]: updatedToday,
    };
    updateActiveAthlete({
      todayLog: updatedToday,
      logsHistory: updatedHistory,
    });
  };

  const updateActiveAthleteHistoryLog = (date: string, updates: Partial<DayHabitLog>) => {
    const existing = activeAthlete.logsHistory[date] || {
      date,
      meals: { desayuno: false, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
      waterGlasses: 0,
      sleepHours: 7,
      sleepCompleted: false,
      trainingHours: 2,
      trainingCompleted: false,
      restQuality: 'Bueno' as const,
    };
    const updatedDay = { ...existing, ...updates };
    const updatedHistory = {
      ...activeAthlete.logsHistory,
      [date]: updatedDay,
    };
    const updatesObj: Partial<AthleteData> = { logsHistory: updatedHistory };
    if (date === activeAthlete.todayLog.date) {
      updatesObj.todayLog = updatedDay;
    }
    updateActiveAthlete(updatesObj);
  };

  const updateActiveAthleteInjuries = (newInjuries: InjuryRecord[]) => {
    updateActiveAthlete({ injuries: newInjuries });
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  // Register a brand new athlete
  const handleAddNewAthlete = () => {
    const newId = `ath-${Date.now()}`;
    const newAthlete: AthleteData = {
      id: newId,
      name: '',
      sport: 'taekwondo',
      ageGroup: '18 - 29 a',
      gender: 'Masculino',
      beltColor: 'blanco',
      weeklyFrequency: 3,
      sessionDuration: '1 a 2 horas',
      habitualIntensity: 'Moderada',
      habitualSchedule: 'Tarde',
      todayLog: { ...INITIAL_DAY_LOG, date: new Date().toISOString().split('T')[0] },
      logsHistory: {},
      injuries: [],
      activeNutriTip: 'Comer adecuadamente durante el día ayuda a disponer de energía para entrenar y recuperarse.',
    };
    setAthletes((prev) => [newAthlete, ...prev]);
    setSelectedAthleteId(newId);
    setCurrentRole('Deportista');
    setActiveScreen('page2_name');
  };

  // Switch roles cleanly
  const handleRoleSelect = (newRole: RoleType) => {
    setCurrentRole(newRole);
    if (newRole === 'Nutricionista') {
      setActiveScreen('page_nutritionist');
    } else if (newRole === 'Entrenador') {
      setActiveScreen('page_coach');
    } else {
      setActiveScreen('page6_home');
    }
  };

  // Determine current tab from active screen
  const getCurrentTab = (): MainTab => {
    if (activeScreen === 'page6_home') return 'home';
    if (activeScreen === 'page7_weekly') return 'weekly';
    if (
      activeScreen === 'page8_calendar' ||
      activeScreen === 'page9_calendar_emotions' ||
      activeScreen === 'page10_stats'
    ) {
      return 'calendar';
    }
    if (activeScreen === 'page11_explore' || activeScreen === 'page12_recipes') {
      return 'explore';
    }
    return 'home';
  };

  const handleTabChange = (tab: MainTab) => {
    switch (tab) {
      case 'home':
        setActiveScreen('page6_home');
        break;
      case 'weekly':
        setActiveScreen('page7_weekly');
        break;
      case 'calendar':
        setActiveScreen('page8_calendar');
        break;
      case 'explore':
        setActiveScreen('page11_explore');
        break;
    }
  };

  const resetAllData = () => {
    if (window.confirm('¿Reiniciar todos los datos al estado inicial de la demo?')) {
      setAthletes(INITIAL_ATHLETES);
      setSelectedAthleteId(INITIAL_ATHLETES[0].id);
      setNutritionistName('Claudia Morales');
      setCoachName('Carlos Medina');
      setNutritionPlan(INITIAL_NUTRITION_PLAN);
      setRecipes([]);
      setCurrentRole('Deportista');
      setActiveScreen('page1_splash');
    }
  };

  const isMainAppScreen = [
    'page6_home',
    'page7_weekly',
    'page8_calendar',
    'page9_calendar_emotions',
    'page10_stats',
    'page11_explore',
    'page12_recipes',
  ].includes(activeScreen);

  // Profile adapter for existing screens that use UserProfile
  const athleteProfileAdapter: UserProfile = {
    name: activeAthlete.name,
    sport: activeAthlete.sport,
    ageGroup: activeAthlete.ageGroup,
    gender: activeAthlete.gender,
    role: 'Deportista',
    beltColor: activeAthlete.beltColor,
    weeklyFrequency: activeAthlete.weeklyFrequency,
    sessionDuration: activeAthlete.sessionDuration,
    habitualIntensity: activeAthlete.habitualIntensity,
    habitualSchedule: activeAthlete.habitualSchedule,
    completedOnboarding: true,
  };

  return (
    <div className="min-h-screen bg-[#4b5563] flex flex-col items-center justify-start p-2 sm:p-4 text-gray-900 font-sans selection:bg-amber-200">
      {/* Top Demo & Role Switcher Bar */}
      <header className="w-full max-w-lg mb-2.5 flex flex-col gap-2 p-2.5 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700 text-white shadow-xl select-none text-xs">
        {/* Top row: Brand & Screen selector & Frame controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="font-black text-amber-400 tracking-wider shrink-0 text-sm">
              RENDÍ+
            </span>
            <select
              value={activeScreen}
              onChange={(e) => setActiveScreen(e.target.value as ScreenId)}
              className="bg-gray-800 text-white font-semibold text-[11px] rounded-lg px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-400 truncate cursor-pointer"
              title="Seleccionar pantalla"
            >
              {SCREEN_LABELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.pageNum.startsWith('P') ? item.pageNum : `Pág ${item.pageNum}`}: {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-lg text-[10px] font-bold text-gray-200 transition-colors cursor-pointer border border-gray-700"
              title="Alternar entre marco de móvil y pantalla completa"
            >
              {isPhoneFrame ? '📱 Marco' : '🖥️ Fluido'}
            </button>
            <button
              type="button"
              onClick={resetAllData}
              className="bg-gray-800 hover:bg-rose-900 text-gray-300 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border border-gray-700"
              title="Reiniciar datos iniciales"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bottom row: Interactive Role Selector (Deportista / Nutricionista / Entrenador) */}
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-gray-800">
          <span className="text-[10px] font-bold text-gray-400 shrink-0">
            Rol actual:
          </span>
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => handleRoleSelect('Deportista')}
              className={`py-1 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center ${
                currentRole === 'Deportista'
                  ? 'bg-amber-400 text-gray-950 shadow-md ring-1 ring-amber-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🥋 Deportista
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Nutricionista')}
              className={`py-1 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center ${
                currentRole === 'Nutricionista'
                  ? 'bg-emerald-400 text-gray-950 shadow-md ring-1 ring-emerald-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🥗 Nutricionista
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Entrenador')}
              className={`py-1 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center ${
                currentRole === 'Entrenador'
                  ? 'bg-teal-400 text-gray-950 shadow-md ring-1 ring-teal-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📋 Entrenador
            </button>
          </div>
        </div>
      </header>

      {/* Main Mobile App Frame */}
      <main
        className={`w-full transition-all duration-300 relative ${
          isPhoneFrame
            ? 'max-w-[410px] min-h-[790px] rounded-[2.8rem] border-[10px] border-[#1e293b] shadow-2xl overflow-hidden bg-[#9ca3af]'
            : 'max-w-xl min-h-[790px] rounded-3xl border-4 border-[#1e293b] shadow-2xl overflow-hidden bg-[#9ca3af]'
        } flex flex-col justify-between`}
      >
        {/* Mobile Status Bar simulation */}
        <div className="w-full pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-gray-800 select-none">
          <span>09:41</span>
          <div className="w-20 h-4 bg-gray-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-xs">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Athlete Quick Switcher Pill (Visible when in Deportista role on main screens) */}
        {currentRole === 'Deportista' && isMainAppScreen && (
          <div className="bg-amber-200/90 border-b border-amber-300 px-3.5 py-1.5 flex items-center justify-between text-xs font-bold text-amber-950">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] text-amber-800 font-extrabold uppercase">Atleta:</span>
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="bg-white/90 text-gray-900 font-black text-xs rounded-lg px-2 py-0.5 border border-amber-400 cursor-pointer"
              >
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || 'Sin nombre'} ({a.sport.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddNewAthlete}
              className="text-[10px] font-black bg-amber-400 hover:bg-amber-500 text-gray-950 px-2 py-0.5 rounded-lg border border-amber-500 cursor-pointer shrink-0"
              title="Registrar los datos de un nuevo deportista"
            >
              + Nuevo Atleta
            </button>
          </div>
        )}

        {/* Professional Role Banner when in Athlete view but logged as Nutricionista or Entrenador */}
        {currentRole === 'Nutricionista' && isMainAppScreen && (
          <div className="bg-emerald-500 text-emerald-950 px-4 py-1.5 flex items-center justify-between text-[11px] font-black shadow-xs">
            <span>🥗 Vista deportista (Lic: {nutritionistName || 'Nutricionista'})</span>
            <button
              type="button"
              onClick={() => setActiveScreen('page_nutritionist')}
              className="bg-emerald-950 text-white px-2 py-0.5 rounded-md hover:bg-black cursor-pointer text-[10px]"
            >
              Volver a Panel Nutri →
            </button>
          </div>
        )}

        {currentRole === 'Entrenador' && isMainAppScreen && (
          <div className="bg-teal-500 text-teal-950 px-4 py-1.5 flex items-center justify-between text-[11px] font-black shadow-xs">
            <span>🥋 Vista deportista (Entrenador: {coachName || 'Entrenador'})</span>
            <button
              type="button"
              onClick={() => setActiveScreen('page_coach')}
              className="bg-teal-950 text-white px-2 py-0.5 rounded-md hover:bg-black cursor-pointer text-[10px]"
            >
              Volver a Panel Coach →
            </button>
          </div>
        )}

        {/* Screen Content Render */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Page 1: Splash Screen */}
          {activeScreen === 'page1_splash' && (
            <SplashScreen onStart={() => setActiveScreen('page2_name')} />
          )}

          {/* Page 2: Name Input Screen */}
          {activeScreen === 'page2_name' && (
            <NameScreen
              initialName={
                currentRole === 'Nutricionista'
                  ? nutritionistName
                  : currentRole === 'Entrenador'
                  ? coachName
                  : activeAthlete.name
              }
              onContinue={(name) => {
                if (currentRole === 'Nutricionista') {
                  setNutritionistName(name);
                  setActiveScreen('page_nutritionist');
                } else if (currentRole === 'Entrenador') {
                  setCoachName(name);
                  setActiveScreen('page_coach');
                } else {
                  updateActiveAthlete({ name });
                  setActiveScreen('page3_profile');
                }
              }}
              onBack={() => setActiveScreen('page1_splash')}
            />
          )}

          {/* Page 3: Profile & Sport Screen */}
          {activeScreen === 'page3_profile' && (
            <ProfileScreen
              profile={athleteProfileAdapter}
              onChange={(updates) => {
                if (updates.sport) updateActiveAthlete({ sport: updates.sport });
                if (updates.ageGroup) updateActiveAthlete({ ageGroup: updates.ageGroup });
                if (updates.gender) updateActiveAthlete({ gender: updates.gender });
                if (updates.role) {
                  handleRoleSelect(updates.role);
                }
              }}
              onContinue={() => {
                if (currentRole === 'Nutricionista') {
                  setActiveScreen('page_nutritionist');
                } else if (currentRole === 'Entrenador') {
                  setActiveScreen('page_coach');
                } else {
                  setActiveScreen('page4_training');
                }
              }}
              onBack={() => setActiveScreen('page2_name')}
            />
          )}

          {/* Page 4: Training Parameters Screen */}
          {activeScreen === 'page4_training' && (
            <TrainingScreen
              profile={athleteProfileAdapter}
              onChange={(updates) => {
                updateActiveAthlete(updates);
              }}
              onContinue={() => setActiveScreen('page5_ready')}
              onBack={() => setActiveScreen('page3_profile')}
            />
          )}

          {/* Page 5: Ready to start screen */}
          {activeScreen === 'page5_ready' && (
            <ReadyScreen sport={activeAthlete.sport} onStart={() => setActiveScreen('page6_home')} />
          )}

          {/* Page 6: Main Dashboard (Today) */}
          {activeScreen === 'page6_home' && (
            <HomeScreen
              profile={athleteProfileAdapter}
              todayLog={activeAthlete.todayLog}
              onUpdateLog={updateActiveAthleteTodayLog}
              onNavigateToTab={(tab) => handleTabChange(tab)}
              activeNutriTip={activeAthlete.activeNutriTip || nutritionPlan.activeNutriTip}
            />
          )}

          {/* Page 7: Weekly Compliance */}
          {activeScreen === 'page7_weekly' && (
            <WeeklyComplianceScreen
              logsHistory={activeAthlete.logsHistory}
              todayDate={activeAthlete.todayLog.date}
              onUpdateDayLog={updateActiveAthleteHistoryLog}
            />
          )}

          {/* Pages 8, 9, 10: Calendar & Emotional Diary & Stats */}
          {(activeScreen === 'page8_calendar' ||
            activeScreen === 'page9_calendar_emotions' ||
            activeScreen === 'page10_stats') && (
            <CalendarScreen logsHistory={activeAthlete.logsHistory} />
          )}

          {/* Page 11: Explore topics */}
          {activeScreen === 'page11_explore' && (
            <ExploreScreen
              recipes={recipes}
              injuries={activeAthlete.injuries}
              onDeleteRecipe={handleDeleteRecipe}
              canDelete={currentRole === 'Nutricionista'}
              onOpenCoachView={() => {
                setCurrentRole('Entrenador');
                setActiveScreen('page_coach');
              }}
            />
          )}

          {/* Page 12: Recipes catalog */}
          {activeScreen === 'page12_recipes' && (
            <RecipesScreen
              onBack={() => setActiveScreen('page11_explore')}
              recipes={recipes}
              onDeleteRecipe={handleDeleteRecipe}
              canDelete={currentRole === 'Nutricionista'}
            />
          )}

          {/* Dedicated Page for Nutricionista */}
          {activeScreen === 'page_nutritionist' && (
            <NutritionistScreen
              nutritionistName={nutritionistName}
              onUpdateNutritionistName={(name) => setNutritionistName(name)}
              athletes={athletes}
              selectedAthleteId={selectedAthleteId}
              onSelectAthlete={(id) => setSelectedAthleteId(id)}
              athleteProfile={activeAthlete}
              todayLog={activeAthlete.todayLog}
              logsHistory={activeAthlete.logsHistory}
              nutritionPlan={nutritionPlan}
              onUpdateNutritionPlan={(updated) => setNutritionPlan(updated)}
              recipes={recipes}
              onAddRecipe={handleAddRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              onViewAthleteHome={() => setActiveScreen('page6_home')}
            />
          )}

          {/* Dedicated Page for Entrenador */}
          {activeScreen === 'page_coach' && (
            <CoachScreen
              coachName={coachName}
              onUpdateCoachName={(name) => setCoachName(name)}
              athletes={athletes}
              selectedAthleteId={selectedAthleteId}
              onSelectAthlete={(id) => setSelectedAthleteId(id)}
              athleteProfile={activeAthlete}
              todayLog={activeAthlete.todayLog}
              logsHistory={activeAthlete.logsHistory}
              injuries={activeAthlete.injuries}
              onUpdateInjuries={updateActiveAthleteInjuries}
              onUpdateAthleteTraining={(updates) => updateActiveAthlete(updates)}
              onViewAthleteHome={() => setActiveScreen('page6_home')}
            />
          )}
        </div>

        {/* Bottom Navigation Bar (Visible on all main application screens 6 to 12) */}
        {isMainAppScreen && (
          <BottomNav
            currentTab={getCurrentTab()}
            onTabChange={(tab) => handleTabChange(tab)}
          />
        )}
      </main>

      {/* Footer information */}
      <footer className="mt-3 text-center text-xs text-gray-400 select-none">
        <p>RENDÍ+ • Nutrición y Hábitos Saludables para el Rendimiento Deportivo</p>
      </footer>
    </div>
  );
}
