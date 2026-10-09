# Physiotherapist daily completion alerts — setup guide

## What happens

When a patient finishes **all sessions required for that day** (e.g. 3/3), the app sends **one email** to the physiotherapist with the patient’s name.

**Resend is not used for this feature.** You only need **EmailJS** (free) + three IDs pasted into one file in the repo.

---

## Where to set who receives the email

There is **no default clinic email** in the app. Each physiotherapist enters their own address when setting up a patient’s phone:

**Settings** (last tab) → **Physiotherapist alert email**  
(or the same field during onboarding)

That value is stored only on that device. Different clinics / physios use different emails on their patients’ phones.

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

### Step 4 — Copy your API keys

1. Dashboard → **Account** → **API Keys**
2. Copy **Public Key**
3. If **Strict mode** is ON under [Account → Security](https://dashboard.emailjs.com/admin/account/security), also copy **Private Key** (required for sends)

### Step 5 — Paste into the repo

Edit **`constants/notifications.ts`**:

```ts
export const EMAILJS_SERVICE_ID = 'service_abc123';
export const EMAILJS_TEMPLATE_ID = 'template_xyz789';
export const EMAILJS_PUBLIC_KEY = 'your_public_key';
export const EMAILJS_PRIVATE_KEY = 'your_private_key'; // only if strict mode is ON
```

**Strict mode error?** If the app says *“API access in strict mode, but no Private Key was provided”*, either:

- Paste your **Private Key** into `EMAILJS_PRIVATE_KEY` and rebuild, **or**
- Turn **strict mode OFF** in EmailJS → Account → Security (then private key is not needed)

Commit, merge, and **build a new Android version** (Play internal test or APK). Older installs without these IDs cannot send email.

### Step 6 — Test from the app

1. Hard-refresh the web preview (or install a new Android build)
2. Settings → set **Patient name** and **Physiotherapist alert email**
3. Tap **Send test alert email**
4. Check the inbox (and spam) — you should receive a test message within a minute
5. If it fails, read the error popup, then check EmailJS → **Email History**

### EmailJS security (common cause of “button does nothing / no email”)

Open [Account → Security](https://dashboard.emailjs.com/admin/account/security):

1. **Strict mode:** if enabled, you must paste **Private Key** in `constants/notifications.ts` (see Step 5). Or disable strict mode to skip the private key.
2. Leave **API access for non-browser applications** OFF for web testing (browser requests are allowed by default).
2. If you use an **Allowed origins / domains** list, add:
   - `https://labrosvel.github.io`
   - `http://localhost` (for local `expo start --web`)
3. Confirm **Email Services** shows your Gmail as **Active** (not expired).

Also tap **Test It** inside the EmailJS template editor once — that proves Gmail sending works independently of the app.

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
| EmailJS refuses the send / quota exceeded | Free plan is 200 requests a month. See **Capacity** below. Play's pre-launch crawler can use them up without any patient finishing a day |
| Push to GitHub fails locally | Run `git pull origin main` first; check GitHub login/token; see note below |

---

## Capacity — revisit before real patients

Noted **2026-10-09**, during Google Play closed testing with four people: Lampros, his mother, her colleague, and his stepfather. Recheck the vendor pricing pages before paying. This is the bottleneck to look at as genuine daily alerts grow. Decide before patients are blocked, not the week the inbox goes quiet.

### What one request is

EmailJS is the broker. The phone asks EmailJS to send, and EmailJS delivers through the connected Gmail account. One finished day on one phone is one request: the email goes out only after every session required that day, and at most once per calendar day. The Settings **Send test alert email** button is extra and can send on every tap.

Four people finishing every day is about 120 requests a month. That fits the free allowance. About seven people finishing every day reaches 200.

### What happens at the limit

On the free plan, the next request is refused until the monthly allowance resets. EmailJS does not queue it and does not charge overage. The physiotherapist does not get that alert.

### Prices (checked 2026-10-09)

[EmailJS pricing](https://www.emailjs.com/pricing/). Figures are US dollars per month.

| Plan | Price | Monthly requests |
| --- | --- | --- |
| Free | $0 | 200 |
| Personal | $9 | 2,000 |
| Professional | $15 | 5,000 |
| Business | $40 | 25,000 |

### Decision for now

Stay on the free plan for this closed test. Do not buy a plan because the allowance ran out in testing.

Google Play's pre-launch crawler can spend the 200 by itself. In EmailJS history those rows use the address `crawlerrobo@gmail.com` and the browser `okhttp`, with random patient and clinic names. They are lab phones, not patients. Match the time to Play Console → **Test and release → Testing → Pre-launch report**.

Pay for EmailJS **Personal** ($9, 2,000 a month) when real patients are approaching 200 genuine alerts a month. That is the small step. 2,000 a month is about 65 phones finishing every day.

### Later path: Resend

`api/notify-daily-complete.js` is an unused server-side sender (Vercel + Resend). The app does not call it. Consider it when the send secret should live off the phone, not merely to get past 200.

[Resend pricing](https://resend.com/pricing), also checked 2026-10-09: the free plan is 3,000 emails a month with a hard cap of 100 a day. Sending to an arbitrary clinic address needs a domain you verify. The default `onboarding@resend.dev` sender only delivers to the Resend account owner. Resend Pro starts at $20 a month for 50,000. Moving there is an app change plus DNS, so it comes after the $9 EmailJS plan.
