# Google Play release guide (PelviPilot)

This is the educational checklist for shipping **PelviPilot** to the Google Play Store with Expo + EAS.

**Honest answer:** nobody can guarantee Google will accept an app on the first try. Acceptance depends on listing accuracy, Data safety answers, permissions, and health-related wording — not only whether the APK builds. This repo can be put in **good shape** for submission; **you** still complete account, payment, and Console steps.

## What is already in good shape

- Real Android package id: `com.pelvipilot.app`
- App name, icon, splash, adaptive icons
- Expo SDK 57 + `eas.json` production / preview profiles
- Local-only data model (settings, plan, sessions on device)
- In-app medical disclaimer (not a medical device / not a substitute for clinical care)
- Public **Privacy Policy** route (required by Play): after merge + Pages deploy →  
  `https://labrosvel.github.io/ml-03-pelvic-floor-app/privacy`
- Microphone / `RECORD_AUDIO` disabled (app only plays cue sounds)

## What you must do (cannot be done by the agent alone)

### 1. Google Play Console (~$25 one-time)

1. Open https://play.google.com/console  
2. Create a developer account and pay the registration fee  
3. Create app **PelviPilot** (app, not game)  
4. Complete **App content**: privacy policy URL, Data safety, ads (no), target audience, news/COVID (no), etc.

### 2. Expo account + EAS project link

On your computer, in this repo:

```bash
npm install
npx eas-cli login
npx eas-cli init --account <your-expo-username>
# optional later for OTA updates:
npx eas-cli update:configure
```

Use **`npx eas-cli …`** (not `npx eas …`). `npx eas` fails with `could not determine executable to run` because the npm package name is `eas-cli`.

`eas-cli init` writes a real `extra.eas.projectId` into the Expo config. Until that exists, production OTA stays off (`updates.enabled: false`), which is fine for the **first** store binary.

**After renaming the Expo slug** (e.g. `pelviguide` → `pelvipilot`), the old EAS project id no longer matches. If `eas build` fails with *Slug … does not match*, run:

```bash
npx eas-cli init --account lamprosv --non-interactive --force --json
```

That links/creates `@lamprosv/pelvipilot` and updates `app.json` → `extra.eas.projectId`. Old preview builds stay under the previous Expo project; install a **new** build for PelviPilot on your phone.

Optional CI later: add GitHub secret `EXPO_TOKEN` from https://expo.dev/settings/access-tokens

### 3. Build a signed Android App Bundle

```bash
# Installable test build (internal link / APK-style distribution via EAS)
npx eas-cli build -p android --profile preview
# or: npm run build:android:preview

# Store-ready production AAB
npx eas-cli build -p android --profile production
# or: npm run build:android:production
```

Test the **preview** build on a real phone before submitting production. Full testing workflow (web, dev client, preview APK, Play): **[TESTING.md](TESTING.md)**.

#### Install the preview APK on a phone (not an emulator)

When the build finishes, EAS prints a link like:

`https://expo.dev/accounts/<you>/projects/pelvipilot/builds/<build-id>`

1. Open that link **on the Android phone** (Chrome), or scan the QR from another device.  
2. Download / install the APK.  
3. If Android blocks it: **Settings → security / install unknown apps** → allow the browser.  
4. When the CLI asks *“Install and run the Android build on an emulator?”*, answer **No** unless you have Android Studio + an emulator on **that same machine**.  
   - In Cursor Cloud / remote agents there is usually **no `adb`**, so choosing Yes fails with `spawn adb ENOENT` even when the cloud build succeeded.  
5. Phone install does **not** need Expo Go and does **not** need your laptop to keep running Metro.

Current successful preview build (example):  
https://expo.dev/accounts/lamprosv/projects/pelvipilot/builds/2ea28e9e-ec50-4016-93d6-e3d6f748785e

### 4. Submit to Play

```bash
npx eas-cli submit -p android --profile production
# or: npm run submit:android
```

Or download the `.aab` from the Expo build page and upload manually in Play Console → Production / Internal testing.

**Recommended first track:** **Internal testing** or **Closed testing**, then promote to Production after you and your mother verify.

## Store listing graphics

Ready-to-upload files in **`assets/store/`** (exact Play sizes):

| Asset | File | Spec |
| --- | --- | --- |
| Feature graphic (English / default) | `assets/store/feature-graphic.png` | 1024 × 500 PNG |
| Feature graphic (Greek) | `assets/store/feature-graphic-el.png` | 1024 × 500 PNG |

Upload the English file under the default listing language, or the Greek file if your default store language is Greek. You can replace either later; localised graphics are optional per language.

App icon for Play (512 × 512) can be exported from `assets/images/icon.png` (resize if needed). Phone screenshots still need to be captured from a device or emulator.

## Play Console listing (copy starters)

Use careful, non-diagnostic language.

**Short description (≤80 chars):**  
`Guided pelvic floor exercise companion for home practice between physio visits.`

**Full description (draft):**  
PelviPilot helps people follow a physiotherapist-agreed pelvic floor exercise plan at home. It provides timed squeeze/rest cues, a simple progress log on the device, optional reminders, and short education articles.

PelviPilot is an exercise companion. It does not diagnose conditions, does not replace clinical assessment, and is not a medical device.

Features:
- Guided squeeze and rest sessions
- Customisable plan timings
- Local progress history on the device
- Optional daily reminders
- English and Greek

**Category:** Health & Fitness  
**Tags:** exercise, physiotherapy support, women's health / pelvic health (as appropriate)

**Screenshots:** capture from a real device or emulator (phone frames). Need several phone screenshots.

## Data safety form (match the product)

Current app behaviour:

| Question | Typical answer for PelviPilot today |
| --- | --- |
| Collects user data? | **Yes — limited.** When daily plan is complete, patient name, clinic label, plan name, and session count are sent to your notify API (email to physiotherapist). Other exercise history stays on-device. Update the form if you add accounts, analytics, or full cloud sync. |
| Encrypted in transit? | **Yes** (HTTPS to notify API and email provider) |
| Users can request deletion? | Local “Reset local data” clears on-device storage |
| Independent security review? | No (unless you commission one) |

Update this form if you add accounts, analytics, crash reporting, or broader cloud sync. See `docs/PHYSIO_NOTIFICATIONS.md` for the notify API.

## Health / medical review tips

- Do **not** claim to treat, cure, or diagnose.  
- Keep the in-app disclaimer.  
- Prefer “exercise companion / home practice between appointments.”  
- If Google asks for a health declaration, answer consistently with that positioning.

## Will Google accept it?

**Maybe on first try, maybe after fixes.** Common rejection reasons:

- Missing or weak privacy policy  
- Data safety answers that don’t match the app  
- Unused sensitive permissions (why we removed mic recording)  
- Over-medical marketing claims  
- Broken login / crash on open (test the AAB first)  
- Incomplete store listing (screenshots, content rating)

Your codebase is **MVP-ready to start the release path**, not “pre-approved.”

## Develop while waiting?

Yes. Keep coding on branches. Users only get new code when you ship a new Play release (and later optional EAS Update). Waiting on review does not freeze development.

**Repeat releases (internal testing and beyond):** see the **Releasing a new Android version** section in [README.md](../README.md).

## Suggested order of operations

1. Merge this prep PR  
2. Confirm privacy URL loads on GitHub Pages  
3. Create Play Console account + draft listing  
4. `npx eas-cli login` + `npx eas-cli init --account <username>`  
5. `npm run build:android:preview` → mother installs & validates  
6. `npm run build:android:production` → Internal testing → Production  

## Apple later

Same Expo project; separate Apple Developer Program (~$99/year), certificates, and App Store Connect listing. Do Android first if that matches your plan.
