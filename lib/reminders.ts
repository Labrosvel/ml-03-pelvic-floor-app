import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { ReminderSettings } from '@/constants/plans';
import i18n from '@/i18n';

/** Expo Go (Android SDK 53+) throws if expo-notifications is imported. */
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

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

function parseTime(time: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
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
