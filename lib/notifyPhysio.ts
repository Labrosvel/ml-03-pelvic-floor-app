import Constants from 'expo-constants';

import {
  DEFAULT_NOTIFY_API_SECRET,
  type DailyCompletePayload,
} from '@/constants/notifications';
import { loadLastDailyNotifyDate, saveLastDailyNotifyDate } from '@/lib/storage';

function todayKey(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function notifyApiUrl(): string | null {
  const extra = Constants.expoConfig?.extra as { notifyApiUrl?: string } | undefined;
  const url = extra?.notifyApiUrl?.trim();
  return url || null;
}

function notifyApiSecret(): string {
  const extra = Constants.expoConfig?.extra as { notifyApiSecret?: string } | undefined;
  return extra?.notifyApiSecret?.trim() || DEFAULT_NOTIFY_API_SECRET;
}

export async function maybeNotifyDailyPlanComplete(
  payload: DailyCompletePayload,
): Promise<{ sent: boolean; reason?: string }> {
  const apiUrl = notifyApiUrl();
  if (!apiUrl) {
    console.warn('[notifyPhysio] EXPO_PUBLIC_NOTIFY_API_URL is not set — skipping email.');
    return { sent: false, reason: 'api_not_configured' };
  }

  if (!payload.physioEmail.trim()) {
    return { sent: false, reason: 'missing_physio_email' };
  }

  if (!payload.patientName.trim()) {
    return { sent: false, reason: 'missing_patient_name' };
  }

  const dateKey = todayKey();
  const lastNotified = await loadLastDailyNotifyDate();
  if (lastNotified === dateKey) {
    return { sent: false, reason: 'already_notified_today' };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Notify-Secret': notifyApiSecret(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.warn('[notifyPhysio] API error', response.status, detail);
      return { sent: false, reason: 'api_error' };
    }

    await saveLastDailyNotifyDate(dateKey);
    return { sent: true };
  } catch (error) {
    console.warn('[notifyPhysio] Network error', error);
    return { sent: false, reason: 'network_error' };
  }
}
