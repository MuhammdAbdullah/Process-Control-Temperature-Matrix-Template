# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Start Electron desktop app
npm start

# Development mode (Electron with dev flags)
npm run dev

# Start Express web server (tablet/PWA mode, port 3000)
npm run web

# Web server with auto-reload
npm run web-dev

# Build Windows installer
npm run build-win

# Build all platforms
npm run build-all

# Rebuild native module (node-hid) after dependency changes
npm run rebuild-hid
```

There is no test suite. There is no linter configured.

## Architecture

This is a **hybrid Electron/Web app** for temperature process control hardware. It has two deployment modes: a Windows Electron desktop app and an Express web server for PWA use on Android tablets.

### Process Structure (Electron mode)

- **[main.js](main.js)** (~3,500 lines) — Electron main process. Owns all hardware communication (serial port via `serialport`, USB HID via `node-hid`), window lifecycle, auto-updater (`electron-updater` via GitHub releases), and IPC hub for renderer communication.
- **[preload.js](preload.js)** — Context bridge exposing a safe `window.electronAPI` surface to the renderer (serial methods, PID functions, bootloader ops, file dialogs, Chart.js).
- **[renderer.js](renderer.js)** (~6,500 lines) — All UI logic: control mode state machine, Chart.js chart management, CSV export, event handlers.
- **[server.js](server.js)** — Express server serving the same HTML/JS/CSS for web mode with mock REST API endpoints.

### Pages

- `index.html` — Main control dashboard
- `admin.html` — System logs, raw data stream, PID tuning tools, firmware bootloader, update checker
- `chart.html` / `chart-page.js` — Standalone chart view
- `splash.html` — Splash screen shown on startup
- `lab1-5.html`, `curriculum.html`, `simulation.html` — Educational lab pages

### Hardware Communication Protocol

JSON packets over serial/USB HID:
```json
{"T": 25.5, "P": 45, "F": 50, "C": 1}
```
Fields: `T` = temperature, `P` = power, `F` = fan speed, `C` = control mode.

The main process handles auto-detection, heartbeat monitoring, connection health, safe shutdown sequences (sent on app close or mode switch), and bootloader handshake for firmware updates.

### Control Modes

Three modes managed in `renderer.js`, with hardware commands sent via IPC to `main.js`:
- **Manual** — Direct power (0–100%) and fan (0–100%) control
- **On/Off** — Temperature target with hysteresis band
- **PID** — Proportional-Integral-Derivative control with tunable P, I, D parameters

Temperature range is validated to 20–70°C.

### Chart System

Chart.js 4.x with dual Y-axes (temperature + power/output). Charts auto-pause after 20 minutes of inactivity and resume on user interaction. Data can be exported as CSV mid-session.

### Auto-Updater

Uses `electron-updater` publishing to GitHub releases under the `Process-Control-App` repo. Update checks are triggered from the Admin panel.

### Build Output

`electron-builder` produces a Windows NSIS installer in `dist/`. App ID: `com.processcontrol.temperature-app`. Native modules (`node-hid`) must be rebuilt for the target Electron version after any dependency changes (`npm run rebuild-hid`).
