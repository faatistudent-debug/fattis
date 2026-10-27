/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/screens/AuthScreen';
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
import {
  subscribeAthleteDailyLogs,
  saveDailyHabitLog,
  subscribeAthletesList,
  subscribeRecipes,
  saveRecipeToFirestore,
  deleteRecipeFromFirestore,
  subscribeNutritionPlan,
  saveNutritionPlanToFirestore,
  subscribeAthleteInjuries,
  saveInjuryToFirestore,
  createOrUpdateUserProfile,
} from './services/db';
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
import { ShieldCheck, LogOut, Lock, RefreshCw, UserCheck, Sparkles, Smartphone, Monitor } from 'lucide-react';

export type ScreenId =
  | 'page1_splash'
  | 'page2_name'
  | 'page3_profile'
  | 'page4_training'
  | 'page5_ready'
  | 'page6_home'
  | 'page7_weekly'
  | 'page8_calendar'
  | 'page11_explore'
  | 'page12_recipes'
  | 'page_nutritionist'
  | 'page_coach';

export default function App() {
  const {
    currentUser,
    userProfile,
    loading,
    signOutUser,
  } = useAuth();

  // Role determined by server profile
  const currentRole: RoleType = userProfile?.role || 'Deportista';

  // Registered athletes list from Firestore (for staff roles)
  const [athletesList, setAthletesList] = useState<AthleteData[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');

  // Athlete's own logs (for logged-in athlete) or selected athlete's logs (for staff)
  const [athleteLogs, setAthleteLogs] = useState<Record<string, DayHabitLog>>({});

  // Recipes live from Firestore
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Nutrition plan for active athlete
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanNote>(INITIAL_NUTRITION_PLAN);

  // Injuries list for active athlete
  const [athleteInjuries, setAthleteInjuries] = useState<InjuryRecord[]>([]);

  // Active screen
  const [activeScreen, setActiveScreen] = useState<ScreenId>('page6_home');

  // Phone frame toggle
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Set default screen based on role
  useEffect(() => {
    if (currentRole === 'Nutricionista') {
      setActiveScreen('page_nutritionist');
    } else if (currentRole === 'Entrenador') {
      setActiveScreen('page_coach');
    } else {
      setActiveScreen('page6_home');
    }
  }, [currentRole, currentUser?.uid]);

  // Subscribe to athletes list if staff
  useEffect(() => {
    if (!currentUser) return;
    if (currentRole === 'Nutricionista' || currentRole === 'Entrenador') {
      const unsub = subscribeAthletesList((list) => {
        setAthletesList(list);
        if (list.length > 0 && (!selectedAthleteId || !list.some((a) => a.id === selectedAthleteId))) {
          setSelectedAthleteId(list[0].id);
        }
      });
      return () => unsub();
    }
  }, [currentUser, currentRole, selectedAthleteId]);

  // Subscribe to recipes for all authenticated users
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeRecipes((list) => {
      // If Firestore recipes is empty, seed with initial mock recipes
      if (list.length === 0) {
        setRecipes(RECIPES_DATA);
      } else {
        setRecipes(list);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Determine whose logs to subscribe to:
  // If Deportista -> strictly currentUser.uid (NO CROSS TALK)
  // If Staff -> selectedAthleteId or fallback
  const targetAthleteUid =
    currentRole === 'Deportista'
      ? currentUser?.uid || ''
      : selectedAthleteId || (athletesList[0]?.id || '');

  // Subscribe to athlete daily logs
  useEffect(() => {
    if (!currentUser || !targetAthleteUid) return;
    const unsub = subscribeAthleteDailyLogs(targetAthleteUid, (logs) => {
      setAthleteLogs(logs);
    });
    return () => unsub();
  }, [currentUser, targetAthleteUid]);

  // Subscribe to nutrition plan for the target athlete
  useEffect(() => {
    if (!currentUser || !targetAthleteUid) return;
    const unsub = subscribeNutritionPlan(targetAthleteUid, (plan) => {
      if (plan) setNutritionPlan(plan);
      else setNutritionPlan(INITIAL_NUTRITION_PLAN);
    });
    return () => unsub();
  }, [currentUser, targetAthleteUid]);

  // Subscribe to injuries for the target athlete
  useEffect(() => {
    if (!currentUser || !targetAthleteUid) return;
    const unsub = subscribeAthleteInjuries(targetAthleteUid, (injuries) => {
      setAthleteInjuries(injuries);
    });
    return () => unsub();
  }, [currentUser, targetAthleteUid]);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Active athlete object
  const activeAthlete: AthleteData = {
    id: targetAthleteUid,
    name:
      currentRole === 'Deportista'
        ? userProfile?.name || 'Deportista'
        : athletesList.find((a) => a.id === targetAthleteUid)?.name || 'Deportista',
    sport:
      currentRole === 'Deportista'
        ? ((userProfile?.sport as SportType) || 'taekwondo')
        : ((athletesList.find((a) => a.id === targetAthleteUid)?.sport as SportType) || 'taekwondo'),
    ageGroup: (userProfile?.ageGroup as any) || '18 - 29 a',
    gender: (userProfile?.gender as any) || 'Masculino',
    beltColor: (userProfile?.beltColor as any) || 'celeste',
    weeklyFrequency: userProfile?.weeklyFrequency || 5,
    sessionDuration: (userProfile?.sessionDuration as any) || '1 a 2 horas',
    habitualIntensity: (userProfile?.habitualIntensity as any) || 'Moderada',
    habitualSchedule: (userProfile?.habitualSchedule as any) || 'Tarde',
    todayLog: athleteLogs[todayStr] || {
      date: todayStr,
      meals: { desayuno: false, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
      customMeals: [],
      waterGlasses: 0,
      sleepHours: 7,
      sleepCompleted: false,
      trainingHours: 2,
      trainingCompleted: false,
      restQuality: 'Bueno',
    },
    logsHistory: athleteLogs,
    injuries: athleteInjuries,
    activeNutriTip: nutritionPlan.activeNutriTip,
  };

  // Convert to UserProfile shape for screens expecting UserProfile
  const athleteProfileAdapter: UserProfile = {
    name: activeAthlete.name,
    sport: activeAthlete.sport,
    ageGroup: activeAthlete.ageGroup,
    gender: activeAthlete.gender,
    role: currentRole,
    beltColor: activeAthlete.beltColor,
    weeklyFrequency: activeAthlete.weeklyFrequency,
    sessionDuration: activeAthlete.sessionDuration,
    habitualIntensity: activeAthlete.habitualIntensity,
    habitualSchedule: activeAthlete.habitualSchedule,
    completedOnboarding: true,
  };

  // Handlers for updating active athlete logs in Firestore (Protected: Only athlete can edit their data)
  const updateActiveAthleteTodayLog = async (updates: Partial<DayHabitLog>) => {
    if (!currentUser) return;
    if (currentRole !== 'Deportista') {
      console.warn('Acceso denegado: Nutricionistas y Entrenadores solo pueden consultar la información del deportista, no editarla.');
      return;
    }
    const currentToday = activeAthlete.todayLog;
    const updated: DayHabitLog = {
      ...currentToday,
      ...updates,
      date: todayStr,
    };
    // Save directly to Firestore under this athlete's UID
    await saveDailyHabitLog(targetAthleteUid, updated);
  };

  const updateActiveAthleteHistoryLog = async (date: string, updates: Partial<DayHabitLog>) => {
    if (!currentUser) return;
    if (currentRole !== 'Deportista') {
      console.warn('Acceso denegado: Solo el deportista puede editar sus registros históricos.');
      return;
    }
    const existing = athleteLogs[date] || {
      date,
      meals: { desayuno: false, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
      waterGlasses: 0,
      sleepHours: 7,
      sleepCompleted: false,
      trainingHours: 2,
      trainingCompleted: false,
      restQuality: 'Bueno' as const,
    };
    const updated: DayHabitLog = {
      ...existing,
      ...updates,
      date,
    };
    await saveDailyHabitLog(targetAthleteUid, updated);
  };

  // Recipe management handlers (Firestore backed with authorship protection)
  const handleAddRecipe = async (newRecipe: Recipe) => {
    const enrichedRecipe: Recipe = {
      ...newRecipe,
      authorId: newRecipe.authorId || currentUser?.uid || '',
      authorName: newRecipe.authorName || userProfile?.name || 'Usuario',
      authorEmail: newRecipe.authorEmail || currentUser?.email || '',
      createdAt: newRecipe.createdAt || new Date().toISOString(),
    };
    await saveRecipeToFirestore(enrichedRecipe);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const target = recipes.find((r) => r.id === recipeId);
    if (target && target.authorId && target.authorId !== currentUser?.uid) {
      console.warn('Acceso denegado: Solo el autor que publicó la receta puede eliminarla.');
      return;
    }
    await deleteRecipeFromFirestore(recipeId);
  };

  const handleUpdateRecipe = async (updatedRecipe: Recipe) => {
    if (updatedRecipe.authorId && updatedRecipe.authorId !== currentUser?.uid) {
      console.warn('Acceso denegado: Solo el autor que publicó la receta puede modificarla.');
      return;
    }
    await saveRecipeToFirestore(updatedRecipe);
  };

  // Navigation tabs
  const getCurrentTab = (): MainTab => {
    if (activeScreen === 'page6_home') return 'home';
    if (activeScreen === 'page7_weekly') return 'weekly';
    if (activeScreen === 'page8_calendar') {
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

  const isMainAppScreen = [
    'page6_home',
    'page7_weekly',
    'page8_calendar',
    'page11_explore',
    'page12_recipes',
  ].includes(activeScreen);

  // If initial auth is verifying
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-lg font-bold tracking-wide">Iniciando sesión segura...</h2>
        <p className="text-xs text-slate-400 mt-1">Conectando con Firestore y verificando permisos RBAC</p>
      </div>
    );
  }

  // If user is not authenticated -> AuthScreen
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex flex-col items-center p-2 sm:p-4 font-sans select-none">
      
      {/* Top Global Control Bar: Clean Session & Role Display */}
      <header className="w-full max-w-4xl bg-[#1e293b]/95 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 mb-3 shadow-lg flex items-center justify-between gap-2">
        {/* User Profile & Role Info (Locked to authenticated session) */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs sm:text-sm">
                {userProfile?.name || 'Usuario'}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentRole === 'Deportista'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : currentRole === 'Nutricionista'
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-teal-400/20 text-teal-300 border border-teal-400/40'
                }`}
              >
                {currentRole === 'Nutricionista' ? '🥗 Nutricionista' : currentRole === 'Entrenador' ? '⏱️ Entrenador' : '🥋 Deportista'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[200px]">{currentUser.email}</span>
              <span className="text-emerald-400 font-semibold">• Sesión Activa</span>
            </div>
          </div>
        </div>

        {/* View Toggle & Sign Out */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
            title="Alternar marco de teléfono"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[10px]">
              {isPhoneFrame ? 'Vista Pantalla' : 'Vista Móvil'}
            </span>
          </button>

          <button
            type="button"
            onClick={signOutUser}
            className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Cerrar sesión segura de esta cuenta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px]">Cerrar Sesión</span>
          </button>
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
        {/* Mobile Status Bar */}
        <div className="w-full pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-gray-800 select-none bg-slate-200/50">
          <span>09:41</span>
          <div className="w-20 h-4 bg-gray-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-xs">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Strict isolation badge for athlete view */}
        {currentRole === 'Deportista' && isMainAppScreen && (
          <div className="bg-amber-100 border-b border-amber-300 px-3.5 py-1.5 flex items-center justify-between text-xs font-bold text-amber-950">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded uppercase font-black">
                Tu Cuenta Personal
              </span>
              <span className="truncate">{activeAthlete.name} ({activeAthlete.sport.toUpperCase()})</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold shrink-0">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Registros aislados</span>
            </div>
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
              initialName={activeAthlete.name}
              onContinue={(name) => {
                if (currentUser) {
                  createOrUpdateUserProfile(currentUser.uid, { name });
                }
                setActiveScreen('page3_profile');
              }}
              onBack={() => setActiveScreen('page1_splash')}
            />
          )}

          {/* Page 3: Profile & Sport Screen */}
          {activeScreen === 'page3_profile' && (
            <ProfileScreen
              profile={athleteProfileAdapter}
              onChange={(updates) => {
                if (currentUser) {
                  createOrUpdateUserProfile(currentUser.uid, updates as any);
                }
              }}
              onContinue={() => setActiveScreen('page4_training')}
              onBack={() => setActiveScreen('page2_name')}
            />
          )}

          {/* Page 4: Training Parameters Screen */}
          {activeScreen === 'page4_training' && (
            <TrainingScreen
              profile={athleteProfileAdapter}
              onChange={(updates) => {
                if (currentUser) {
                  createOrUpdateUserProfile(currentUser.uid, updates as any);
                }
              }}
              onContinue={() => setActiveScreen('page5_ready')}
              onBack={() => setActiveScreen('page3_profile')}
            />
          )}

          {/* Page 5: Ready to start screen */}
          {activeScreen === 'page5_ready' && (
            <ReadyScreen
              sport={activeAthlete.sport}
              onStart={() => setActiveScreen('page6_home')}
            />
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

          {/* Page 8: Calendario de Hábitos */}
          {activeScreen === 'page8_calendar' && (
            <CalendarScreen logsHistory={activeAthlete.logsHistory} />
          )}

          {/* Page 11: Explore topics */}
          {activeScreen === 'page11_explore' && (
            <ExploreScreen
              recipes={recipes}
              injuries={activeAthlete.injuries}
              onDeleteRecipe={handleDeleteRecipe}
              currentUserId={currentUser?.uid}
              canDelete={false}
              onOpenCoachView={() => {
                setActiveScreen('page_coach');
              }}
            />
          )}

          {/* Page 12: Recipes catalog */}
          {activeScreen === 'page12_recipes' && (
            <RecipesScreen
              onBack={() => setActiveScreen('page11_explore')}
              recipes={recipes}
              currentUserId={currentUser?.uid}
              onDeleteRecipe={handleDeleteRecipe}
              canDelete={false}
            />
          )}

          {/* Dedicated Page for Nutricionista */}
          {activeScreen === 'page_nutritionist' && (
            <NutritionistScreen
              nutritionistName={userProfile?.name || 'Dra. Claudia Morales'}
              onUpdateNutritionistName={(name) => {
                if (currentUser) createOrUpdateUserProfile(currentUser.uid, { name });
              }}
              athletes={athletesList}
              selectedAthleteId={selectedAthleteId}
              onSelectAthlete={(id) => setSelectedAthleteId(id)}
              athleteProfile={activeAthlete}
              todayLog={activeAthlete.todayLog}
              logsHistory={activeAthlete.logsHistory}
              nutritionPlan={nutritionPlan}
              onUpdateNutritionPlan={async (updated) => {
                setNutritionPlan(updated);
                if (targetAthleteUid) {
                  await saveNutritionPlanToFirestore(targetAthleteUid, updated);
                }
              }}
              recipes={recipes}
              onAddRecipe={handleAddRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              currentUserId={currentUser?.uid}
            />
          )}

          {/* Dedicated Page for Entrenador */}
          {activeScreen === 'page_coach' && (
            <CoachScreen
              coachName={userProfile?.name || 'Prof. Carlos Medina'}
              onUpdateCoachName={(name) => {
                if (currentUser) createOrUpdateUserProfile(currentUser.uid, { name });
              }}
              athletes={athletesList}
              selectedAthleteId={selectedAthleteId}
              onSelectAthlete={(id) => setSelectedAthleteId(id)}
              athleteProfile={activeAthlete}
              todayLog={activeAthlete.todayLog}
              logsHistory={activeAthlete.logsHistory}
              injuries={activeAthlete.injuries}
              onUpdateInjuries={async (newInjuries) => {
                setAthleteInjuries(newInjuries);
                if (targetAthleteUid && newInjuries.length > 0) {
                  for (const inj of newInjuries) {
                    await saveInjuryToFirestore(targetAthleteUid, inj);
                  }
                }
              }}
            />
          )}
        </div>

        {/* Bottom Navigation Bar (Visible strictly for Deportistas on main screens) */}
        {isMainAppScreen && currentRole === 'Deportista' && (
          <BottomNav
            currentTab={getCurrentTab()}
            onTabChange={(tab) => handleTabChange(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-3 text-center text-xs text-gray-400 select-none">
        <p>RENDÍ+ • Cuentas Individuales & Base de Datos Firestore con Control de Acceso por Roles (RBAC)</p>
      </footer>
    </div>
  );
}
