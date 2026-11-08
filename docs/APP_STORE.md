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

IPA is built in **EAS cloud**. First time needs Apple login **once on a computer** to link credentials to Expo; after that cloud builds can reuse them.

```bash
npm install
npx eas-cli build -p ios --profile production   # first run: interactive Apple login
npx eas-cli submit -p ios --profile production --latest
```

| Command | Purpose |
| --- | --- |
| `npm run build:ios:production` | IPA for App Store / TestFlight |
| `npm run build:ios:production:cloud` | Same, non-interactive (creds already on Expo) |
| `npm run submit:ios` | Upload latest IPA to App Store Connect |

Builds: https://expo.dev/accounts/lamprosv/projects/pelvipilot/builds  

**Status:** Expo `lamprosv` works. No iOS builds yet until that first interactive credential step.

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
