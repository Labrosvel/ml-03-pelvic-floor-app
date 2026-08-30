# Physiotherapist daily completion alerts

When a patient finishes **all required sessions for the day** (e.g. 3/3), the app sends **one email** to the physiotherapist with the patient name, clinic, plan, and date.

## Where to change the default alert email

**File:** `constants/notifications.ts`

```ts
export const DEFAULT_PHYSIO_NOTIFY_EMAIL = 'labros.velentzas@gmail.com';
```

Change this before a production Play release if alerts should go to your mother’s clinic inbox instead of the test address.

Each device also stores the email in **Settings → Physiotherapist alert email** (editable per patient phone). New installs pick up the default from the constant above.

## App setup (mother’s workflow)

1. Take the patient’s phone, install PelviPilot.
2. **Settings** (or onboarding): enter **Patient name**, adjust **Exercise plan**, save.
3. Hand the phone back. When the patient completes every session required for that day, one email is sent.

Alerts are skipped if patient name is empty, or if the notify API URL is not configured in the build.

## Server setup (required for email to send)

The app does not send email directly (API keys must stay on a server). Deploy the included Vercel function:

### 1. Resend

1. Create a free account at [resend.com](https://resend.com).
2. Create an API key.
3. For testing, Resend’s `onboarding@resend.dev` sender only delivers to the email on your Resend account. Use `labros.velentzas@gmail.com` as the Resend account email for testing, or verify a clinic domain for production.

### 2. Deploy API to Vercel

From the repo root:

```bash
npx vercel
```

In the Vercel project **Environment variables**:

| Variable | Example |
| --- | --- |
| `RESEND_API_KEY` | `re_…` |
| `NOTIFY_API_SECRET` | long random string (match app below) |
| `NOTIFY_FROM_EMAIL` | optional; `PelviPilot <notify@yourdomain.com>` after domain verify |

Note the deployment URL, e.g. `https://pelvipilot-xyz.vercel.app/api/notify-daily-complete`.

### 3. Point the app at the API

Set at **build time** (EAS secrets or local `.env`):

```bash
EXPO_PUBLIC_NOTIFY_API_URL=https://your-project.vercel.app/api/notify-daily-complete
EXPO_PUBLIC_NOTIFY_API_SECRET=same-as-NOTIFY_API_SECRET-on-vercel
```

Rebuild the Android app after setting these. OTA updates alone are enough if only JS changed and env was already set on the build profile.

### 4. Local API test

```bash
npx vercel dev
```

Then set `EXPO_PUBLIC_NOTIFY_API_URL=http://YOUR_LAN_IP:3000/api/notify-daily-complete` for a dev client build.

## Duplicate protection

The app stores `lastDailyNotifyDate` on device and sends **at most one email per calendar day**, even if the patient completes extra sessions.

## Privacy / Play Console

Update **Data safety** when shipping this: the app sends patient name and completion metadata to your notify endpoint (email provider). See updated in-app privacy policy.
