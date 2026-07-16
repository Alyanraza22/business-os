# Business OS — Desktop

A dedicated window for Business OS. The app itself still runs on the server, so
there is no second codebase here: this is a shell around the deployed product,
which is why it never drifts out of sync with the web app.

## Build

```bash
cd desktop
npm install
npm run dist        # → dist/Business OS Setup <version>.exe
```

Two things reliably go wrong the first time:

- **npm blocks Electron's `postinstall`.** npm asks to approve install scripts,
  and Electron's is the one that downloads its ~216 MB runtime. Without it every
  build re-downloads from scratch and eventually times out. If
  `node_modules/electron/dist/electron.exe` is missing, fetch it directly:

  ```bash
  node node_modules/electron/install.js
  ```

- **The first build pulls ~250 MB** (Electron, NSIS, 7-Zip). Later builds reuse
  the cache and take seconds. If a download times out, just re-run — but never
  run two builds at once: they fight over the same `eb-dl-*.lock` and both fail.

To skip the installer and get a portable folder instead:

```bash
npx electron-builder --win --dir   # → dist/win-unpacked/Business OS.exe
```

## Pointing it somewhere else

Defaults to production. Override without rebuilding:

```bash
BUSINESS_OS_URL=http://localhost:3000/dashboard npm start
```

## Signing in

**Use email + password.** Google blocks OAuth inside embedded browser windows
(`disallowed_useragent`), which is what any desktop shell — Electron, Tauri, or
otherwise — has to use. This is Google policy, not a bug to fix here.

If the account was created with Google, add a password once from the web app:
**Settings → Password & security → Set password**. That same login then works in
the desktop app.

## What this is not

It needs the internet, and data lives in Supabase, exactly as on the web. A
genuinely offline app would mean a local database, a rewritten auth layer, and a
bundled server — a different product, not a packaging change.

## Unsigned builds

There is no code-signing certificate, so Windows SmartScreen will warn on first
run ("More info" → "Run anyway"). Ship a signed build to remove that.
