/**
 * Physiotherapist alert configuration — edit this file before each release.
 *
 * 1. DEFAULT_PHYSIO_NOTIFY_EMAIL — who receives daily completion emails.
 *    Also editable per patient phone in Settings → Physiotherapist alert email.
 *
 * 2. EmailJS — one-time free setup at https://www.emailjs.com/ (see docs/PHYSIO_NOTIFICATIONS.md).
 *    Paste the three IDs below after creating your EmailJS template.
 */

/** Who receives alerts by default on new installs. Change before production release. */
export const DEFAULT_PHYSIO_NOTIFY_EMAIL = 'labros.velentzas@gmail.com';

/** EmailJS service ID (Dashboard → Email Services). */
export const EMAILJS_SERVICE_ID = '';

/** EmailJS template ID (Dashboard → Email Templates). */
export const EMAILJS_TEMPLATE_ID = '';

/** EmailJS public key (Dashboard → Account → Public Key). */
export const EMAILJS_PUBLIC_KEY = '';

export function isEmailJsConfigured(): boolean {
  return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}

export type DailyCompletePayload = {
  physioEmail: string;
  patientName: string;
  clinicName: string;
  planName: string;
  sessionsCompleted: number;
  sessionsRequired: number;
  completedDate: string;
};
