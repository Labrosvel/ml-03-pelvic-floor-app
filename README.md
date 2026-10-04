# PelviPilot

Cross-platform pelvic floor exercise companion built with **React Native + Expo**.

Mobile-first (iOS / Android). The hosted web preview is for quick validation only — not a separate product.

> Store id: **PelviPilot** (`com.pelvipilot.app`). Former working name: PelviGuide.

## Features (MVP)

- Guided squeeze / rest sessions with a visual cue
- Customisable exercise plan (physio-friendly timings & reps)
- Local progress history on device
- Optional daily reminders
- Short education articles
- Clinic name + patient name personalisation
- English and Greek (Settings → Language)

---

## Two release paths (important)

| Path | What updates automatically? | Who sees it? |
| --- | --- | --- |
| **Web preview** | Yes — every merge to `main` | Anyone with the link |
| **Google Play (internal testing)** | **No** — you must build & upload a new `.aab` | Testers on your internal list only |

Merging to `main` updates the **web URL**. It does **not** update phones that installed PelviPilot from Google Play. Those users only get new code when you ship a new Play release.

**Current stage:** internal testing on Google Play. The app is **not** searchable in the public Play Store.

---

## Versioning & git tags

Use [semver](https://semver.org/) in `app.json` → `expo.version` (e.g. `1.0.0`, `1.0.1`, `1.1.0`). Keep `package.json` version in sync (the bump script does both).

The same version name appears at the bottom of **Settings** (and on native builds includes the Play version code in parentheses). That is the quick check for “am I on the latest install?”

### What each number means

| Digit | Example bump | Meaning for PelviPilot |
| --- | --- | --- |
| **MAJOR** | `1.0.0` → `2.0.0` | Rare product reset / breaking change |
| **MINOR** | `1.0.0` → `1.1.0` | New user-facing feature (default for feature PRs) |
| **PATCH** | `1.0.0` → `1.0.1` | Bug fix / small correction |

### Two different “versions” (don’t mix them up)

| Field | What it is | Who changes it |
| --- | --- | --- |
| **Version name** (`1.1.0`) | What you see in Settings | Bumped in **every product PR** (see below) |
| **Version code** (integer) | What Google Play requires to increase on each AAB upload | Auto-incremented by EAS production builds (`eas.json` → `autoIncrement: true`) |

The version **name** lives in git and ships inside the next AAB/APK/web build. The Play **version code** only moves when you run a production Android build — already automatic.

### Bump on every product PR (no manual editing)

Do **not** hand-edit `app.json`. In the feature/fix PR itself:

```bash
npm run version:minor   # new feature
npm run version:patch   # bug fix
npm run version:major   # rare
```

CI (`version-check` workflow) fails the PR if product code changed but the version name did not increase. Docs-only / rules-only / CI-only PRs do not need a bump.

Cursor agents are instructed to run the bump as part of product PRs.

### Tag every Play release on `main`

After you build/upload an internal-testing AAB from `main`, tag that commit:

```bash
git checkout main
git pull
git tag -a v1.1.0 -m "Internal testing: short description of changes"
git push origin v1.1.0
```

**Convention**

- Tag format: `v1.0.0`, `v1.1.0`, …
- Tag **on `main`**, on the commit that was built — not on feature branches.
- List tags anytime: `git tag -l 'v*'` or GitHub → **Releases / Tags**.

Example history: `v1.0.0` (first internal test) → `v1.0.1` (bug fix) → `v1.1.0` (new feature).

---

## Releasing a new Android version (internal testing)

Do this whenever you want testers’ phones to get new native code.

### 1. Develop on a branch → PR → merge to `main`

Same as today. The PR should already include a version bump (`version:minor` / `version:patch`). Validate on the web preview if useful (see below).

### 2. Build a new app bundle

```bash
npm run build:android:production
# or: npx eas-cli build -p android --profile production
```

EAS bumps the Play **version code** automatically on production builds. The **version name** comes from the merged `app.json`.

Optional sanity check on your phone first (direct install, not Play Store):

```bash
npm run build:android:preview
```

### 3. Upload to Play Console

**Manual:** expo.dev → download `.aab` → Play Console → **Internal testing** → **Create new release** → upload → add release notes → **Start rollout**.

**Or automated:**

```bash
npm run submit:android
```

Then open Play Console and roll out the draft if needed.

### 4. Tag `main`

```bash
git tag -a v1.1.0 -m "Internal testing: …"
git push origin v1.1.0
```

### 5. Tell testers (optional)

Play Store usually handles updates without you doing anything. Testers with **auto-update** enabled get the new version in the background. Others see an **Update** button on the PelviPilot Play Store page. There is no custom push notification from you — same as most Play Store apps.

---

## Play Console: old releases & rollbacks

- **Old releases are kept.** Uploading release 3 does not delete release 2. See **Release history** on the internal testing page.
- **Only the latest rolled-out release** is what new installs and updates receive.
- You can **promote** a release to another track later (e.g. internal → closed testing).
- Rolling back means creating a new release with an older `.aab` (or re-promoting an older one) — rare for early testing.

You do **not** lose capacity or tester access by shipping often.

---

## When do you need a new `.aab`?

| Change | New `.aab` needed? |
| --- | --- |
| JS/UI copy, screens, logic | **Yes** (today — OTA updates are off) |
| New native dependency / Expo SDK upgrade | **Yes** |
| `app.json` permissions, icons, splash | **Yes** |
| Web-only preview for your mother | **No** — merge to `main` |

Later, if you enable [EAS Update](https://docs.expo.dev/eas-update/introduction/) (`updates.enabled: true`), some JS-only fixes could ship without a new store build. That is not set up yet.

---

## Web preview (validation)

| Audience | URL | Updates |
| --- | --- | --- |
| Stable (e.g. your mother) | https://labrosvel.github.io/ml-03-pelvic-floor-app/ | On every merge to `main` |
| PR branch | `…/pr-preview/pr-<N>/` | Per pull request |

After a merge, wait ~1–2 minutes and hard-refresh. Settings footer shows `Web build <id>` when the deploy changed.

Privacy policy (Play Console): https://labrosvel.github.io/ml-03-pelvic-floor-app/privacy

**Testing on a real phone (dev client, preview APK, Play) without waiting 20 minutes every time:** see **[docs/TESTING.md](docs/TESTING.md)**.

---

## Google Play (first-time setup)

You already completed the first internal release. For listing copy, Data safety, closed testing → production access, and troubleshooting, see **[docs/GOOGLE_PLAY.md](docs/GOOGLE_PLAY.md)**.

**Install for internal testers:** not public search — use the **internal testing opt-in link** from Play Console (Testers tab).

---

## Local development

```bash
git clone https://github.com/Labrosvel/ml-03-pelvic-floor-app.git
cd ml-03-pelvic-floor-app
npm install
npx expo start
```

For a quick browser check: `npm run web` or use the hosted preview above (no Metro required for testers).

For **phone testing** (dev client, preview APK vs Play, why not Expo Go): **[docs/TESTING.md](docs/TESTING.md)**.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run start:dev-client` | Metro for development APK (LAN) |
| `npm run start:dev-client:tunnel` | Metro via Expo account tunnel (phone ↔ laptop) |
| `npm run start:dev-client:usb` | Metro on localhost + `adb reverse` (Android USB) |
| `npm run typecheck` | TypeScript check |
| `npm run build:android:development` | Dev client APK (connects to Metro) |
| `npm run build:android:preview` | Standalone APK for direct phone install |
| `npm run build:android:production` | AAB for Google Play |
| `npm run submit:android` | Upload latest AAB to internal testing (draft) |
| `npm run export:web` | Static web export to `dist/` |

## Project structure

- `app/` — Expo Router screens
- `components/` — UI
- `constants/` — theme, plan, education copy
- `context/` — local app state
- `lib/` — storage, reminders, sessions
- `docs/GOOGLE_PLAY.md` — Play Console checklist
- `docs/TESTING.md` — web vs dev client vs preview APK vs Play
- `docs/PHYSIO_NOTIFICATIONS.md` — daily email alerts setup
- `.github/workflows/` — web deploy + optional EAS

## Disclaimer

PelviPilot supports home practice between physiotherapy appointments under a physiotherapist’s guidance. It is not a medical device, does not diagnose conditions, and does not replace clinical assessment. The publisher accepts no responsibility for injury from use without that guidance. If you feel pain, stop immediately and seek professional advice.
