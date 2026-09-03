import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { ReminderSettings } from '@/constants/plans';
import i18n from '@/i18n';

/** Expo Go (Android SDK 53+) throws if expo-notifications is imported. */
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/** Defaults used when the plan gains more sessions than saved reminder times. */
const FALLBACK_REMINDER_TIMES = [
  '09:00',
  '13:00',
  '20:00',
  '07:30',
  '11:00',
  '16:00',
  '18:30',
  '21:30',
  '08:00',
  '10:00',
  '15:00',
  '22:00',
];

type NotificationsModule = typeof import('expo-notifications');

let notifications: NotificationsModule | null = null;
let handlerConfigured = false;

function getNotifications(): NotificationsModule | null {
  if (Platform.OS === 'web' || isExpoGo) return null;
  if (notifications) return notifications;

  // Lazy require so Expo Go never evaluates the native module.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  notifications = require('expo-notifications') as NotificationsModule;

  if (!handlerConfigured) {
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    handlerConfigured = true;
  }

  return notifications;
}

export function areRemindersSupported(): boolean {
  return Platform.OS !== 'web' && !isExpoGo;
}

export async function ensureReminderPermissions(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function parseTime(time: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

/** Normalize typed time to HH:mm, or null if invalid. */
export function normalizeTimeInput(raw: string): string | null {
  const parsed = parseTime(raw);
  if (!parsed) return null;
  return `${String(parsed.hour).padStart(2, '0')}:${String(parsed.minute).padStart(2, '0')}`;
}

/**
 * Keep reminder slot count equal to sessions-per-day from the exercise plan.
 * Preserves existing times when shrinking; pads with defaults when growing.
 */
export function alignReminderTimes(times: string[], sessionsPerDay: number): string[] {
  const count = Math.max(1, Math.min(12, Math.floor(Number(sessionsPerDay)) || 1));
  const valid = times.map((time) => normalizeTimeInput(time)).filter((time): time is string => Boolean(time));
  const next = valid.slice(0, count);

  for (let index = next.length; index < count; index += 1) {
    const fallback = FALLBACK_REMINDER_TIMES[index];
    if (fallback && !next.includes(fallback)) {
      next.push(fallback);
      continue;
    }
    const hour = (8 + index * 2) % 24;
    next.push(`${String(hour).padStart(2, '0')}:00`);
  }

  return next;
}

export async function syncReminders(reminders: ReminderSettings): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!reminders.enabled) return;

  const allowed = await ensureReminderPermissions();
  if (!allowed) return;

  for (const time of reminders.times) {
    const parsed = parseTime(time);
    if (!parsed) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('reminders.title'),
        body: i18n.t('reminders.body'),
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });
  }
}
