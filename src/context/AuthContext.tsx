import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  getUserProfile,
  createOrUpdateUserProfile,
  initAthleteDoc,
  UserAccountDoc,
  saveDailyHabitLog,
} from '../services/db';
import {
  registerNewUser,
  loginUser,
  persistActiveSession,
  getActiveSession,
  clearActiveSession,
  createSyntheticUser,
} from '../services/authService';
import { RoleType } from '../types';
import { INITIAL_DAY_LOG, INITIAL_LOGS_HISTORY } from '../data/initialData';
import {
  resolveIdentifierToEmail,
  saveRegisteredUserRecord,
  getSavedUsersList,
  slugifyUsername,
  RegisteredUserRecord,
} from '../utils/authHelpers';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserAccountDoc | null;
  loading: boolean;
  savedUsers: RegisteredUserRecord[];
  signInEmail: (email: string, pass: string) => Promise<void>;
  signInWithUsernameOrEmail: (
    identifier: string,
    pass: string,
    desiredRole?: RoleType
  ) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, role: RoleType) => Promise<void>;
  signUpWithUsernameOrEmail: (
    nameOrUsername: string,
    pass: string,
    role: RoleType,
    customEmail?: string
  ) => Promise<void>;
  signInGoogle: (roleIfNew: RoleType) => Promise<void>;
  signOutUser: () => Promise<void>;
  quickLoginDemo: (type: 'faati' | 'lucas' | 'sofia' | 'nutri' | 'coach') => Promise<void>;
  switchUserRole: (newRole: RoleType) => Promise<void>;
  enterDirectSession: (name?: string, role?: RoleType, customEmail?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserAccountDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedUsers, setSavedUsers] = useState<RegisteredUserRecord[]>(() => getSavedUsersList());

  // Sync profile when currentUser changes
  const refreshUserProfile = async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }
    try {
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        // Fallback default registration if not found yet
        const defaultRole: RoleType = 'Nutricionista';
        await createOrUpdateUserProfile(user.uid, {
          userId: user.uid,
          email: user.email || '',
          name: user.displayName || 'Usuario',
          role: defaultRole,
        });
        profile = await getUserProfile(user.uid);
      }
      setUserProfile(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check for stored active session on boot
    const stored = getActiveSession();
    if (stored) {
      getUserProfile(stored.userId).then((profile) => {
        if (profile) {
          const userObj = createSyntheticUser(stored.userId, stored.email, stored.name);
          setCurrentUser(userObj);
          setUserProfile(profile);
          setLoading(false);
        } else {
          clearActiveSession();
          setLoading(false);
        }
      }).catch(() => {
        setLoading(false);
      });
    }

    // 2. Also listen for Firebase native Auth (e.g. Google Sign-In)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await refreshUserProfile(user);
      } else if (!getActiveSession()) {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user, profile } = await loginUser(email, pass);
      setCurrentUser(user);
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsernameOrEmail = async (
    identifier: string,
    pass: string,
    desiredRole?: RoleType
  ) => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      throw new Error('Por favor ingresa tu correo electrónico.');
    }
    const cleanPass = pass.trim();
    if (!cleanPass) {
      throw new Error('Por favor ingresa tu contraseña.');
    }

    setLoading(true);
    try {
      // 1. Authenticate with universal Firestore accounts service
      const { user, profile } = await loginUser(trimmed, cleanPass, desiredRole);
      setCurrentUser(user);
      setUserProfile(profile);

      // 2. Also attempt Firebase Auth in parallel if configured (non-blocking)
      try {
        await signInWithEmailAndPassword(auth, user.email || trimmed, cleanPass);
      } catch {
        // Ignored if provider disabled in Firebase
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string, role: RoleType) => {
    setLoading(true);
    try {
      // 1. Register with universal Firestore accounts service
      const { user, profile } = await registerNewUser(email, pass, name, role);
      setCurrentUser(user);
      setUserProfile(profile);

      // 2. Also attempt Firebase Auth in parallel if configured (non-blocking)
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch {
        // Ignored if provider disabled in Firebase
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithUsernameOrEmail = async (
    nameOrUsername: string,
    pass: string,
    role: RoleType,
    customEmail?: string
  ) => {
    const cleanName = nameOrUsername.trim();
    if (!cleanName) {
      throw new Error('Por favor ingresa tu nombre de usuario o nombre completo');
    }
    if (!pass || pass.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const effectiveEmail = customEmail?.trim()
      ? customEmail.trim().toLowerCase()
      : cleanName.includes('@')
      ? cleanName.toLowerCase()
      : `${slugifyUsername(cleanName)}@rendiplus.app`;

    await signUpEmail(effectiveEmail, pass, cleanName, role);
  };

  const switchUserRole = async (newRole: RoleType) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await createOrUpdateUserProfile(currentUser.uid, { role: newRole });
      await refreshUserProfile(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async (roleIfNew: RoleType) => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      let profile = await getUserProfile(cred.user.uid);
      if (!profile) {
        await createOrUpdateUserProfile(cred.user.uid, {
          userId: cred.user.uid,
          email: cred.user.email || '',
          name: cred.user.displayName || 'Usuario',
          role: roleIfNew,
        });
        if (roleIfNew === 'Deportista') {
          await initAthleteDoc(cred.user.uid, {
            id: cred.user.uid,
            name: cred.user.displayName || 'Deportista',
          });
        }
      }
      await refreshUserProfile(cred.user);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      clearActiveSession();
      try {
        await signOut(auth);
      } catch {}
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const quickLoginDemo = async (type: 'faati' | 'lucas' | 'sofia' | 'nutri' | 'coach') => {
    setLoading(true);
    const demoConfigs = {
      faati: {
        email: 'faati.nutricionista@rendiplus.demo',
        pass: 'RendiDemo2026!',
        name: 'Lic. Faati Morales (Nutricionista)',
        role: 'Nutricionista' as RoleType,
      },
      lucas: {
        email: 'lucas.taekwondo@rendiplus.demo',
        pass: 'RendiDemo2026!',
        name: 'Lucas Silva',
        role: 'Deportista' as RoleType,
        sport: 'taekwondo',
      },
      sofia: {
        email: 'sofia.natacion@rendiplus.demo',
        pass: 'RendiDemo2026!',
        name: 'Sofía Valdés',
        role: 'Deportista' as RoleType,
        sport: 'natacion',
      },
      nutri: {
        email: 'claudia.morales@rendiplus.demo',
        pass: 'RendiDemo2026!',
        name: 'Dra. Claudia Morales',
        role: 'Nutricionista' as RoleType,
      },
      coach: {
        email: 'carlos.medina@rendiplus.demo',
        pass: 'RendiDemo2026!',
        name: 'Prof. Carlos Medina',
        role: 'Entrenador' as RoleType,
      },
    };

    const cfg = demoConfigs[type];

    try {
      // Attempt login first
      let credUser: User;
      try {
        const res = await signInWithEmailAndPassword(auth, cfg.email, cfg.pass);
        credUser = res.user;
      } catch (loginErr: any) {
        // If user not found, create demo user
        if (loginErr?.code === 'auth/user-not-found' || loginErr?.code === 'auth/invalid-credential') {
          const createRes = await createUserWithEmailAndPassword(auth, cfg.email, cfg.pass);
          credUser = createRes.user;
        } else {
          throw loginErr;
        }
      }

      // Check or create profile
      const prof = await getUserProfile(credUser.uid);
      if (!prof) {
        await createOrUpdateUserProfile(credUser.uid, {
          userId: credUser.uid,
          email: cfg.email,
          name: cfg.name,
          role: cfg.role,
        });

        if (cfg.role === 'Deportista') {
          await initAthleteDoc(credUser.uid, {
            id: credUser.uid,
            name: cfg.name,
            sport: ('sport' in cfg ? (cfg as any).sport : 'taekwondo') as any,
          });

          // Seed sample data for Lucas if new
          if (type === 'lucas') {
            await saveDailyHabitLog(credUser.uid, {
              ...INITIAL_DAY_LOG,
              userId: credUser.uid,
            });
            for (const [dateKey, pastLog] of Object.entries(INITIAL_LOGS_HISTORY)) {
              await saveDailyHabitLog(credUser.uid, {
                ...pastLog,
                userId: credUser.uid,
                date: dateKey,
              });
            }
          } else if (type === 'sofia') {
            const todayStr = new Date().toISOString().split('T')[0];
            await saveDailyHabitLog(credUser.uid, {
              date: todayStr,
              userId: credUser.uid,
              waterGlasses: 4,
              sleepHours: 8,
              sleepCompleted: true,
              trainingHours: 2,
              trainingCompleted: true,
              meals: { desayuno: true, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
              customMeals: [
                {
                  id: 'sofia-meal-1',
                  title: 'Desayuno pre-entreno',
                  time: '07:15 am',
                  description: 'Tazón de avena con chía, arándanos frescos y 30g de proteína en polvo.',
                  photoUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=80',
                  createdAt: new Date().toISOString(),
                },
              ],
              mood: 'feliz',
              moodNote: 'Excelente sesión en piscina olímpica matutina.',
              restQuality: 'Excelente',
            });
          }
        }
      }

      await refreshUserProfile(credUser);
    } catch (err) {
      console.warn('Quick login Firebase error, falling back to direct session:', err);
      await enterDirectSession(cfg.name, cfg.role, cfg.email);
    } finally {
      setLoading(false);
    }
  };

  const enterDirectSession = async (
    name?: string,
    role?: RoleType,
    customEmail?: string
  ) => {
    setLoading(true);
    const cleanName = (name || '').trim() || 'Faati Morales (Nutricionista)';
    const targetRole: RoleType = role || 'Nutricionista';
    const slug = slugifyUsername(cleanName);
    const effectiveEmail = customEmail?.trim()
      ? customEmail.trim().toLowerCase()
      : `${slug}@rendiplus.app`;
    const fallbackUid = `user_${slug.replace(/[^a-zA-Z0-9]/g, '_')}_${targetRole.toLowerCase().slice(0, 4)}`;

    try {
      // 1. Try Firebase Auth first if available
      try {
        let credUser: User;
        try {
          const res = await signInWithEmailAndPassword(auth, effectiveEmail, 'RendiDemo2026!');
          credUser = res.user;
        } catch {
          const res = await createUserWithEmailAndPassword(auth, effectiveEmail, 'RendiDemo2026!');
          credUser = res.user;
        }
        await createOrUpdateUserProfile(credUser.uid, {
          userId: credUser.uid,
          email: effectiveEmail,
          name: cleanName,
          role: targetRole,
        });
        await refreshUserProfile(credUser);
        return;
      } catch (fbAuthErr) {
        console.warn('Direct Firebase Auth unavailable, activating direct secure local session:', fbAuthErr);
      }

      // 2. Guaranteed Direct Active Session (Never leaves user locked out)
      const directUser: User = {
        uid: fallbackUid,
        email: effectiveEmail,
        displayName: cleanName,
        emailVerified: true,
        isAnonymous: false,
        metadata: {} as any,
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'direct-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null,
        photoURL: null,
        providerId: 'firebase',
      };

      const now = new Date().toISOString();
      const directProfile: UserAccountDoc = {
        userId: fallbackUid,
        email: effectiveEmail,
        name: cleanName,
        role: targetRole,
        sport: 'taekwondo',
        ageGroup: '18 - 29 a',
        gender: 'Femenino',
        beltColor: 'celeste',
        weeklyFrequency: 5,
        sessionDuration: '1 a 2 horas',
        habitualIntensity: 'Moderada',
        habitualSchedule: 'Tarde',
        createdAt: now,
        updatedAt: now,
      };

      try {
        await createOrUpdateUserProfile(fallbackUid, directProfile);
      } catch (err) {
        console.warn('Direct profile sync in Firestore (optional):', err);
      }

      saveRegisteredUserRecord({
        name: cleanName,
        username: slug,
        email: effectiveEmail,
        role: targetRole,
      });
      setSavedUsers(getSavedUsersList());

      setCurrentUser(directUser);
      setUserProfile(directProfile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        savedUsers,
        signInEmail,
        signInWithUsernameOrEmail,
        signUpEmail,
        signUpWithUsernameOrEmail,
        signInGoogle,
        signOutUser,
        quickLoginDemo,
        switchUserRole,
        enterDirectSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
