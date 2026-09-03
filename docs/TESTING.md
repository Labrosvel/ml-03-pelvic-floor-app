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

**Important:** this is a different install from **preview APK** or **Google Play**. Those builds cannot connect to Metro. You need the **`development`** EAS profile.

```bash
npm install
npx eas-cli login
npm run build:android:development
# or: npx eas-cli build -p android --profile development
```

When the build finishes, open the Expo build link **on your Android phone** and install the APK.

You should see a **development launcher** (or PelviPilot opens with a dev menu) — not the normal standalone app, and **not** Expo Go from the Play Store.

If you previously installed PelviPilot from **internal testing** or **`build:android:preview`**, that build will **not** work with `expo start --dev-client`. Install the **development** APK instead (both can coexist if package id matches — the dev build replaces the same app icon).

After changing native config (e.g. adding `expo-dev-client` to `app.json` plugins), run **`build:android:development` again**.

### Daily workflow (seconds per change)

On your computer, in the repo (keep this terminal running):

```bash
npm install
npm run start:dev-client
```

Phone and laptop must be on the **same Wi‑Fi** (not guest/isolated Wi‑Fi). Disable VPN on both if connection fails.

If the phone cannot reach your laptop on Wi‑Fi, use the tunnel (slower but more reliable across networks):

```bash
npx expo login    # once — required for tunnel in Expo SDK 57
npm run start:dev-client:tunnel
```

**Android over USB** (no Wi‑Fi needed — often the most reliable option):

```bash
adb reverse tcp:8081 tcp:8081
npm run start:dev-client:usb
```

Then open the development build on the phone (still connected by USB).

Then on the phone:

1. Open the **PelviPilot development build** you installed from the **development** EAS profile — **not** Expo Go, **not** the Play Store internal-testing install unless it was built with `--profile development`.
2. Connect to Metro (**QR is optional** — see below if the camera scanner fails).
3. Edit JS/TS on your laptop → save → the app reloads on the phone.

**Metro must stay running** on your laptop the whole time. Closing the terminal stops the phone from loading new code.

### Connect without QR (recommended if the scanner fails)

The in-app QR camera often fails to open (permission / launcher bug). You do **not** need it.

**Option A — Enter URL manually (works with tunnel or LAN)**

1. On the laptop, wait until Metro prints a line like:
   ```
   › Metro: exp+pelvipilot://expo-development-client/?url=https%3A%2F%2F….exp.direct
   ```
   or (LAN) `…?url=http%3A%2F%2F192.168.…%3A8081`
2. Copy that **whole** `exp+pelvipilot://…` URL.
3. On the phone, open the **development** PelviPilot app.
4. On the launcher screen, choose **Enter URL manually** (wording varies: “Enter URL”, “Connect”, etc.).
5. Paste the URL and connect.

**Option B — USB (most reliable on Android)**

```bash
adb reverse tcp:8081 tcp:8081
npm run start:dev-client:usb
```

Then open the development app. It should reach Metro at `localhost:8081` through the USB cable. If asked for a URL, use:

```text
exp+pelvipilot://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081
```

**Do not** scan the Metro QR with the phone’s **system Camera** app — that is not how the development client connects. Use Enter URL, USB, or the in-app scanner only.

### Dev client troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| In-app QR scanner won’t open / black screen | Camera permission or launcher bug | **Skip QR** — paste the Metro `exp+pelvipilot://…` URL (see above) or use USB |
| QR loads forever / “Could not connect” | Phone on different network, VPN, or firewall | Same Wi‑Fi; disable VPN; or use USB / tunnel + Enter URL |
| Keyboard covers Quick squeezes (dev client) | Web and native handle keyboards differently | Pull latest — plan screen scrolls fields on focus; shake device → Reload if Metro was already running |
| Keyboard still bad on dev client after reload | Old development APK (`adjustPan` not `resize`) | Re-run `npm run build:android:development` once (native config changed) |
| Tunnel command errors immediately | Not logged into Expo, or port 8081 busy | Look for `PelviPilot Metro launcher` in terminal; run `npx expo login`, retry tunnel |
| Tunnel mentions ngrok / “remote gone away” | Legacy ngrok path (broken on many machines in 2026) | Pull latest repo — tunnel script uses Expo ws-tunnel; run `npx expo login` first |
| Metro exits / “crashed” immediately | Port 8081 in use | Script auto-stops stale Metro for tunnel; for LAN, close other Expo terminals or use `--port 8082` |
| Phone shows nothing / “Unable to load” | Wrong app installed | Install APK from **`development`** profile, not preview/Play |
| Phone can’t connect on Wi‑Fi | Guest network blocks device-to-device | Use tunnel or USB mode instead |
| Opens in Expo Go | Wrong app | Uninstall Expo Go test; use dev client APK |
| “Could not connect to development server” | Laptop sleep / VPN / Metro stopped | Wake laptop, restart Metro, same network or tunnel |
| Bundling error in terminal | JS/TS error in code | Read the red error in the Metro log; fix and save |
| Worked before, broke after git pull | Native config changed | Re-run `npm run build:android:development` |
| WSL2 on Windows | LAN IP is the Linux VM, not your PC | Run Metro from Windows PowerShell/cmd in the repo, or use tunnel/USB |

If dev client still feels brittle, skip it: use **web preview** for fast JS checks and **`build:android:preview`** when you need a full standalone phone test before Play.

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

For real validation use **web preview**, **dev client**, or **preview APK**.

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
npm run start:dev-client     # LAN — phone and laptop on same Wi‑Fi
npm run start:dev-client:tunnel  # Expo account tunnel (run `npx expo login` first)
npm run start:dev-client:usb     # Android USB + adb reverse
npm run web                  # Browser on localhost
npm run typecheck            # TypeScript
npm run build:android:development  # Dev client APK (Metro daily workflow)
npm run build:android:preview     # Standalone APK for direct install
npm run build:android:production  # AAB for Google Play
```

EAS profiles live in `eas.json`: `development`, `preview`, `production`.
