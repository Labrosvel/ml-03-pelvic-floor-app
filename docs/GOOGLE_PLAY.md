# Google Play release guide (PelviGuide)

This is the educational checklist for shipping **PelviGuide** to the Google Play Store with Expo + EAS.

**Honest answer:** nobody can guarantee Google will accept an app on the first try. Acceptance depends on listing accuracy, Data safety answers, permissions, and health-related wording — not only whether the APK builds. This repo can be put in **good shape** for submission; **you** still complete account, payment, and Console steps.

## What is already in good shape

- Real Android package id: `com.pelviguide.app`
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
3. Create app **PelviGuide** (app, not game)  
4. Complete **App content**: privacy policy URL, Data safety, ads (no), target audience, news/COVID (no), etc.

### 2. Expo account + EAS project link

On your computer, in this repo:

```bash
npm install
npx eas-cli login          # or: npx eas login
npx eas init               # creates a real Expo projectId
npx eas update:configure   # optional later for OTA updates
```

`eas init` writes a real `extra.eas.projectId` and updates URL into the Expo config. Until that exists, production OTA stays off (`updates.enabled: false`), which is fine for the **first** store binary.

Optional CI later: add GitHub secret `EXPO_TOKEN` from https://expo.dev/settings/access-tokens

### 3. Build a signed Android App Bundle

```bash
# Installable test build (internal link / APK-style distribution via EAS)
npx eas build -p android --profile preview

# Store-ready production AAB
npx eas build -p android --profile production
```

Test the **preview** build on a real phone before submitting production.

### 4. Submit to Play

```bash
npx eas submit -p android --profile production
```

Or download the `.aab` from the Expo build page and upload manually in Play Console → Production / Internal testing.

**Recommended first track:** **Internal testing** or **Closed testing**, then promote to Production after you and your mother verify.

## Play Console listing (copy starters)

Use careful, non-diagnostic language.

**Short description (≤80 chars):**  
`Guided pelvic floor exercise companion for home practice between physio visits.`

**Full description (draft):**  
PelviGuide helps people follow a physiotherapist-agreed pelvic floor exercise plan at home. It provides timed squeeze/rest cues, a simple progress log on the device, optional reminders, and short education articles.

PelviGuide is an exercise companion. It does not diagnose conditions, does not replace clinical assessment, and is not a medical device.

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

| Question | Typical answer for PelviGuide today |
| --- | --- |
| Collects user data? | **No** personal data sent to your servers (everything is on-device). If you only store clinic/patient labels locally, declare accordingly — do **not** claim “no data” if you later add analytics/accounts. |
| Encrypted in transit? | N/A if nothing is transmitted |
| Users can request deletion? | Local “Reset local data” clears on-device storage |
| Independent security review? | No (unless you commission one) |

Update this form if you add accounts, analytics, crash reporting, or cloud sync.

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

## Suggested order of operations

1. Merge this prep PR  
2. Confirm privacy URL loads on GitHub Pages  
3. Create Play Console account + draft listing  
4. `eas login` + `eas init`  
5. `eas build -p android --profile preview` → mother installs & validates  
6. `eas build` production → Internal testing → Production  

## Apple later

Same Expo project; separate Apple Developer Program (~$99/year), certificates, and App Store Connect listing. Do Android first if that matches your plan.
