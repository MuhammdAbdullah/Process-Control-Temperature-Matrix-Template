# Process Control Temperature App

> Desktop and web application for laboratory temperature process control — built by Matrix TSL.

**Version:** `0.1.5` &nbsp;|&nbsp; **Platform:** Windows (Electron) + Web (Express) &nbsp;|&nbsp; **License:** MIT

---

## Overview

This app connects to a hardware temperature controller over Serial or USB HID and provides:

- Real-time monitoring and control of heater temperature, power, and fan speed
- Three control modes: Manual, On/Off, and PID
- Live dual-canvas charting (temperature + power/PID output)
- Admin panel with logs, bootloader, and firmware update tools
- Runs as an Electron desktop app **or** a local Express web server for tablet access

---

## Screenshots

![Process Control Temperature Dashboard](assets/PID%20app%20image.png)

---

## Quick Start

```bash
npm install        # install dependencies
npm run web        # run as web server → http://localhost:3000
npm start          # run as Electron desktop app
```

> **Note:** There is a pre-existing `electron-updater` crash on `npm start`. Use `npm run web` to test UI changes in a browser.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm start` | Run Electron desktop app |
| `npm run dev` | Run Electron in developer mode |
| `npm run web` | Run as Express web server (port 3000) |
| `npm run web-dev` | Web server with nodemon auto-reload |
| `npm run build` | Build desktop app (default target) |
| `npm run build-win` | Build Windows NSIS installer |
| `npm run build-all` | Build for Windows, macOS, and Linux |
| `npm run rebuild-hid` | Rebuild `node-hid` native bindings |

---

## Features

### Control Modes

#### Manual Mode
- Set heater power (`0–100%`) and fan speed (`0–100%`) directly
- Preset quick-value buttons + slider controls

#### On/Off Mode
- Target temperature: `20–70 °C`
- Hysteresis: `1, 2, 3, 4, 5, 10 °C`
- Fan speed control
- Automatic heater on/off cycling around target ± hysteresis

#### PID Mode
- Target temperature: `20–70 °C`
- Configurable P, I, D gains
- Control type selector: `P`, `PI`, `PD`, `PID`
- Frequency setting
- Fan speed control
- PID component values streamed live from hardware

---

### Real-Time Charts

Built with [Chart.js](https://www.chartjs.org/) — dual canvas layout:

| Mode | Primary Canvas | Secondary Canvas |
|------|---------------|-----------------|
| Manual | Heater Temperature | Power % |
| On/Off | Temp, Target, Hysteresis bands | Power % |
| PID | Temp, Target | Output + active PID terms |

- Auto-pauses chart plotting after **20 minutes** of no user interaction (sensor readings and CSV logging continue uninterrupted)
- Resumes automatically on the next control change
- Print graph support

---

### Hardware Communication

#### Serial (COM Port)
- Auto port detection and manual selection
- Baud rates: `9600` to `115200`
- Connection status display and reconnect handling

#### USB HID
- `node-hid` native bindings
- VID/PID based device identification (`VID=0x12BF, PID=0x0113`)
- Bootloader communication support

#### Hardware JSON Protocol

Commands sent to hardware:

| Key | Value | Meaning |
|-----|-------|---------|
| `C` | `1 / 2 / 3` | Control mode: Manual / On/Off / PID |
| `P` | `0–100` | Heater power % |
| `F` | `0–100` | Fan speed % |
| `T` | `20–70` | Target temperature (°C) |
| `Y` | `1–10` | Hysteresis (On/Off mode, °C) |
| `PID_P / PID_I / PID_D` | numeric | PID gains |
| `H` | `0 / 1` | Heater off / on |

Incoming data arrives as two separate JSON messages per cycle:

1. **Main data**: `{"T": 25.5, "P": 45.2, "F": 50}` — temperature, power, fan
2. **PID data**: `{"Pr": 5.67, "It": 2.89, "Dr": 1.23, "Ot": 12.34}` — PID component values (PID mode only)

---

### Admin Panel

| Section | Features |
|---------|---------|
| Dashboard | Live system logs, raw HEX/ASCII data stream, runtime stats (uptime, packet rate), export |
| PID Controls | Direct PID value input and hardware send |
| Bootloader | Load HEX file, erase, program, verify, run full sequence, progress display |
| Updates | GitHub release check, current version display, download/install via `electron-updater` |

---

### Safety & Reliability

- **On connect:** hardware initialization sequence sent automatically
- **On close / mode switch:** safe shutdown sequence — sets `C=1, F=0, P=0, T=20, H=0`, PID gains = 0
- 40 ms minimum command write interval to avoid serial flooding

---

### Data Export

- CSV data export (mode-specific headers, started/stopped from UI)
- System log export
- Raw stream export

---

### Web / Tablet Mode

- `npm run web` serves `index.html` via Express on port 3000
- Accessible from any device on the local network
- PWA-ready (`manifest.json`) for tablet home-screen install
- Responsive layout for touch devices
- Falls back gracefully when Electron IPC is unavailable (uses Web Serial API where supported)

---

## Architecture

```
main.js  (Electron main process)
  ├── SerialPort / node-hid  →  hardware communication
  ├── ~30 IPC handlers        →  UI commands → hardware writes
  ├── electron-updater         →  GitHub release auto-updates
  └── preload.js               →  secure IPC bridge (context isolation)

renderer.js  (Electron renderer / browser, ~6100 lines)
  ├── Chart.js (dual canvas)   →  primary (temps) + secondary (power/PID)
  ├── UI state machine         →  control modes, form values, chart datasets
  └── inactivity logic         →  pauses chart after 20 min idle
```

Context isolation is enabled. `preload.js` exposes only a narrow `window.electronAPI` surface — `nodeIntegration` is disabled in the renderer.

---

## Key Files

| File | Purpose |
|------|---------|
| [main.js](main.js) | Hardware I/O, IPC handlers, safety sequences, bootloader |
| [preload.js](preload.js) | IPC bridge (context isolation) |
| [renderer.js](renderer.js) | All UI logic (~6100 lines): control modes, charting, CSV export |
| [layout.js](layout.js) | Clock, mode toggle, temperature display sync |
| [server.js](server.js) | Express server for web/tablet deployment |
| [admin.html](admin.html) | Admin panel: logs, raw data, bootloader, updates |
| [index.html](index.html) | Main app UI |
| [assets/css/matrix-ui.css](assets/css/matrix-ui.css) | DaisyUI + Tailwind UI styles |

---

## Tech Stack

| Package | Version |
|---------|---------|
| `electron` | `^38.2.2` |
| `electron-builder` | `^24.13.3` |
| `electron-updater` | `^6.6.2` |
| `chart.js` | `^4.4.4` |
| `express` | `^4.21.2` |
| `serialport` | `^12.0.0` |
| `node-hid` | `^3.1.1` |

---

## System Requirements

- **OS:** Windows 10 / 11 recommended (cross-platform build support exists)
- **Node.js:** 16+
- **Hardware:** Compatible temperature control unit (Serial or USB HID)

For native module builds on Windows you may also need:
- Python
- Visual Studio Build Tools

---

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **If `node-hid` has build errors on Windows, rebuild it:**
   ```bash
   npm run rebuild-hid
   ```

3. **Run in web mode (recommended for development):**
   ```bash
   npm run web
   ```
   Open `http://localhost:3000` in a browser.

4. **Run as Electron desktop app:**
   ```bash
   npm start
   ```

---

## Usage

1. Connect hardware via Serial COM port or USB HID
2. Select a control mode: **Manual**, **On/Off**, or **PID**
3. Set values (power, fan speed, target temperature, PID gains)
4. Monitor live chart data
5. Open the Admin Panel for logs, firmware updates, and bootloader tools
6. Export data to CSV when needed

---

## Change History

For full technical detail, see [CHANGELOG.md](CHANGELOG.md).

### v0.1.5 (current)
- Bump version to 0.1.5 and remove deleted `admin.html` from build file list
- Added **Back to Main App** button in admin tab bar for one-click return to main interface
- Sidebar automatically hides when navigating to the admin page and restores on exit
- PID default gains now fall back to `localStorage` values (`pid-default-P/I/D`) instead of compile-time constants; inputs pre-populated from saved defaults on startup
- Changing PID gains in admin panel now immediately syncs values to main app PID input fields (and vice versa on Restore to Default)
- Admin log system refactored: now uses persistent session history (`liveLogEntries`) stored in `localStorage` — logs survive page reload
- Session tracking added to admin: sessions start/end on serial connect/disconnect, logged with port label
- Scrollbar in admin log and raw data panels improved — wider (8 px) with higher-contrast thumb for better usability
- Filtered high-frequency noise from system log: `QL` heartbeat packets and chart data-update events no longer appear as log entries
- Removed redundant "Switched to X tab" log entries
- Removed "Clear Logs" and "Reset App" buttons from admin controls panel
- `window.switchToApp` exposed globally for cross-module navigation

### v0.1.4
- Admin panel moved inline into main window — no longer opens as a separate Electron window
- Added **Integral Windup** toggle control in PID mode (PI sub-type only)
- PID default gains now persist in `localStorage`; added **Restore to Default** button (`P=3.162, I=0.01, D=150`)
- Bootloader Connect button starts disabled; auto-enables and auto-connects USB HID after Trigger Bootloader succeeds
- Added `check-bootloader-device` IPC to poll for USB HID presence before connecting
- Erase-Program-Verify now shows live progress at each step (erase → program → verify)
- Bootloader flash batch inter-write delay reduced from 100 ms to 2 ms (significantly faster programming)
- Bootloader READ_CRC retries reduced to 3 with 2 s base delay (was 5 retries / 8 s)
- Chart reinitializes to Manual mode automatically on hardware reconnect
- Web server (`server.js`) sets `Cache-Control: no-store` on HTML responses to prevent stale UI after reload
- Removed verbose per-batch bootloader console logging; only milestone batches are logged

### v0.1.3
- Project cleanup: removed orphaned files (`chart.html`, `renderer-web.js`, backup HTMLs, `inject_slider_css.js`, `chart-page.js`)
- Removed unused vendored 3D libs from `assets/libs/` (Three.js, OCCT, GLTFLoader, OrbitControls — ~7.5 MB)
- Removed unused npm packages (`occt-import-js`, `three`, `jimp`, `to-ico`) — 70 packages pruned
- Fixed `package.json` build file list (removed 9 non-existent file references; added missing `layout.js`)

### v0.1.2
- UI migrated to DaisyUI + Tailwind CSS design system
- Improved layout for desktop and tablet
- Removed heavy 3D viewer from codebase

### v0.0.3 (February 4, 2026)
- Fixed chart shadow/fill rendering artifacts — clean line display
- Improved chart cleanup and re-initialization on mode switch
- Added stale-data skip after mode change
- Dataset count validation for each mode and PID sub-type
- Improved PID chart color visibility
- Fixed target temperature input — updates on Enter/blur, not while typing
- Fixed PID fan speed slider reference
- Added system online/offline indicator in Admin Panel

### Unreleased (December 2024 – February 2026)
- Two-message PID data reception (`Pr`, `It`, `Dr`, `Ot` as separate JSON)
- `lastPidValues` merge flow — combines PID and main data for chart updates
- Automatic safe init sequence on hardware connect
- Automatic safe shutdown sequence on app close
- Safe mode-switch sequence (fan off, heater off, safe target, power 0)
- Fixed critical missing X-axis labels (lines were disappearing)
- Fixed On/Off chart update routing
- 20-minute inactivity chart pause (sensor data and CSV logging unaffected)
- Restored near-instant mode switch speed

---

## License

MIT — © Matrix TSL
