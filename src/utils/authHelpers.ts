import { RoleType } from '../types';

export interface RegisteredUserRecord {
  name: string;
  username: string;
  email: string;
  role: RoleType;
  lastUsedAt?: string;
}

export const DEMO_USERS: RegisteredUserRecord[] = [
  {
    name: 'Faati (Nutricionista)',
    username: 'faati',
    email: 'faati.nutricionista@rendiplus.demo',
    role: 'Nutricionista',
  },
  {
    name: 'Lucas Silva',
    username: 'lucas',
    email: 'lucas.taekwondo@rendiplus.demo',
    role: 'Deportista',
  },
  {
    name: 'Sofía Valdés',
    username: 'sofia',
    email: 'sofia.natacion@rendiplus.demo',
    role: 'Deportista',
  },
  {
    name: 'Dra. Claudia Morales',
    username: 'claudia',
    email: 'claudia.morales@rendiplus.demo',
    role: 'Nutricionista',
  },
  {
    name: 'Prof. Carlos Medina',
    username: 'carlos',
    email: 'carlos.medina@rendiplus.demo',
    role: 'Entrenador',
  },
];

const LOCAL_STORAGE_KEY = 'rendiplus_registered_users_v1';

/**
 * Normalizes a display name or username into a clean, safe slug (e.g. "Lucas Silva" -> "lucas.silva")
 */
export function slugifyUsername(raw: string): string {
  if (!raw) return 'usuario';
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.') // replace spaces, symbols with dots
    .replace(/\.+/g, '.') // remove duplicate dots
    .replace(/^\.|\.$/g, '') || 'usuario'; // strip leading/trailing dots
}

/**
 * Returns saved registered users from localStorage merged with built-in demo users
 */
export function getSavedUsersList(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEMO_USERS;
    const parsed: RegisteredUserRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEMO_USERS;

    // Merge custom users with demo users, avoiding duplicate emails
    const customUsers = parsed.filter(
      (u) => !DEMO_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
    );
    return [...DEMO_USERS, ...customUsers];
  } catch (err) {
    console.error('Error loading saved users:', err);
    return DEMO_USERS;
  }
}

/**
 * Persists a new registered user locally for instant autocomplete and username login
 */
export function saveRegisteredUserRecord(record: RegisteredUserRecord): void {
  try {
    const existing = getSavedUsersList();
    const filtered = existing.filter(
      (u) => u.email.toLowerCase() !== record.email.toLowerCase()
    );
    const updated = [
      ...filtered,
      { ...record, lastUsedAt: new Date().toISOString() },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving user record:', err);
  }
}

/**
 * Resolves a username or email input to the corresponding email address
 */
export function resolveIdentifierToEmail(identifier: string): {
  email: string;
  matchedUser?: RegisteredUserRecord;
  isDemoUser: boolean;
} {
  const clean = identifier.trim();
  const lower = clean.toLowerCase();

  // If already an email
  if (lower.includes('@')) {
    const matched = getSavedUsersList().find(
      (u) => u.email.toLowerCase() === lower
    );
    const isDemo = DEMO_USERS.some((d) => d.email.toLowerCase() === lower);
    return { email: lower, matchedUser: matched, isDemoUser: isDemo };
  }

  // Check against known demo aliases
  const demoAliasMap: Record<string, string> = {
    faati: 'faati.nutricionista@rendiplus.demo',
    faatistudent: 'faati.nutricionista@rendiplus.demo',
    'faatistudent@gmail.com': 'faati.nutricionista@rendiplus.demo',
    'faati nutricionista': 'faati.nutricionista@rendiplus.demo',
    lucas: 'lucas.taekwondo@rendiplus.demo',
    'lucas silva': 'lucas.taekwondo@rendiplus.demo',
    'lucas.silva': 'lucas.taekwondo@rendiplus.demo',
    tkd: 'lucas.taekwondo@rendiplus.demo',
    sofia: 'sofia.natacion@rendiplus.demo',
    'sofía': 'sofia.natacion@rendiplus.demo',
    'sofia valdes': 'sofia.natacion@rendiplus.demo',
    'sofía valdés': 'sofia.natacion@rendiplus.demo',
    natacion: 'sofia.natacion@rendiplus.demo',
    claudia: 'claudia.morales@rendiplus.demo',
    'dra claudia': 'claudia.morales@rendiplus.demo',
    'dra. claudia': 'claudia.morales@rendiplus.demo',
    nutri: 'claudia.morales@rendiplus.demo',
    nutricionista: 'faati.nutricionista@rendiplus.demo',
    carlos: 'carlos.medina@rendiplus.demo',
    'prof carlos': 'carlos.medina@rendiplus.demo',
    'prof. carlos': 'carlos.medina@rendiplus.demo',
    coach: 'carlos.medina@rendiplus.demo',
  };

  if (demoAliasMap[lower]) {
    const email = demoAliasMap[lower];
    const matched = DEMO_USERS.find((d) => d.email === email);
    return { email, matchedUser: matched, isDemoUser: true };
  }

  // Check saved registered users list
  const slug = slugifyUsername(clean);
  const allUsers = getSavedUsersList();
  const matched = allUsers.find(
    (u) =>
      u.username.toLowerCase() === slug ||
      u.name.toLowerCase() === lower ||
      slugifyUsername(u.name) === slug
  );

  if (matched) {
    const isDemo = DEMO_USERS.some((d) => d.email === matched.email);
    return { email: matched.email, matchedUser: matched, isDemoUser: isDemo };
  }

  // Fallback: construct standard deterministic email for new users
  return {
    email: `${slug}@rendiplus.app`,
    matchedUser: undefined,
    isDemoUser: false,
  };
}
