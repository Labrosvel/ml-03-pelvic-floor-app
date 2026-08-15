# PelviGuide

Cross-platform pelvic floor exercise companion built with **React Native + Expo**.

This is a **mobile-first** app (iOS / Android). Hosted web builds are only for convenient validation links — not a product pivot.

> This is an original app inspired by the pelvic-floor exercise category. It is **not** affiliated with Squeezy or any other commercial product.

## Features (MVP)

- Guided squeeze / rest sessions with a visual cue
- Customisable exercise plan (physio-friendly timings & reps)
- Local progress history on device
- Optional daily reminders
- Short education articles
- Clinic name + patient name personalisation
- English and Greek language support (Settings → Language)

## Validation framework (how to test before merge)

| Who | Stable entry point | Tracks |
| --- | --- | --- |
| Your mother | **Main web preview** (below) | GitHub `main` |
| You (before merge) | **PR web preview** link on the pull request | The feature branch |

### Stable main URL (for your mother)

After GitHub Pages is enabled and `main` has deployed:

**https://labrosvel.github.io/ml-03-pelvic-floor-app/**

That URL stays the same. Merges to `main` update what it shows.

### Feature-branch URL (for you)

Each open PR gets its own preview:

**https://labrosvel.github.io/ml-03-pelvic-floor-app/pr-preview/pr-&lt;N&gt;/**

Example for PR `#5`:  
https://labrosvel.github.io/ml-03-pelvic-floor-app/pr-preview/pr-5/

The PR also gets a comment with the link when the workflow finishes.

### Flow

1. Work happens on a **feature branch** + pull request  
2. Open the **PR preview URL** and validate UI/behaviour  
3. Merge only when happy  
4. **Main URL** updates to the new `main`  
5. Your mother keeps using the same main URL  

**For your mother: prefer the web link.** She does **not** need Expo Go, and you do **not** need to keep `npx expo start` running.

| Validation method | Needs your computer running? | Good for mother? |
| --- | --- | --- |
| **Main web URL** (GitHub Pages) | No — hosted online | **Yes (recommended)** |
| **Expo Go + QR / tunnel** | **Yes** — Metro must stay open | No — fragile, phone SDK matching |
| Later: EAS installable build | No after install | Yes, when ready |

Cloud Agent `localhost` / tunnel links are temporary and are **not** this framework.

### If the main URL looks unchanged after a merge

1. Wait ~1–2 minutes for GitHub Pages to finish deploying  
2. Hard refresh the page: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)  
3. Or open the URL in a private/incognito window  
4. Open **Settings** — the footer shows `Web build <id>`; that id changes when main redeploys  

Some fixes (like editable plan numbers) do not change the Home screen look — open **Edit exercise plan** to verify.

## One-time: enable GitHub Pages

1. Open https://github.com/Labrosvel/ml-03-pelvic-floor-app/settings/pages  
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**  
3. Branch: **`gh-pages`** / folder **`/` (root)** → Save  
4. Merge this setup PR, wait for **deploy-web** / **preview-web** workflows, then open the URLs above  

No Expo account is required for these web preview links.

## Optional later: mobile Expo previews (EAS)

When you want phone validation via Expo Go / EAS (recommended before store release):

1. Expo account + `npx eas init` + `npx eas update:configure`  
   (this writes a real `updates.url` + `extra.eas.projectId`; until then updates stay disabled so Expo Go does not try a fake OTA URL)  
2. GitHub secret **`EXPO_TOKEN`**  
3. Existing workflows `preview.yml` / `production.yml` will stop skipping and publish mobile QR/links  

Until then those workflows skip safely; web previews still work.

## Local development

```bash
git clone https://github.com/Labrosvel/ml-03-pelvic-floor-app.git
cd ml-03-pelvic-floor-app
npm install
npx expo start
```

### Phone via Expo Go

This project uses **Expo SDK 57**. The Expo Go app from the App Store / Play Store is often still on an older SDK, so scanning the QR can fail even when Metro/tunnel is healthy.

1. Install the **SDK 57** Expo Go build from https://expo.dev/go (choose SDK 57 → Android or iOS).  
   - **Android:** install the APK from that page (sideload).  
   - **iOS:** store Expo Go may not support SDK 57 yet — use the web preview below, or later `eas go` / a development build.
2. On the phone, stay on Expo Go **home** (you do **not** need to log in). Ignore any screen that tells you to run `npx expo start` — that is for Expo account projects, not your local Metro QR.
3. On the computer, start the project:

```bash
npm install
npx expo start --tunnel
```

4. Scan the QR in the **computer terminal**, or paste the printed `exp://…` URL into Expo Go → **Enter URL manually**.

`@expo/ngrok` is a project dependency so tunnel mode works without a global npm install (global install often fails with `EACCES`).

If you previously saw **Failed to download remote update**, pull the latest fix (placeholder EAS update URL removed) and restart Metro with `npx expo start --tunnel` before scanning again.

Expo Go on Android cannot use `expo-notifications` (SDK 53+). The app skips reminders there so the rest of the UI can load; reminders work in a development/production build later.

If QR / Metro URL still fails after installing SDK 57 Expo Go, use the **web preview** URL in the validation framework above — that path does not need Expo Go.

### Optional local web

```bash
npx expo start --web
# or static export
npm run export:web
```

## Scripts

- `npm start` — Expo dev server  
- `npm run web` — web dev server  
- `npm run export:web` — static web export to `dist/`  
- `npm run typecheck` — TypeScript check  
- `npm run update:production` / `update:preview` — manual EAS publish (needs Expo login)

## Project structure

- `app/` — Expo Router screens  
- `components/` — UI + squeeze visual  
- `constants/` — theme, plan, education copy  
- `context/` — local app state  
- `lib/` — storage, reminders, session builder  
- `.github/workflows/` — main/PR web previews + optional EAS  

## Disclaimer

PelviGuide supports home practice between physiotherapy appointments. It is not a medical device, does not diagnose conditions, and does not replace clinical assessment.
