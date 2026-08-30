/**
 * Vercel serverless handler — sends daily plan-complete email to the physiotherapist.
 *
 * Environment variables (set in Vercel project settings):
 *   RESEND_API_KEY      — from https://resend.com
 *   NOTIFY_API_SECRET   — must match EXPO_PUBLIC_NOTIFY_API_SECRET in the app
 *   NOTIFY_FROM_EMAIL   — optional; defaults to onboarding@resend.dev (Resend test sender)
 */

const DEFAULT_FROM = 'PelviPilot <onboarding@resend.dev>';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const secret = process.env.NOTIFY_API_SECRET;
  if (!secret || req.headers['x-notify-secret'] !== secret) {
    return json(res, 401, { error: 'Unauthorized' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return json(res, 503, { error: 'Email service not configured' });
  }

  const {
    physioEmail,
    patientName,
    clinicName,
    planName,
    sessionsCompleted,
    sessionsRequired,
    completedDate,
  } = req.body ?? {};

  if (!physioEmail || !patientName || !completedDate) {
    return json(res, 400, { error: 'Missing required fields' });
  }

  const clinic = clinicName?.trim() || 'Clinic';
  const plan = planName?.trim() || 'Exercise plan';
  const done = Number(sessionsCompleted) || 0;
  const required = Number(sessionsRequired) || done;
  const subject = `PelviPilot — ${patientName.trim()} completed today's plan (${done}/${required})`;

  const text = [
    `${patientName.trim()} completed their full daily exercise plan.`,
    '',
    `Patient: ${patientName.trim()}`,
    `Clinic: ${clinic}`,
    `Plan: ${plan}`,
    `Sessions today: ${done}/${required}`,
    `Date: ${completedDate}`,
    '',
    'Sent automatically by PelviPilot when the patient finishes all required sessions for the day.',
  ].join('\n');

  const from = process.env.NOTIFY_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [physioEmail.trim()],
      subject,
      text,
    }),
  });

  if (!emailResponse.ok) {
    const detail = await emailResponse.text().catch(() => '');
    console.error('[notify-daily-complete] Resend error', emailResponse.status, detail);
    return json(res, 502, { error: 'Failed to send email', detail });
  }

  return json(res, 200, { ok: true });
};
