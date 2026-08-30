/**
 * Physiotherapist notification defaults.
 *
 * Change DEFAULT_PHYSIO_NOTIFY_EMAIL before a production release if you do not
 * want alerts to go to the address used for internal testing.
 */
export const DEFAULT_PHYSIO_NOTIFY_EMAIL = 'labros.velentzas@gmail.com';

/** Shared secret sent as X-Notify-Secret — must match NOTIFY_API_SECRET on the server. */
export const DEFAULT_NOTIFY_API_SECRET = 'pelvipilot-dev-notify-secret';

export type DailyCompletePayload = {
  physioEmail: string;
  patientName: string;
  clinicName: string;
  planName: string;
  sessionsCompleted: number;
  sessionsRequired: number;
  completedDate: string;
};
