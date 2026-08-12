import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AppSettings,
  CompletedSession,
  DEFAULT_PLAN,
  DEFAULT_SETTINGS,
  ExercisePlan,
  normalizeSettings,
} from '@/constants/plans';

const KEYS = {
  settings: 'pelviguide.settings.v1',
  plan: 'pelviguide.plan.v1',
  sessions: 'pelviguide.sessions.v1',
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await readJson<Partial<AppSettings> | null>(KEYS.settings, null);
  return normalizeSettings(raw ?? DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await writeJson(KEYS.settings, settings);
}

export async function loadPlan(): Promise<ExercisePlan> {
  return readJson(KEYS.plan, DEFAULT_PLAN);
}

export async function savePlan(plan: ExercisePlan): Promise<void> {
  await writeJson(KEYS.plan, plan);
}

export async function loadSessions(): Promise<CompletedSession[]> {
  return readJson(KEYS.sessions, []);
}

export async function saveSessions(sessions: CompletedSession[]): Promise<void> {
  await writeJson(KEYS.sessions, sessions);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeMany([KEYS.settings, KEYS.plan, KEYS.sessions]);
}
