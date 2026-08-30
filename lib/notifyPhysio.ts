import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  isEmailJsConfigured,
  type DailyCompletePayload,
} from '@/constants/notifications';
import { loadLastDailyNotifyDate, saveLastDailyNotifyDate } from '@/lib/storage';

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

function todayKey(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validatePayload(payload: DailyCompletePayload): string | null {
  if (!payload.physioEmail.trim()) {
    return 'missing_physio_email';
  }
  if (!payload.patientName.trim()) {
    return 'missing_patient_name';
  }
  return null;
}

async function sendViaEmailJs(payload: DailyCompletePayload): Promise<{ ok: boolean; reason?: string }> {
  if (!isEmailJsConfigured()) {
    return { ok: false, reason: 'email_not_configured' };
  }

  const subject = `PelviPilot — ${payload.patientName.trim()} completed today's plan (${payload.sessionsCompleted}/${payload.sessionsRequired})`;
  const message = [
    `${payload.patientName.trim()} completed their full daily exercise plan.`,
    '',
    `Patient: ${payload.patientName.trim()}`,
    `Clinic: ${payload.clinicName.trim() || 'Clinic'}`,
    `Plan: ${payload.planName.trim() || 'Exercise plan'}`,
    `Sessions today: ${payload.sessionsCompleted}/${payload.sessionsRequired}`,
    `Date: ${payload.completedDate}`,
    '',
    'Sent automatically by PelviPilot.',
  ].join('\n');

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: payload.physioEmail.trim(),
          subject,
          patient_name: payload.patientName.trim(),
          clinic_name: payload.clinicName.trim() || 'Clinic',
          plan_name: payload.planName.trim() || 'Exercise plan',
          sessions: `${payload.sessionsCompleted}/${payload.sessionsRequired}`,
          date: payload.completedDate,
          message,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.warn('[notifyPhysio] EmailJS error', response.status, detail);
      return { ok: false, reason: 'send_failed' };
    }

    return { ok: true };
  } catch (error) {
    console.warn('[notifyPhysio] Network error', error);
    return { ok: false, reason: 'network_error' };
  }
}

export async function sendPhysioDailyCompleteEmail(
  payload: DailyCompletePayload,
  options?: { skipDailyLimit?: boolean },
): Promise<{ sent: boolean; reason?: string }> {
  const validationError = validatePayload(payload);
  if (validationError) {
    return { sent: false, reason: validationError };
  }

  if (!options?.skipDailyLimit) {
    const dateKey = todayKey();
    const lastNotified = await loadLastDailyNotifyDate();
    if (lastNotified === dateKey) {
      return { sent: false, reason: 'already_notified_today' };
    }
  }

  const result = await sendViaEmailJs(payload);
  if (!result.ok) {
    return { sent: false, reason: result.reason };
  }

  if (!options?.skipDailyLimit) {
    await saveLastDailyNotifyDate(todayKey());
  }

  return { sent: true };
}

export async function maybeNotifyDailyPlanComplete(
  payload: DailyCompletePayload,
): Promise<{ sent: boolean; reason?: string }> {
  return sendPhysioDailyCompleteEmail(payload);
}
