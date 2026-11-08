# App Store release guide (PelviPilot)

This is the checklist for shipping **PelviPilot** to the Apple App Store with Expo + EAS.

**Honest answer:** Apple can reject on listing accuracy, privacy answers, health-related wording, missing screenshots, or binary issues — not only whether the IPA builds. This repo can be put in **good shape** for submission; **you** still complete Apple Developer enrollment, App Store Connect, and review.

Android / Play Console is documented separately in **[GOOGLE_PLAY.md](GOOGLE_PLAY.md)**. Prefer finishing Play first if that matches your plan; the same Expo project ships both stores.

## What is already in good shape

- iOS bundle id: `com.pelvipilot.app` (`app.json` → `expo.ios.bundleIdentifier`)
- App name **PelviPilot**, icon, splash
- Expo SDK 57 + EAS project linked (`extra.eas.projectId`)
- Local-only data model (settings, plan, sessions on device), plus optional physio notify email
- In-app medical disclaimer (not a medical device / not a substitute for clinical care)
- Public **Privacy Policy** URL (required):  
  `https://labrosvel.github.io/ml-03-pelvic-floor-app/privacy`
- Microphone recording disabled (`expo-audio` → `microphonePermission: false`)

## What you must do (cannot be done by the agent alone)

### 1. Apple Developer Program (~$99 / year)

1. Enroll at https://developer.apple.com/programs/  
2. Sign in to [App Store Connect](https://appstoreconnect.apple.com/) with that Apple ID  
3. Create app **PelviPilot** (iOS), bundle id **`com.pelvipilot.app`**  
4. Complete **App Privacy**, age rating, pricing, and required compliance questionnaires

### 2. Expo account + Apple credentials for EAS

On your computer, in this repo:

```bash
npm install
npx eas-cli login
# First iOS build usually prompts for Apple ID + app-specific password / Asc credentials
npx eas-cli credentials -p ios
```

Use **`npx eas-cli …`** (not `npx eas …`). Same rule as Android — see [GOOGLE_PLAY.md](GOOGLE_PLAY.md).

EAS can manage distribution certificates and provisioning profiles for you. You still need an active Apple Developer membership.

Optional CI later: GitHub secret `EXPO_TOKEN` from https://expo.dev/settings/access-tokens (same token as Android).

### 3. Build for iOS

There are no dedicated `npm run build:ios:*` scripts yet. Use EAS directly:

```bash
# Internal / TestFlight-style distribution (device install via Expo or TestFlight)
npx eas-cli build -p ios --profile preview

# Store / TestFlight production IPA
npx eas-cli build -p ios --profile production
```

Builds for this app:  
https://expo.dev/accounts/lamprosv/projects/pelvipilot/builds

Test on a **real iPhone** (or TestFlight) before asking for App Review. Web preview does **not** replace iOS screenshot or native checks. Broader testing notes: **[TESTING.md](TESTING.md)** (currently Android-heavy; same product flows apply).

### 4. Submit to App Store Connect

```bash
npx eas-cli submit -p ios --profile production
```

Or download the `.ipa` from the Expo build page and upload with Transporter / Xcode Organizer.

**Recommended first path:** upload to **TestFlight** → internal testers → then submit the same build for App Review when ready.

## App Store Connect screenshots (common failure)

App Store Connect **accepts PNG** (and JPEG). If upload fails, read the red banner carefully — the usual message is **“File dimensions are invalid”**, not “PNG not allowed.”

A Mac desktop screenshot, a photo of the phone, or a resized web capture will be rejected unless the **pixel size matches exactly** one of Apple’s allowed sizes for that device tab.

### iPhone with Dynamic Island (medium display)

Required on the Product Page for that tab (as shown in App Store Connect):

| Asset type | Allowed sizes (width × height) |
| --- | --- |
| **App Screenshots** | `1179 × 2556`, `2556 × 1179`, `1206 × 2622`, or `2622 × 1206` |
| **App Previews** (optional video) | `886 × 1920` or `1920 × 886` |

- Portrait app → use **`1179 × 2556`** or **`1206 × 2622`**.  
- Need **at least 1** screenshot for the required iPhone size class (up to 10).  
- App Previews are optional.  
- Capture from a real **iPhone 14 Pro / 15 Pro / 16 Pro** (or matching Xcode Simulator), then upload those files as PNG or JPEG. Do **not** stretch a wrong-size image to “look close.”

### Other device tabs

App Store Connect may also show slots such as larger iPhones, iPad, or Apple Watch. Fill what the console marks as required for your app’s supported devices (`supportsTablet: true` today). Always use the sizes printed under that tab’s upload box — they change by device class.

### How to capture valid screenshots

1. Run a TestFlight / preview / simulator build of PelviPilot.  
2. Open the screen you want (Home, session, progress, education, settings).  
3. On device: Side button + Volume Up (or Simulator → **File → Save Screen**).  
4. Confirm dimensions in Preview / Photos / `file` / an image tool **before** uploading.  
5. Upload in App Store Connect → your version → **Product Page Information** → the matching device tab.

Store listing **feature graphics** under `assets/store/` are for **Google Play only** (1024 × 500). They are not App Store screenshots.

## App Store listing (copy starters)

Use careful, non-diagnostic language (same positioning as Play).

**Subtitle / promotional text:** short exercise-companion wording — not “treat,” “cure,” or “diagnose.”

**Description (draft):**  
PelviPilot helps people follow a physiotherapist-agreed pelvic floor exercise plan at home. It provides timed squeeze/rest cues, a simple progress log on the device, optional reminders, and short education articles.

PelviPilot is an exercise companion. It does not diagnose conditions, does not replace clinical assessment, and is not a medical device.

Features:
- Guided squeeze and rest sessions
- Customisable plan timings
- Local progress history on the device
- Optional daily reminders
- English, Greek, Italian, Spanish, and French

**Category:** Health & Fitness  
**Privacy Policy URL:** `https://labrosvel.github.io/ml-03-pelvic-floor-app/privacy`

## App Privacy (match the product)

Current app behaviour (align App Store Connect answers with this):

| Topic | Typical answer for PelviPilot today |
| --- | --- |
| Data linked to user / collected? | **Limited.** When daily plan is complete, patient name, clinic label, plan name, and session count can be sent to your notify API (email to physiotherapist). Other exercise history stays on-device. |
| Tracking (ATT)? | **No** unless you add ad/analytics SDKs that require it |
| Health data / clinical records? | Do **not** claim clinical health records; this is an exercise companion log |
| Deletion | Local “Reset local data” clears on-device storage |

Update App Privacy if you add accounts, analytics, crash reporting, or broader cloud sync. See `docs/PHYSIO_NOTIFICATIONS.md`.

## Health / medical review tips

- Do **not** claim to treat, cure, or diagnose.  
- Keep the in-app disclaimer.  
- Prefer “exercise companion / home practice between appointments.”  
- Answer any medical/health questionnaire consistently with that positioning.

## Will Apple accept it?

**Maybe on first try, maybe after fixes.** Common rejection reasons:

- Missing privacy policy or App Privacy answers that don’t match the app  
- Invalid or missing screenshots (wrong dimensions)  
- Over-medical marketing claims  
- Crash on launch / broken required flows  
- Incomplete metadata (age rating, contact info, review notes)

Your codebase is **MVP-ready to start the iOS release path**, not “pre-approved.”

## Develop while waiting?

Yes. Keep coding on branches. Users only get new code when you ship a new App Store / TestFlight build (and later optional EAS Update). Waiting on review does not freeze development.

## Suggested order of operations

1. Confirm Apple Developer Program is active  
2. Create the App Store Connect app with bundle id `com.pelvipilot.app`  
3. Confirm privacy URL loads on GitHub Pages  
4. `npx eas-cli credentials -p ios` (or let the first build guide you)  
5. `npx eas-cli build -p ios --profile preview` → install / TestFlight → validate  
6. Capture **correctly sized** iPhone screenshots → upload to Product Page  
7. `npx eas-cli build -p ios --profile production` → TestFlight → Submit for Review  

## Related docs

- [GOOGLE_PLAY.md](GOOGLE_PLAY.md) — Android / Play Console (already in use)  
- [TESTING.md](TESTING.md) — how to validate before store  
- [VISION.md](VISION.md) — product scope and non-goals  
- [PHYSIO_NOTIFICATIONS.md](PHYSIO_NOTIFICATIONS.md) — notify API / email  
