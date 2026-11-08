# App Store (PelviPilot)

Same Expo project as Android. Play guide: [GOOGLE_PLAY.md](GOOGLE_PLAY.md).

## Owner setup (do not forget)

- **No personal iPhone.** Do **not** tell the owner to take phone screenshots, install TestFlight on their phone, or buy an iPhone.
- Day-to-day device is **Android + Google Play**. App Store listing is separate.
- **Buying an iPhone is optional**, not required to submit. Apple reviews on their own devices. Screenshots only need the **correct pixel sizes**.

## Screenshots (no iPhone)

App Store Connect **accepts PNG**. “File dimensions are invalid” = wrong **size**, not wrong file type.

For **iPhone with Dynamic Island (medium display)** use portrait **`1179×2556`** or **`1206×2622`** (at least one image).

**Ready files (upload these):** [`assets/store/ios-screenshots/`](../assets/store/ios-screenshots/) — five PNGs at **1179 × 2556**.

In App Store Connect → Product Page → **iPhone with Dynamic Island (medium display)** → drag those files in. PNG is fine.

Do **not** upload a Mac desktop capture or a wrong-size browser screenshot. `assets/store/feature-graphic*.png` are **Play only**.

## Build / submit (no iPhone needed)

IPA is built in **EAS cloud**. Signing credentials and the ASC API key are stored on Expo (`lamprosv`); cloud agents use `EXPO_TOKEN` + `EXPO_ASC_*` / `EXPO_APPLE_TEAM_*` secrets for non-interactive build/submit.

```bash
npm install
npm run build:ios:production:cloud   # or: npx eas-cli build -p ios --profile production
npm run submit:ios                   # uploads latest IPA; eas.json has ascAppId
```

| Command | Purpose |
| --- | --- |
| `npm run build:ios:production` | IPA for App Store / TestFlight |
| `npm run build:ios:production:cloud` | Same, non-interactive (creds already on Expo) |
| `npm run submit:ios` | Upload latest IPA to App Store Connect |

Builds: https://expo.dev/accounts/lamprosv/projects/pelvipilot/builds  

**Status:** Production iOS IPA builds and submits via EAS. ASC App ID `6832199337` is in `eas.json`. Cloud-agent secrets: `EXPO_TOKEN`, `EXPO_ASC_*`, `EXPO_APPLE_TEAM_*`. Distribution cert + App Store profile (with Push Notifications) are stored on EAS for account `lamprosv`. Latest submitted: **1.7.3 (6)** on TestFlight (internal ready). Listing still needs screenshots + **Add for Review**.

TestFlight is only useful if someone else (e.g. a tester with an iPhone) installs it. The owner does not need it.

## Listing after screenshots

Privacy URL: `https://labrosvel.github.io/ml-03-pelvic-floor-app/privacy`  
App Privacy: local data + optional physio notify email — [PHYSIO_NOTIFICATIONS.md](PHYSIO_NOTIFICATIONS.md)  
Wording: exercise companion — not diagnose / treat / medical device  
Then **Add for Review**.

## Already configured

- Bundle id `com.pelvipilot.app`
- `ITSAppUsesNonExemptEncryption: false`
- Icon, splash, disclaimer, privacy page
