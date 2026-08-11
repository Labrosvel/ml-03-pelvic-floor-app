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

## First-time setup (on your own computer)

Do this on **your laptop/PC** (not only in a cloud chat). Keep the terminal window open while testing.

### 1. Get the app code

```bash
git clone https://github.com/Labrosvel/ml-03-pelvic-floor-app.git
cd ml-03-pelvic-floor-app
git checkout cursor/pelvic-floor-app-mvp-cef3
```

> Important: the app is on branch `cursor/pelvic-floor-app-mvp-cef3`. If you stay on `main`, you will not have the Expo project.

### 2. Install dependencies

```bash
npm install
```

Success looks like: it finishes without a red error, and you have a `node_modules` folder. Warnings are usually OK.

### 3a. Easiest: open in a browser on your computer

```bash
npx expo start --web
```

Wait until the terminal shows Metro started. Your browser should open (or visit `http://localhost:8081`).  
This is the best first check that everything works.

### 3b. Phone preview with Expo Go (for you or your mother)

1. Install **Expo Go** on the phone: https://expo.dev/go  
2. On your computer run:

```bash
npx expo start --tunnel
```

3. Wait 30–90 seconds. You should see a **QR code** in the terminal (and often a Dev Tools page).  
4. Keep that terminal running.  
5. Scan the QR:
   - **iPhone**: Camera app → open in Expo Go  
   - **Android**: open Expo Go → Scan QR code  

`--tunnel` is required when you and your mother are on different Wi‑Fi / countries.

### If you see no QR code

- Make sure you are in the project folder and on the branch above  
- Make sure `npm install` finished  
- Wait longer — tunnel startup can be slow  
- Press `c` in the Expo terminal to show the QR again (when the menu appears)  
- Try web first (`npx expo start --web`) to confirm the app runs  

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
