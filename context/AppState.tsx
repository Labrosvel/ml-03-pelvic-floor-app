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
import { maybeNotifyDailyPlanComplete } from '@/lib/notifyPhysio';
import { alignReminderTimes, syncReminders } from '@/lib/reminders';
import {
  clearAllData,
  loadPlan,
  loadSessions,
  loadSettings,
  savePlan,
  saveSessions,
  saveSettings,
} from '@/lib/storage';

function withAlignedReminders(settings: AppSettings, sessionsPerDay: number): AppSettings {
  const times = alignReminderTimes(settings.reminders.times, sessionsPerDay);
  if (
    times.length === settings.reminders.times.length &&
    times.every((time, index) => time === settings.reminders.times[index])
  ) {
    return settings;
  }
  return {
    ...settings,
    reminders: {
      ...settings.reminders,
      times,
    },
  };
}

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

function formatCompletedDate(now = new Date()): string {
  return now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [plan, setPlan] = useState<ExercisePlan>(DEFAULT_PLAN);
  const [sessions, setSessions] = useState<CompletedSession[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [loadedSettings, nextPlan, nextSessions] = await Promise.all([
        loadSettings(),
        loadPlan(),
        loadSessions(),
      ]);
      if (cancelled) return;
      const nextSettings = withAlignedReminders(loadedSettings, nextPlan.sessionsPerDay);
      await applyLanguage(nextSettings.language);
      setSettings(nextSettings);
      setPlan(nextPlan);
      setSessions(nextSessions);
      setReady(true);
      if (nextSettings !== loadedSettings) {
        await saveSettings(nextSettings);
        if (nextSettings.reminders.enabled) {
          await syncReminders(nextSettings.reminders);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const current = settings;
    const remindersPatch = patch.reminders
      ? {
          ...current.reminders,
          ...patch.reminders,
          times: alignReminderTimes(
            patch.reminders.times ?? current.reminders.times,
            plan.sessionsPerDay,
          ),
        }
      : current.reminders;
    const next: AppSettings = {
      ...current,
      ...patch,
      reminders: remindersPatch,
    };

    setSettings(next);
    await saveSettings(next);

    if (patch.language && patch.language !== current.language) {
      await applyLanguage(patch.language);
      if (next.reminders.enabled) {
        await syncReminders(next.reminders);
      }
    } else if (patch.reminders) {
      await syncReminders(next.reminders);
    }
  }, [settings, plan.sessionsPerDay]);

  const updatePlan = useCallback(
    async (nextPlan: ExercisePlan) => {
      setPlan(nextPlan);
      await savePlan(nextPlan);

      const aligned = withAlignedReminders(settings, nextPlan.sessionsPerDay);
      if (aligned === settings) return;

      setSettings(aligned);
      await saveSettings(aligned);
      if (aligned.reminders.enabled) {
        await syncReminders(aligned.reminders);
      }
    },
    [settings],
  );

  const addSession = useCallback(
    async (session: CompletedSession) => {
      const next = [session, ...sessions].slice(0, 365);
      setSessions(next);
      await saveSessions(next);

      const todayCount = next.filter((item) => isSameDay(item.completedAt)).length;
      if (todayCount < plan.sessionsPerDay) {
        return;
      }

      void maybeNotifyDailyPlanComplete({
        physioEmail: settings.physioNotifyEmail,
        patientName: settings.displayName,
        clinicName: settings.clinicName,
        planName: plan.name,
        sessionsCompleted: todayCount,
        sessionsRequired: plan.sessionsPerDay,
        completedDate: formatCompletedDate(new Date(session.completedAt)),
      });
    },
    [sessions, plan, settings],
  );

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
