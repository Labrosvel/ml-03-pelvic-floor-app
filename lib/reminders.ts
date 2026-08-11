import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ReminderSettings } from '@/constants/plans';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureReminderPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

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
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!reminders.enabled) return;

  const allowed = await ensureReminderPermissions();
  if (!allowed) return;

  for (const time of reminders.times) {
    const parsed = parseTime(time);
    if (!parsed) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'PelviGuide reminder',
        body: 'Time for your pelvic floor session.',
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
