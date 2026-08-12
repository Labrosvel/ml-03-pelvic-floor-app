# PelviGuide

Cross-platform pelvic floor exercise companion built with **React Native + Expo**.

This is a **mobile-first** app (iOS / Android). Web is only an optional local convenience for quick UI checks — not the product.

> This is an original app inspired by the pelvic-floor exercise category. It is **not** affiliated with Squeezy or any other commercial product.

## Features (MVP)

- Guided squeeze / rest sessions with a visual cue
- Customisable exercise plan (physio-friendly timings & reps)
- Local progress history on device
- Optional daily reminders
- Short education articles
- Clinic name + patient name personalisation

## How validation works (important)

We use **EAS Update** so you can test like a normal app team:

| Who | What they open | Tracks |
| --- | --- | --- |
| Your mother (stable app) | **Production** Expo link / QR | GitHub `main` |
| You (before merge) | **PR preview** link / QR on the pull request | The feature branch |

Flow:

1. Agent develops on a **feature branch** and opens a PR  
2. GitHub Action publishes an EAS Update for that PR and comments a **QR / link**  
3. You open that preview on your phone (Expo Go) and validate  
4. You merge to `main` only when happy  
5. GitHub Action publishes `main` to the **production** channel  
6. Your mother keeps using the **same production link** — it updates to the new `main`

Cloud Agent tunnel / `localhost` links are temporary developer tools. They are **not** the stable framework.

## One-time setup (required before previews work)

Do this once on your Expo + GitHub accounts:

1. Create / log into an Expo account: https://expo.dev  
2. On your computer (or any machine with the repo):

```bash
npm install
npx eas-cli login
npx eas init
npx eas update:configure
```

   Commit the updated `app.json` / project ID that `eas init` writes.

3. Create an Expo access token: https://expo.dev/settings/access-tokens  
4. Add it as a GitHub Actions secret named **`EXPO_TOKEN`**:  
   `https://github.com/Labrosvel/ml-03-pelvic-floor-app/settings/secrets/actions`

After that:

- every PR gets a mobile preview comment automatically  
- every merge to `main` updates the production channel automatically  

### Mother’s stable link

After the first production publish, open the project on Expo and use the **production** channel link/QR (from the Expo dashboard or the production workflow log). Bookmark that — it is her app entry point.

### Your branch validation link

Open the pull request on GitHub → wait for the **preview** workflow → use the QR/link in the bot comment.

## Local development (laptop or Cloud Agent)

```bash
git clone https://github.com/Labrosvel/ml-03-pelvic-floor-app.git
cd ml-03-pelvic-floor-app
npm install
npx expo start
```

### Phone via Expo Go (same Wi‑Fi or tunnel)

1. Install Expo Go: https://expo.dev/go  
2. Run:

```bash
npx expo start --tunnel
```

3. Scan the QR with Expo Go  

### Optional browser check (not the mobile product)

```bash
npx expo start --web
```

### Cloud Agent port forwarding

If Expo runs inside a Cursor Cloud Agent, forward port **8081** and open `http://localhost:8081` for a quick web glance. Prefer EAS PR/production links for real validation.

## Manual publish (optional)

```bash
# Feature / staging channel
npm run update:preview

# Stable channel (usually done by CI on main)
npm run update:production
```

## Project structure

- `app/` — Expo Router screens (Home, Progress, Learn, Settings, Exercise, Plan)
- `components/` — UI + squeeze visual
- `constants/` — theme, default plan, education copy
- `context/` — local app state
- `lib/` — storage, reminders, session builder
- `.github/workflows/` — EAS Update CI for PR previews + production

## Next customisation steps

1. Finish Expo one-time setup (`eas init` + `EXPO_TOKEN`) if not done  
2. Rename branding / clinic defaults in `constants/theme.ts`  
3. Adjust default clinical plan in `constants/plans.ts`  
4. Add Greek language strings when ready  
5. Later: `eas build` for store binaries; clinician dashboard / multi-patient sync  

## Disclaimer

PelviGuide supports home practice between physiotherapy appointments. It is not a medical device, does not diagnose conditions, and does not replace clinical assessment.
