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

Cloud Agent `localhost` / tunnel links are temporary and are **not** this framework.

## One-time: enable GitHub Pages

1. Open https://github.com/Labrosvel/ml-03-pelvic-floor-app/settings/pages  
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**  
3. Branch: **`gh-pages`** / folder **`/` (root)** → Save  
4. Merge this setup PR, wait for **deploy-web** / **preview-web** workflows, then open the URLs above  

No Expo account is required for these web preview links.

## Optional later: mobile Expo previews (EAS)

When you want phone validation via Expo Go / EAS (recommended before store release):

1. Expo account + `npx eas init` + `npx eas update:configure`  
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

```bash
npx expo start --tunnel
```

Scan the QR with Expo Go: https://expo.dev/go

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
