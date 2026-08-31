/**
 * Physiotherapist alert configuration — edit this file before each release.
 *
 * 1. Physio alert email — left blank by default. Each clinic enters their own
 *    address in Settings / onboarding on the patient’s phone.
 *
 * 2. EmailJS — one-time free setup at https://www.emailjs.com/ (see docs/PHYSIO_NOTIFICATIONS.md).
 *    Paste the three IDs below after creating your EmailJS template.
 */

/** Empty by default — each physiotherapist enters their clinic email on the device. */
export const DEFAULT_PHYSIO_NOTIFY_EMAIL = '';

/** EmailJS service ID (Dashboard → Email Services). */
export const EMAILJS_SERVICE_ID = 'service_95o68ys';

/** EmailJS template ID (Dashboard → Email Templates). */
export const EMAILJS_TEMPLATE_ID = 'template_8t7zpwr';

/** EmailJS public key (Dashboard → Account → API Keys → Public Key). */
export const EMAILJS_PUBLIC_KEY = 'xM1ltPZzG8fRc-Qro';

/**
 * EmailJS private key — required if Account → Security has strict mode enabled.
 * Dashboard → Account → API Keys → Private Key.
 * Paste here, then rebuild. Alternative: turn strict mode OFF in EmailJS Security.
 */
export const EMAILJS_PRIVATE_KEY = '';

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
