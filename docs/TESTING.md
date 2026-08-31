# Testing PelviPilot before Google Play

How to validate changes quickly, when you need a real phone install, and why Expo Go is not the main path for this project.

---

## The four ways to test

| Method | Typical wait | Real phone app? | Reminders work? | Best for |
| --- | --- | --- | --- | --- |
| **Web preview** | ~1–2 min after merge | No (browser) | No | UI, settings, EmailJS alerts, session flow |
| **Dev client + Metro** | ~20 min once, then seconds | Yes | Yes | Day-to-day JS/UI changes on your phone |
| **Preview APK (EAS)** | ~15–20 min per build | Yes | Yes | Pre-Play sanity check on a real install |
| **Play internal (.aab)** | ~15–20 min build + upload | Yes | Yes | What testers get from Google Play |

**Rule of thumb:** use web for speed → dev client or preview APK for native behavior → production AAB when ready for internal testers.

---

## 1. Web preview (fastest)

| URL | Updates when |
| --- | --- |
| [Stable main preview](https://labrosvel.github.io/ml-03-pelvic-floor-app/) | Every merge to `main` |
| PR preview | `…/pr-preview/pr-<N>/` per pull request |

After a merge, wait ~1–2 minutes and **hard-refresh** (`Ctrl+Shift+R`). Settings footer shows **Web build `<id>`** when the deploy changed.

**Good for:** screens, copy, exercise flow, progress history, EmailJS test button, physio email settings.

**Not good for:** local notifications/reminders, haptics, “does this feel like the real app on a patient’s phone?”

**Data note:** web uses browser storage. It does **not** share sessions or settings with your Android app.

---

## 2. Dev client + Metro (fast iteration on a real phone)

Use this when you are tired of waiting ~20 minutes for every small JS change (e.g. EmailJS keys in `constants/notifications.ts`, UI tweaks, copy).

### One-time setup (~20 min cloud build)

```bash
npm install
npx eas-cli login
npx eas-cli build -p android --profile development
```

When the build finishes, open the Expo build link **on your Android phone** and install the APK. This is a **development client** — your own PelviPilot shell, not Expo Go.

### Daily workflow (seconds per change)

On your computer, in the repo:

```bash
npm install
npx expo start --dev-client
```

1. Open the **PelviPilot dev client** on your phone (not Expo Go).
2. Scan the QR code or enter the URL Metro shows.
3. Edit JS/TS (screens, `constants/notifications.ts`, i18n, etc.).
4. Save → the app reloads on the phone without a new EAS build.

Your laptop must be on the same network as the phone (or use tunnel: `npx expo start --dev-client --tunnel`).

### When you need a **new** dev client build

Rebuild the development profile only when native things change:

- New native dependency (e.g. new Expo module)
- Expo SDK upgrade
- `app.json` permissions, icons, splash, plugins

---

## 3. Preview APK (pre–Play Store check)

Same ~20 minute EAS queue as production, but outputs an **APK** you install directly — no Play Console step.

```bash
npm run build:android:preview
# or: npx eas-cli build -p android --profile preview
```

1. Open the build URL from [expo.dev](https://expo.dev) on your phone.
2. Install the APK (allow “install unknown apps” for Chrome if prompted).
3. Test reminders, haptics, EmailJS, full patient setup flow.

**Use before** uploading a new `.aab` to internal testing when you want confidence on a standalone install.

See also: [GOOGLE_PLAY.md — Install the preview APK](GOOGLE_PLAY.md#install-the-preview-apk-on-a-phone-not-an-emulator).

---

## 4. Google Play internal testing (.aab)

Production profile builds an **Android App Bundle** for the store:

```bash
npm run build:android:production
npm run submit:android   # optional: upload draft to internal track
```

Then roll out in Play Console → **Internal testing**.

- Uploading a new `.aab` does **not** update phones instantly — testers get it after Play processes the release (often minutes to hours).
- Merging to `main` / web preview does **not** update Play installs.
- OTA (EAS Update) is **off** (`app.json` → `updates.enabled: false`), so Play testers need a new store build for every release today.

Full checklist: [GOOGLE_PLAY.md](GOOGLE_PLAY.md).

---

## Why not Expo Go?

Expo Go is the generic “scan QR, app loads in seconds” app from the Play Store. PelviPilot **can** be opened in Expo Go for a quick look, but this repo does **not** treat it as the main test path:

| Feature | Expo Go | Dev client / preview / Play |
| --- | --- | --- |
| Local reminders | **No** (disabled in code) | Yes |
| `expo-notifications` | Problematic on recent SDKs | Yes |
| Matches store install | No | Yes (preview/Play closer) |
| SDK 57 + this stack | Described as “fiddly” in README | Supported via EAS |

Onboarding copy still mentions Expo Go historically; for real validation use **web preview**, **dev client**, or **preview APK**.

---

## When do you need a new build?

| Change | Web only | Dev client reload | New EAS build | New Play release |
| --- | --- | --- | --- | --- |
| JS screens, copy, EmailJS constants | After deploy | After save (Metro) | If not using dev client | Yes (OTA off) |
| Native module / SDK / permissions | N/A | N/A | **Yes** | **Yes** |
| Icons, splash, `app.json` plugins | N/A | N/A | **Yes** | **Yes** |

---

## Suggested workflow (email alerts example)

1. **Merge** feature → test on **web preview** (EmailJS test button, settings).
2. Fix EmailJS strict mode / private key in `constants/notifications.ts` → reload via **dev client** or wait for web deploy.
3. **`build:android:preview`** → install on your phone → test reminders + daily completion email on real device.
4. Bump `app.json` version if needed → **`build:android:production`** → upload to **internal testing**.

---

## Local commands (reference)

```bash
npm start                    # Expo dev server (Expo Go or dev client)
npx expo start --dev-client  # Prefer with development build installed
npm run web                  # Browser on localhost
npm run typecheck            # TypeScript
npm run build:android:preview     # APK for direct install
npm run build:android:production  # AAB for Google Play
```

EAS profiles live in `eas.json`: `development`, `preview`, `production`.
