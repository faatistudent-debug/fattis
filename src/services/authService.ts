import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { UserAccountDoc, initAthleteDoc } from './db';
import { RoleType } from '../types';
import { User } from 'firebase/auth';

const SESSION_STORAGE_KEY = 'rendiplus_active_session_v2';

/**
 * Hashes a plaintext password using browser native SHA-256 Web Crypto
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_rendiplus_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Searches for an existing user account in Firestore by email
 */
export async function findUserByEmail(email: string): Promise<{ docId: string; data: UserAccountDoc & { passwordHash?: string } } | null> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const first = snap.docs[0];
      return { docId: first.id, data: first.data() as any };
    }

    // Fallback: iterate docs in case of case mismatches
    const allSnap = await getDocs(collection(db, 'users'));
    for (const d of allSnap.docs) {
      const data = d.data() as any;
      if (data.email && data.email.toLowerCase() === cleanEmail) {
        return { docId: d.id, data };
      }
    }
    return null;
  } catch (err) {
    console.error('Error finding user by email:', err);
    return null;
  }
}

/**
 * Creates a synthetic User object compatible with Firebase User
 */
export function createSyntheticUser(uid: string, email: string, displayName: string): User {
  return {
    uid,
    email,
    displayName,
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'synthetic-token-' + uid,
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({ uid, email, displayName }),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  };
}

/**
 * Registers a new user account in Firestore
 */
export async function registerNewUser(
  email: string,
  pass: string,
  name: string,
  role: RoleType
): Promise<{ user: User; profile: UserAccountDoc }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || 'Usuario';
  const cleanPass = pass.trim();

  // Check if account already exists in Firestore
  const existing = await findUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('Este correo electrónico ya está registrado. Selecciona "Iniciar Sesión" para acceder.');
  }

  const pwdHash = await hashPassword(cleanPass);
  const now = new Date().toISOString();
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const profile: UserAccountDoc & { passwordHash: string } = {
    userId,
    email: cleanEmail,
    name: cleanName,
    role,
    sport: 'taekwondo',
    ageGroup: '18 - 29 a',
    gender: 'Masculino',
    beltColor: 'celeste',
    weeklyFrequency: 5,
    sessionDuration: '1 a 2 horas',
    habitualIntensity: 'Moderada',
    habitualSchedule: 'Tarde',
    completedOnboarding: role === 'Deportista' ? false : true,
    passwordHash: pwdHash,
    createdAt: now,
    updatedAt: now,
  };

  // Save to Firestore
  await setDoc(doc(db, 'users', userId), profile);

  // If Deportista, initialize athlete doc and dailyLog
  if (role === 'Deportista') {
    await initAthleteDoc(userId, {
      id: userId,
      name: cleanName,
    });
  }

  const syntheticUser = createSyntheticUser(userId, cleanEmail, cleanName);

  // Save session
  persistActiveSession({
    userId,
    email: cleanEmail,
    name: cleanName,
    role,
  });

  return { user: syntheticUser, profile };
}

/**
 * Authenticates an existing user account in Firestore
 */
export async function loginUser(
  email: string,
  pass: string,
  desiredRole?: RoleType
): Promise<{ user: User; profile: UserAccountDoc }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  const existing = await findUserByEmail(cleanEmail);
  if (!existing) {
    throw new Error('No existe una cuenta registrada con este correo electrónico. Por favor haz clic en la pestaña "Crear Cuenta" para registrarte.');
  }

  const userDoc = existing.data;
  const inputHash = await hashPassword(cleanPass);

  // If doc has a stored passwordHash, verify it
  if (userDoc.passwordHash && userDoc.passwordHash !== inputHash) {
    throw new Error('Contraseña incorrecta para esta cuenta. Por favor verifica tus credenciales.');
  }

  // Update role if desiredRole provided
  let effectiveRole = userDoc.role || 'Deportista';
  if (desiredRole && desiredRole !== effectiveRole) {
    effectiveRole = desiredRole;
    await updateDoc(doc(db, 'users', existing.docId), {
      role: effectiveRole,
      updatedAt: new Date().toISOString(),
    });
    userDoc.role = effectiveRole;
  }

  // If newly switched to Deportista, make sure athlete doc exists
  if (effectiveRole === 'Deportista') {
    await initAthleteDoc(existing.docId, {
      id: existing.docId,
      name: userDoc.name,
    });
  }

  const syntheticUser = createSyntheticUser(existing.docId, cleanEmail, userDoc.name);

  // Save session
  persistActiveSession({
    userId: existing.docId,
    email: cleanEmail,
    name: userDoc.name,
    role: effectiveRole,
  });

  return { user: syntheticUser, profile: userDoc };
}

export interface StoredSession {
  userId: string;
  email: string;
  name: string;
  role: RoleType;
}

export function persistActiveSession(session: StoredSession): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
}

export function getActiveSession(): StoredSession | null {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    }
    return null;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {}
}
