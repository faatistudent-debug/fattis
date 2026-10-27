import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  UserProfile,
  AthleteData,
  DayHabitLog,
  Recipe,
  NutritionPlanNote,
  InjuryRecord,
} from '../types';

export interface UserAccountDoc {
  userId: string;
  email: string;
  name: string;
  role: 'Deportista' | 'Nutricionista' | 'Entrenador';
  sport?: string;
  ageGroup?: string;
  gender?: string;
  beltColor?: string;
  weeklyFrequency?: number;
  sessionDuration?: string;
  habitualIntensity?: string;
  habitualSchedule?: string;
  completedOnboarding?: boolean;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// USER PROFILES & RBAC
// -------------------------------------------------------------

export async function getUserProfile(userId: string): Promise<UserAccountDoc | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    return snap.data() as UserAccountDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createOrUpdateUserProfile(
  userId: string,
  data: Partial<UserAccountDoc>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const existing = await getDoc(doc(db, 'users', userId));
    const now = new Date().toISOString();
    if (!existing.exists()) {
      const fullDoc: UserAccountDoc = {
        userId,
        email: data.email || '',
        name: data.name || 'Usuario',
        role: data.role || 'Deportista',
        sport: data.sport || 'taekwondo',
        ageGroup: data.ageGroup || '18 - 29 a',
        gender: data.gender || 'Masculino',
        beltColor: data.beltColor || 'celeste',
        weeklyFrequency: data.weeklyFrequency || 5,
        sessionDuration: data.sessionDuration || '1 a 2 horas',
        habitualIntensity: data.habitualIntensity || 'Moderada',
        habitualSchedule: data.habitualSchedule || 'Tarde',
        completedOnboarding: data.completedOnboarding ?? false,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, 'users', userId), fullDoc);
    } else {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: now,
      });
    }

    // Also synchronize sport and training fields with athletes collection doc
    try {
      const athleteRef = doc(db, 'athletes', userId);
      const athSnap = await getDoc(athleteRef);
      if (athSnap.exists()) {
        const updatePayload: Record<string, any> = {};
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.sport !== undefined) updatePayload.sport = data.sport;
        if (data.ageGroup !== undefined) updatePayload.ageGroup = data.ageGroup;
        if (data.gender !== undefined) updatePayload.gender = data.gender;
        if (data.beltColor !== undefined) updatePayload.beltColor = data.beltColor;
        if (data.weeklyFrequency !== undefined) updatePayload.weeklyFrequency = data.weeklyFrequency;
        if (data.sessionDuration !== undefined) updatePayload.sessionDuration = data.sessionDuration;
        if (data.habitualIntensity !== undefined) updatePayload.habitualIntensity = data.habitualIntensity;
        if (data.habitualSchedule !== undefined) updatePayload.habitualSchedule = data.habitualSchedule;

        if (Object.keys(updatePayload).length > 0) {
          await updateDoc(athleteRef, updatePayload);
        }
      }
    } catch {
      // Ignored non-critical sync
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// -------------------------------------------------------------
// ATHLETE PROFILE & SEPARATION OF RECORDS
// -------------------------------------------------------------

export async function initAthleteDoc(userId: string, profile: Partial<AthleteData>): Promise<void> {
  const path = `athletes/${userId}`;
  try {
    const athleteDocRef = doc(db, 'athletes', userId);
    const snap = await getDoc(athleteDocRef);
    if (!snap.exists()) {
      const athletePayload = {
        id: userId,
        name: profile.name || 'Deportista',
        sport: profile.sport || 'taekwondo',
        ageGroup: profile.ageGroup || '18 - 29 a',
        gender: profile.gender || 'Masculino',
        beltColor: profile.beltColor || 'celeste',
        weeklyFrequency: profile.weeklyFrequency || 5,
        sessionDuration: profile.sessionDuration || '1 a 2 horas',
        habitualIntensity: profile.habitualIntensity || 'Moderada',
        habitualSchedule: profile.habitualSchedule || 'Tarde',
        activeNutriTip: profile.activeNutriTip || 'Mantén tu hidratación y registra cada comida del día.',
        createdAt: new Date().toISOString(),
      };
      await setDoc(athleteDocRef, athletePayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeAthletesList(callback: (athletes: AthleteData[]) => void): () => void {
  const path = 'athletes';
  return onSnapshot(
    collection(db, 'athletes'),
    (snapshot) => {
      const list: AthleteData[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.name || 'Deportista',
          sport: d.sport || 'taekwondo',
          ageGroup: d.ageGroup || '18 - 29 a',
          gender: d.gender || 'Masculino',
          beltColor: d.beltColor || 'celeste',
          weeklyFrequency: d.weeklyFrequency || 5,
          sessionDuration: d.sessionDuration || '1 a 2 horas',
          habitualIntensity: d.habitualIntensity || 'Moderada',
          habitualSchedule: d.habitualSchedule || 'Tarde',
          todayLog: {
            date: new Date().toISOString().split('T')[0],
            meals: { desayuno: false, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
            customMeals: [],
            waterGlasses: 0,
            sleepHours: 7,
            sleepCompleted: false,
            trainingHours: 2,
            trainingCompleted: false,
          },
          logsHistory: {},
          injuries: [],
          activeNutriTip: d.activeNutriTip || '',
        });
      });
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// -------------------------------------------------------------
// DAILY LOGS (MEALS, PHOTOS, HYDRATION, SLEEP)
// Strictly isolated per athlete subcollection
// -------------------------------------------------------------

export async function saveDailyHabitLog(athleteId: string, log: DayHabitLog): Promise<void> {
  const path = `athletes/${athleteId}/dailyLogs/${log.date}`;
  try {
    const cleanLog = {
      userId: athleteId,
      date: log.date,
      waterGlasses: Number(log.waterGlasses) || 0,
      sleepHours: Number(log.sleepHours) || 0,
      sleepCompleted: Boolean(log.sleepCompleted),
      trainingHours: Number(log.trainingHours) || 0,
      trainingCompleted: Boolean(log.trainingCompleted),
      meals: log.meals || {
        desayuno: false,
        merienda_am: false,
        almuerzo: false,
        merienda_pm: false,
        cena: false,
      },
      customMeals: log.customMeals || [],
      mood: log.mood || 'feliz',
      moodNote: log.moodNote || '',
      restQuality: log.restQuality || 'Bueno',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'athletes', athleteId, 'dailyLogs', log.date), cleanLog, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeAthleteDailyLogs(
  athleteId: string,
  callback: (logs: Record<string, DayHabitLog>) => void
): () => void {
  const path = `athletes/${athleteId}/dailyLogs`;
  return onSnapshot(
    collection(db, 'athletes', athleteId, 'dailyLogs'),
    (snapshot) => {
      const records: Record<string, DayHabitLog> = {};
      snapshot.forEach((docSnap) => {
        records[docSnap.id] = docSnap.data() as DayHabitLog;
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// -------------------------------------------------------------
// RECIPES (Managed by Nutricionista, viewed by all authenticated users)
// -------------------------------------------------------------

export function subscribeRecipes(callback: (recipes: Recipe[]) => void): () => void {
  const path = 'recipes';
  return onSnapshot(
    collection(db, 'recipes'),
    (snapshot) => {
      const list: Recipe[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Recipe);
      });
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveRecipeToFirestore(recipe: Recipe): Promise<void> {
  const path = `recipes/${recipe.id}`;
  try {
    await setDoc(doc(db, 'recipes', recipe.id), {
      ...recipe,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRecipeFromFirestore(recipeId: string): Promise<void> {
  const path = `recipes/${recipeId}`;
  try {
    await deleteDoc(doc(db, 'recipes', recipeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// NUTRITION PLANS & INJURIES
// -------------------------------------------------------------

export function subscribeNutritionPlan(
  athleteId: string,
  callback: (plan: NutritionPlanNote | null) => void
): () => void {
  const path = `athletes/${athleteId}/nutritionPlans`;
  return onSnapshot(
    collection(db, 'athletes', athleteId, 'nutritionPlans'),
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      const firstDoc = snapshot.docs[0].data() as NutritionPlanNote;
      callback(firstDoc);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveNutritionPlanToFirestore(
  athleteId: string,
  plan: NutritionPlanNote
): Promise<void> {
  const planId = plan.id || 'current-plan';
  const path = `athletes/${athleteId}/nutritionPlans/${planId}`;
  try {
    await setDoc(doc(db, 'athletes', athleteId, 'nutritionPlans', planId), {
      ...plan,
      id: planId,
      athleteId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeAthleteInjuries(
  athleteId: string,
  callback: (injuries: InjuryRecord[]) => void
): () => void {
  const path = `athletes/${athleteId}/injuries`;
  return onSnapshot(
    collection(db, 'athletes', athleteId, 'injuries'),
    (snapshot) => {
      const list: InjuryRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as InjuryRecord);
      });
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveInjuryToFirestore(
  athleteId: string,
  injury: InjuryRecord
): Promise<void> {
  const path = `athletes/${athleteId}/injuries/${injury.id}`;
  try {
    await setDoc(doc(db, 'athletes', athleteId, 'injuries', injury.id), {
      ...injury,
      athleteId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
