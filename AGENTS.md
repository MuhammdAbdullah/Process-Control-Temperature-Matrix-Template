# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm start            # Run Electron desktop app (runs scripts/ensure-utf8.js first)
npm run dev          # Run Electron in dev mode
npm run web          # Run as Express web server (http://localhost:3000)
npm run web-dev      # Run web server with nodemon auto-reload
npm run build        # Build desktop app
npm run build-win    # Build Windows installer
npm run build-all    # Build all platforms (win/mac/linux)
npm run rebuild-hid  # Rebuild node-hid native bindings
```

No test suite exists. Minimum Node.js version: 16+.

> **Note**: There is a pre-existing electron-updater crash on `npm start`. Use `npm run web` to test UI changes in a browser.

## Architecture

This is an **Electron desktop app** (v0.1.8, Electron 38) for laboratory temperature process control. It also runs as an **Express web server** (`server.js`) for tablet access — both modes share the same `index.html`/`renderer.js` frontend.

### Process Boundary

```
main.js (Electron main process)
  ├── SerialPort / node-hid  →  hardware communication
  ├── ~30 IPC handlers        →  UI commands → hardware writes
  ├── Embedded Express server →  SSE + REST bridge for web browsers (see below)
  ├── electron-updater         →  GitHub release auto-updates
  └── preload.js               →  secure IPC bridge (context isolation)

renderer.js (Electron renderer / browser, ~6100 lines)
  ├── Chart.js (dual canvas)   →  primary (temps) + secondary (power/PID terms)
  ├── UI state machine         →  control modes, form values, chart datasets
  └── inactivity logic         →  pauses chart after 20 min idle (data still logged)
```

**Security**: Context isolation is enabled. `preload.js` exposes only a narrow `window.electronAPI` surface — never enable `nodeIntegration` in the renderer.

### Hardware JSON Protocol

Commands sent to hardware (via serial or USB HID):

| Key | Meaning |
|-----|---------|
| `{C: 1/2/3}` | Control mode: 1=Manual, 2=On/Off, 3=PID |
| `{P: 0-100}` | Heater power % |
| `{F: 0-100}` | Fan speed % |
| `{T: temp}` | Target temperature (°C, 20–70) |
| `{Y: val}` | Hysteresis (On/Off mode, 1–10°C) |
| `{PID_P/I/D: val}` | PID gains |
| `{H: 0/1}` | Heater off/on |

Incoming hardware data arrives as **two separate JSON messages per cycle**:
1. Main data: `{T, P, F}` — current temperature, power, fan speed
2. PID data: `{Pr, It, Dr, Ot}` — PID component values (only in PID mode)

The renderer stores the PID message in `lastPidValues` and combines it with the next main data message when adding a chart point. Command writes are throttled to a **40ms minimum interval** to avoid serial flooding.

### Control Modes

Each mode has its own Chart.js dataset configuration. Switching modes re-initializes the chart entirely — handle dataset index assumptions carefully.

| Mode | Primary Canvas | Secondary Canvas | Key inputs |
|------|---------------|-----------------|-----------|
| Manual | Temperature | Power | Power %, Fan % |
| On/Off | Temp, Target, Hysteresis | Power | Target temp, Hysteresis |
| PID | Temp, Target | Output + active PID terms (1–4 datasets) | Target, P/I/D gains, control type |

PID mode has four sub-types (P / PI / PD / PID) that change the secondary canvas dataset count. Always use `currentChartControlType` to determine active datasets in PID mode.

### Key Files

- [main.js](main.js) — hardware I/O, IPC handlers, safety sequences, bootloader
- [preload.js](preload.js) — IPC bridge definitions
- [renderer.js](renderer.js) — all UI logic (~6100 lines); control mode state, chart management, CSV export
- [renderer-hardware.js](renderer-hardware.js) — shared renderer for all non-temperature sensor pages; driven by `window.HARDWARE_CONFIG`
- [layout.js](layout.js) — clock, mode toggle, temperature display sync
- [server.js](server.js) — Express server for web/tablet deployment
- [admin.html](admin.html) + inline JS — live logs, raw data stream, bootloader (HEX upload/erase/verify/run), update check
- [splash.html](splash.html) — app loading/splash screen
- [assets/css/matrix-ui.css](assets/css/matrix-ui.css) — DaisyUI + Tailwind UI styles
- [assets/libs/](assets/libs/) — vendored Three.js, Chart.js, GLTFLoader, OrbitControls

### Multi-Sensor Pages

`index.html` handles temperature. Five additional pages cover other hardware sensor types, each using the same shared `renderer-hardware.js`:

| Page | Sensor type |
|------|-------------|
| [pressure.html](pressure.html) | Pressure |
| [flow.html](flow.html) | Flow |
| [level.html](level.html) | Level |
| [servo-speed.html](servo-speed.html) | Servo speed |
| [servo-angle.html](servo-angle.html) | Servo angle |

Each page defines `window.HARDWARE_CONFIG` before loading `renderer-hardware.js`. The config object drives unit labels, axis ranges, and any sensor-specific UI differences. `renderer-hardware.js` mirrors the same control-mode state machine, dual-canvas Chart.js setup, PID two-message protocol, 40ms command throttle, CSV export, and safety sequences as `renderer.js` — keep the two in sync when changing shared behaviour.

### renderer.js Navigation Guide

The file is monolithic. Key functions:

| Function | Purpose |
|----------|---------|
| `initChartForManual()` | Create 2-dataset chart for Manual mode |
| `initChartForOnOff()` | Create 4-dataset chart for On/Off mode |
| `initChartForPID(controlType)` | Create 2+N dataset chart for PID mode |
| `clearAllGraphs()` | Destroy both Chart.js instances, reset all chart state |
| `addPoint(valuesArray13, options)` | Core data insertion — validates mode, updates both canvases |
| `switchControlMode(mode)` | Master mode-switch: sends safety reset to hardware, reinits chart |
| `handleJsonData(jsonData)` | Parse `{T,P,F}` and `{Pr,It,Dr,Ot}` — merges two-message PID data |
| `setupDataListeners()` | Register all `window.electronAPI` event listeners |
| `startCsvSaving()` / `stopCsvSaving()` | CSV capture start/stop with mode-specific headers |
| `markUserControlActivity()` | Update inactivity timestamp; resume chart if paused |

**Key state variables:**

```js
currentControlMode          // 'manual' | 'onoff' | 'pid'
currentChartMode            // matches currentControlMode after chart init
currentChartControlType     // PID sub-type: 'P' | 'PI' | 'PD' | 'PID'
skipNextDataPoint           // true after mode switch — discards one stale hardware packet
lastPidValues               // stores {proportional, integral, derivative, output} from PID JSON message
onoffTargetTemp / onoffHysteresisValue
pidTargetTemp
chartJsRef                  // primary Chart.js instance
window.liveChartRef         // secondary Chart.js instance
isChartPausedForInactivity  // true after 20 min idle
```

### IPC API Surface (preload.js → main.js)

**Renderer invokes** (bidirectional, return values):
```
get-available-ports, connect-to-port, disconnect-from-port
send-fan-speed, send-power, send-control-mode, send-hysteresis
send-heater-temp, send-pid-value, send-pid-frequency, send-custom-json
start-auto-tune, send-bootloader
connect-to-bootloader-usb (VID=0x12BF, PID=0x0113)
bootloader-read-info, bootloader-erase-flash, bootloader-program-flash
bootloader-read-crc, bootloader-jump-to-app, bootloader-erase-program-verify
load-hex-file, upload-hex-file
show-open-dialog, show-save-dialog, write-file
open-admin-panel, check-for-updates, get-app-version
```

**Main pushes to renderer** (one-way events):
```
data-received, data-chunk, json-data-received
connection-status, ports-update
serial-tx-debug, ui-debug-log
update-status, auto-tune-progress
bootloader-progress, hex-upload-progress
```

If `window.electronAPI` is unavailable (web mode), renderer falls back to no-op stubs and optionally uses the Web Serial API.

### Startup / Shutdown Safety

On serial/USB connect: `main.js` sends an initialization sequence automatically.  
On app close or mode switch: a shutdown sequence is sent — sets C=1, F=0, P=0, T=20, H=0, PID gains=0.  
Do not skip these sequences when modifying connection/disconnect or mode-switch logic.

### Dual-Mode Deployment

There are **two independent web server implementations** — do not confuse them:

- **`server.js`** — standalone Express server (`npm run web`). Has its own `SerialPort` instance, auto-connects to the target device (`VID=0x12BF, PID=0x0113`) on startup, and serves `index.html` directly. No shared state with Electron.
- **Embedded server in `main.js`** — runs alongside the Electron window to mirror hardware state to tablet browsers via QR code. Uses SSE at `/api/events` and a `sharedState` object as the single source of truth; calls `broadcastSSE('state-update', sharedState)` whenever hardware data arrives.

Embedded server REST endpoints (inside `main.js`):
```
GET  /api/state        →  returns sharedState + connection info
GET  /api/ports        →  lists available serial ports
GET  /api/server-info  →  returns network IPs + QR code as Data URL
POST /api/connect      →  connect to serial port from web
POST /api/disconnect   →  disconnect from web
POST /api/command      →  send JSON command from web
GET  /api/events       →  SSE stream (connection-status, state-update)
```

IPC calls are unavailable in web mode — any new hardware communication features added via IPC must have a graceful fallback or be gated on `window.electronAPI` availability.

### Hardware Keepalive

When connected, both `main.js` and `server.js` send a heartbeat poll to the hardware every **900ms** to detect disconnects. `main.js` tracks consecutive heartbeat failures and triggers a disconnect/reconnect sequence after threshold. Do not remove or bypass the heartbeat when editing connection logic.

### renderer.js Additional State

```js
localStorage['temp-unit']   // 'C' | 'F' — persists temperature unit preference
pendingPowerValue            // debounce buffer — echoed slider values, not yet confirmed
pendingFanValue              // same for fan
```

### Build & Release

GitHub Actions (`.github/workflows/release.yml`) triggers on `v*.*.*` tags, uses Node 20, runs `npm run build-win` only, and uploads the `.exe`, `.exe.blockmap`, and `latest.yml` to a GitHub Release. The published repo is `MuhammdAbdullah/Process-Control-Temperature-Matrix-Template`.

`scripts/ensure-utf8.js` runs automatically before `npm start` (`prestart` hook) — it walks all `.html`/`.js`/`.css`/`.json` files and converts any UTF-16 files to UTF-8. This guards against PowerShell's default UTF-16 encoding corrupting source files on Windows.
