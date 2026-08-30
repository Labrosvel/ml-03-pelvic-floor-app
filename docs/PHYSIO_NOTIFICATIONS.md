# Physiotherapist daily completion alerts — setup guide

## What happens

When a patient finishes **all sessions required for that day** (e.g. 3/3), the app sends **one email** to the physiotherapist with the patient’s name.

**Resend is not used for this feature.** You only need **EmailJS** (free) + three IDs pasted into one file in the repo.

---

## Where to change who receives the email

### In the app (no rebuild needed)

Open **Settings** (last tab) → **Physiotherapist alert email**.

Your mother can change this on each patient’s phone. Default for new installs comes from the file below.

### In code (default for new installs)

**File:** `constants/notifications.ts`

```ts
export const DEFAULT_PHYSIO_NOTIFY_EMAIL = 'labros.velentzas@gmail.com';
```

Change this before a production Play release if the default inbox should be your mother’s clinic email instead of your test address.

---

## One-time EmailJS setup (about 10 minutes)

Do this **once**. After that, every app build can send emails without Vercel, Resend, or extra env vars.

### Step 1 — Create EmailJS account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up with **one** email (e.g. `labros.velentzas@gmail.com`)
3. You do **not** need a second account

### Step 2 — Connect an email service

1. EmailJS dashboard → **Email Services** → **Add new service**
2. Choose **Gmail** (easiest for testing)
3. Connect the Gmail account that will **send** the alerts (can be the same as the recipient for testing)
4. Copy the **Service ID** (looks like `service_abc123`)

### Step 3 — Create email template

1. Dashboard → **Email Templates** → **Create new template**
2. Set **To email** to: `{{to_email}}`
3. Set **Subject** to: `{{subject}}`
4. In the **Content** section (this is the email body — EmailJS does not label it “Body”), click **Edit Content** and use plain text with:

```
{{message}}
```

The default “Contact Us” template also works: it already includes `{{message}}` in Content. Optional: set **From name** to `PelviPilot` instead of `{{name}}`.

5. Save and copy the **Template ID** (looks like `template_xyz789`)

Optional: add `{{patient_name}}`, `{{clinic_name}}`, etc. in the body if you prefer a custom layout — the app sends all of these.

### Step 4 — Copy your Public Key

1. Dashboard → **Account** → **General**
2. Copy **Public Key** (looks like `aBcDeFgHiJkLmNoPq`)

### Step 5 — Paste into the repo

Edit **`constants/notifications.ts`**:

```ts
export const EMAILJS_SERVICE_ID = 'service_abc123';
export const EMAILJS_TEMPLATE_ID = 'template_xyz789';
export const EMAILJS_PUBLIC_KEY = 'aBcDeFgHiJkLmNoPq';
```

Commit, merge, and **build a new Android version** (Play internal test or APK). Older installs without these IDs cannot send email.

### Step 6 — Test from the app

1. Install the new build
2. Settings → set **Patient name** and **Physiotherapist alert email**
3. Tap **Send test alert email**
4. Check the inbox — you should receive a test message within a minute

---

## Mother’s workflow (each patient)

1. Take patient’s phone → install PelviPilot
2. **Settings** (or onboarding):
   - **Patient name** — e.g. Maria Papadopoulou
   - **Physiotherapist alert email** — her inbox (pre-filled from default)
   - Adjust **Exercise plan** → save
3. Hand phone back
4. When the patient completes all daily sessions → one email arrives

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| No “Physiotherapist alert email” in Settings | Install a build that includes PR #23+ (daily alerts feature) |
| Test button says not configured | Rebuild the app after pasting EmailJS IDs in `constants/notifications.ts` |
| Email goes to wrong person | Change **Settings → Physiotherapist alert email** on that phone |
| No email after completing sessions | Ensure **Patient name** is filled; complete all sessions for the day (e.g. 3/3) |
| Only one email per day | By design — duplicate protection for the same calendar day |
| Push to GitHub fails locally | Run `git pull origin main` first; check GitHub login/token; see note below |

---

## Optional: Vercel + Resend (advanced)

The `api/notify-daily-complete.js` file is an alternative server-side sender. The app now uses **EmailJS by default** so you do not need Vercel or Resend unless you prefer that architecture later.
