import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AppSettings,
  CompletedSession,
  DEFAULT_PLAN,
  DEFAULT_SETTINGS,
  ExercisePlan,
} from '@/constants/plans';
import { applyLanguage } from '@/i18n';
import { syncReminders } from '@/lib/reminders';
import {
  clearAllData,
  loadPlan,
  loadSessions,
  loadSettings,
  savePlan,
  saveSessions,
  saveSettings,
} from '@/lib/storage';

type AppStateValue = {
  ready: boolean;
  settings: AppSettings;
  plan: ExercisePlan;
  sessions: CompletedSession[];
  sessionsToday: number;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  updatePlan: (plan: ExercisePlan) => Promise<void>;
  addSession: (session: CompletedSession) => Promise<void>;
  resetAll: () => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function isSameDay(iso: string, now = new Date()): boolean {
  const date = new Date(iso);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [plan, setPlan] = useState<ExercisePlan>(DEFAULT_PLAN);
  const [sessions, setSessions] = useState<CompletedSession[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [nextSettings, nextPlan, nextSessions] = await Promise.all([
        loadSettings(),
        loadPlan(),
        loadSessions(),
      ]);
      if (cancelled) return;
      await applyLanguage(nextSettings.language);
      setSettings(nextSettings);
      setPlan(nextPlan);
      setSessions(nextSessions);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next: AppSettings = {
        ...current,
        ...patch,
        reminders: patch.reminders ?? current.reminders,
      };

      void (async () => {
        await saveSettings(next);
        if (patch.language && patch.language !== current.language) {
          await applyLanguage(patch.language);
          if (next.reminders.enabled) {
            await syncReminders(next.reminders);
          }
        } else if (patch.reminders) {
          await syncReminders(next.reminders);
        }
      })();

      return next;
    });
  }, []);

  const updatePlan = useCallback(async (nextPlan: ExercisePlan) => {
    setPlan(nextPlan);
    await savePlan(nextPlan);
  }, []);

  const addSession = useCallback(async (session: CompletedSession) => {
    setSessions((current) => {
      const next = [session, ...current].slice(0, 365);
      void saveSessions(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(async () => {
    await clearAllData();
    await applyLanguage(DEFAULT_SETTINGS.language);
    setSettings(DEFAULT_SETTINGS);
    setPlan(DEFAULT_PLAN);
    setSessions([]);
  }, []);

  const sessionsToday = useMemo(
    () => sessions.filter((session) => isSameDay(session.completedAt)).length,
    [sessions],
  );

  const value = useMemo(
    () => ({
      ready,
      settings,
      plan,
      sessions,
      sessionsToday,
      updateSettings,
      updatePlan,
      addSession,
      resetAll,
    }),
    [
      ready,
      settings,
      plan,
      sessions,
      sessionsToday,
      updateSettings,
      updatePlan,
      addSession,
      resetAll,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return value;
}
