# PelviGuide

Cross-platform pelvic floor exercise companion built with **React Native + Expo**.

Designed so a physiotherapist (or their patients) can preview the UI in **Expo Go** for free — including across countries — before publishing to the App Store or Google Play.

> This is an original app inspired by the pelvic-floor exercise category. It is **not** affiliated with Squeezy or any other commercial product.

## Features (MVP)

- Guided squeeze / rest sessions with a visual cue
- Customisable exercise plan (physio-friendly timings & reps)
- Local progress history on device
- Optional daily reminders
- Short education articles
- Clinic name + patient name personalisation

## Quick start

```bash
npm install
npx expo start --tunnel
```

`--tunnel` matters when you are in the UK and your mother is in Greece: Expo Go connects over the internet instead of local Wi‑Fi.

Scan the QR code with:

- **iOS**: Camera app → opens Expo Go
- **Android**: Expo Go → Scan QR code

Your mother can install [Expo Go](https://expo.dev/go) and open the preview without App Store / Play Store review.

### Web preview (optional)

```bash
npx expo start --web
```

## Project structure

- `app/` — Expo Router screens (Home, Progress, Learn, Settings, Exercise, Plan)
- `components/` — UI + squeeze visual
- `constants/` — theme, default plan, education copy
- `context/` — local app state
- `lib/` — storage, reminders, session builder

## Next customisation steps

1. Rename branding / clinic defaults in `constants/theme.ts`
2. Adjust default clinical plan in `constants/plans.ts`
3. Add Greek language strings when ready
4. Create an Expo account + run `eas init` / `eas build` for store binaries
5. Later: clinician dashboard / multi-patient sync (not in MVP)

## Disclaimer

PelviGuide supports home practice between physiotherapy appointments. It is not a medical device, does not diagnose conditions, and does not replace clinical assessment.
