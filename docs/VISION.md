# PelviPilot — product vision

Living document. Update after calibration sessions with the physiotherapist (currently Lampros’s mother). Agents should read this before proposing features or taking action.

**Last calibrated:** 2026-08-30

---

## One-line summary

PelviPilot is a calm home-practice companion: the **physiotherapist sets the plan**, the **patient follows it with reminders**, and **progress eventually flows back to the clinic** — starting simply, evolving as we learn.

---

## Roles

| Role | Who today | Responsibility |
| --- | --- | --- |
| **Physiotherapist** | Mother (Physiospecialists) | Decides exercise parameters, sessions per day, and when the plan is “complete”. Validates outcomes in real use. |
| **Patient** | Primary user on device | Follows the guided plan, completes sessions, responds to reminders. |
| **Builder** | Lampros + Cursor agents | Ships incrementally; does not over-build ahead of confirmed need. |

---

## Current stage (what we believe now)

### In scope today

- Patient uses the app **according to instructions the physiotherapist decides**.
  - Today this maps to **Settings** (clinic name, patient name, language, reminders, sounds) and **Exercise plan** (sessions per day, slow/quick squeeze timings and reps, and the break between slow and quick).
- Patient receives **local notifications** to complete their exercises / daily plan (where the platform supports it — native builds, not web preview).
- **Guided sessions** with visual and optional audio/haptic cues.
- **Local progress history** on device (no cloud sync yet).
- **Education articles** for gentle context between appointments.
- **English, Greek, Italian, Spanish, and French** for patient-facing copy.

### Explicitly not decided yet

- The **full exercise plan** is still being developed **as we go**, through use and discussion with the physiotherapist. Do not treat the default “Starter plan” as final clinical protocol.
- **What “plan complete” means** clinically (duration, rep targets, assessment) is not fully defined.

### Near-term direction (intent, not committed backlog)

- When a patient **completes their plan**, the **physiotherapist should receive a notification** (or equivalent signal). Not built yet — design and channel TBD. The smaller daily alert (one email when today's sessions are all done) already exists; its volume limit is a known bottleneck, recorded in `docs/PHYSIO_NOTIFICATIONS.md` under **Capacity**.

### Known constraint — daily email allowance

Closed testing (four people, October 2026) stays on free EmailJS. One finished day on one phone is one request, so this group fits the free 200 a month. Revisit the paid plan or a move off EmailJS when genuine alerts approach that 200, not after patients are already blocked. Google Play's pre-launch crawler can empty the free allowance by itself; that usage is not patient volume.

### Future ideas — debatable, do not assume

These may or may not happen. Treat as hypotheses until the physiotherapist confirms need:

- **Patient login / account** (identity, multi-device, backup).
- **Physiotherapist dashboard** (assign plans, view adherence, receive completion alerts).
- **Remote plan assignment** (physio pushes plan to patient vs patient-side configuration).

When suggesting work, **prefer the smallest step** that supports today’s loop (configure → remind → practice → track locally) unless the user explicitly asks to explore login/dashboard.

---

## Product principles

1. **Physio-led, not self-diagnosis** — the app supports a prescribed home routine; it does not replace assessment or clinical judgment.
2. **Calm and simple** — patients may be older or anxious; avoid clutter, dark patterns, or medical overclaiming.
3. **Iterate with real use** — mother’s feedback on outcomes trumps theoretical features.
4. **Mobile-first, web for preview** — Google Play internal testing and native reminders matter; GitHub Pages is for quick validation.
5. **Local-first until proven otherwise** — no accounts or backend until the human workflow justifies the complexity.

---

## What “success” looks like (for now)

- Patient completes daily sessions **as the physiotherapist intended**.
- Reminders help consistency without being nagging.
- Physiotherapist can **adjust the plan on the patient’s device** (or via preview) and see whether behavior matches expectations.
- Eventually: physiotherapist knows **when a plan phase is done** without chasing the patient.

---

## For agents

Before proposing solutions or editing code:

1. Read this file (and skim `README.md` for release/process context).
2. Ask whether the idea serves the **current** loop or a **debatable future** item.
3. If future-facing (login, dashboard, cloud sync), **flag it as optional** and offer a minimal local-only alternative first.
4. When plan/clinical defaults change, note that here or ask the user to update **Last calibrated**.

---

## Revision log

| Date | Change |
| --- | --- |
| 2026-08-30 | Initial vision captured from product discussion. |
| 2026-10-04 | Patient-facing languages expanded to include Italian, Spanish, and French. |
| 2026-10-06 | Tablet checks use a live QR on the virtual desktop (see `docs/TESTING.md`). |
| 2026-10-06 | Tablet APK/AAB requests use Expo build links, not files moved onto the tablet (see `README.md`). |
| 2026-10-07 | Retired the live desktop QR. Tablet browser checks use the pull-request web preview. |
| 2026-10-07 | The break between slow and quick squeezes is set on the exercise plan (default 15 seconds; 0 skips it). |
| 2026-10-09 | Daily completion email stays on free EmailJS for the four-person closed test. Quota, prices, and the later Resend option are in `docs/PHYSIO_NOTIFICATIONS.md`. |
