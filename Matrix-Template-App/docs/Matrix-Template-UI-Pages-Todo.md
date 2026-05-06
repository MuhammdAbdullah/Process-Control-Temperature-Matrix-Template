## Matrix Template UI – Pages & Features Todo

This document is a high-level todo list for all the pages and major UI pieces we want in the Matrix UI template. It focuses on **vanilla JS + Vite + Tailwind + DaisyUI + Chart.js**, with minimal custom code and a library-first approach.

---

### 0. HMI (Human-Machine Interface) Templates ⭐ **NEW**

**Professional industrial control interfaces** for Matrix TSL products (wind tunnels, process control, smart factories, heat exchangers, etc.)

- [x] **HMI Dashboard – Comprehensive Control Interface** ✅
  - [x] Real-time temperature trend chart with setpoint overlay
  - [x] System performance monitoring (CPU, Memory, I/O, Network, Disk)
  - [x] Large Start/Stop/Emergency Stop controls
  - [x] Operation mode selector (Auto/Manual/Test)
  - [x] Temperature setpoint slider with live feedback
  - [x] Fan speed/motor control slider
  - [x] Radial progress gauges for system load
  - [x] Active alarms display with severity indicators
  - [x] Process flow visualization diagram
  - [x] Animated status indicators (pulsing, glowing effects)
  - [x] High information density layout

**Technical Stack Added:**
- [x] Chart.js 4.5.1 installed for data visualization
- [x] Line charts, bar charts support
- [x] Chart cleanup on page navigation
- [x] Responsive chart sizing

**Future HMI Enhancements:**
- [ ] Real-time data updates (WebSocket simulation)
- [ ] Additional chart types (gauge charts, 3D visualizations)
- [ ] Multi-zone control panels
- [ ] Video feed placeholders
- [ ] Custom Matrix TSL branding layer
- [ ] Touchscreen-optimized controls

---

### 1. App Shell & Navigation

- [ ] **App shell layout**
  - [ ] Top navbar (title, product name placeholder, theme switcher, help)
  - [ ] Left sidebar navigation (Dashboard, Devices, Logs, Settings, About)
  - [ ] Responsive behaviour (sidebar collapse on small screens)
  - [ ] Footer (Matrix TSL branding + status summary)

- [ ] **Routing structure (simple)**
  - [ ] Decide between: hash-based navigation or simple “single page with sections”
  - [ ] Implement basic navigation highlight (which page is “active”)

---

### 2. Home Templates (Dashboard Variants)

We want multiple “home” screen templates (Home Template 1, 2, 3) that different Matrix products can choose from. All share the same building blocks (cards, tables, forms), but arrange them differently.

- [ ] **Home Template 1 – Simple dashboard**
  - [ ] Overview cards (System status, Active devices, Alerts)
  - [ ] Small devices table (summary list)
  - [ ] Quick actions panel (buttons for common tasks)
  - [ ] Layout: simple grid that works well on desktop and tablet

- [ ] **Home Template 2 – Data-focused**
  - [ ] Larger main table (devices or records)
  - [ ] Side panel with recent events (timeline or list)
  - [ ] Compact stats row (small cards at top)
  - [ ] Layout: main table + side column

- [ ] **Home Template 3 – Card-focused**
  - [ ] Many smaller cards (status per device / per module)
  - [ ] Minimal table (only key rows)
  - [ ] Highlighted “primary action” area (big button / call to action)
  - [ ] Layout: multi-row card grid

---

### 3. Admin Panel Templates

We also want multiple admin-style layouts (Admin Panel 1, 2, 3) that can be reused across products.

- [ ] **Admin Panel 1 – Simple table + detail**
  - [ ] Full table of items (e.g. devices or users)
  - [ ] Row actions (edit, delete, configure)
  - [ ] Side or bottom detail panel showing selected item info
  - [ ] Basic filters (status dropdown, search box)

- [ ] **Admin Panel 2 – Master/detail with tabs**
  - [ ] Left list/table of items
  - [ ] Right detail view with tabs (Overview / Settings / Logs)
  - [ ] Action buttons (enable/disable, reset, apply config)
  - [ ] Confirmation modal for destructive actions

- [ ] **Admin Panel 3 – Settings-driven**
  - [ ] Multi-section settings form (cards or accordions)
  - [ ] Save/apply buttons with success/error placeholders
  - [ ] Optional “preview” panel that shows a summary of current settings

---

### 4. Logs / Events Page

- [ ] **Logs table**
  - [ ] Table with timestamp, source, level (info/warn/error), message
  - [ ] Color-coded badges for log level

- [ ] **Filters and search**
  - [ ] Simple filter controls (date range, level dropdown)
  - [ ] Text search box (UI only; dummy behaviour)

- [ ] **Layout**
  - [ ] Main logs area + small side card for “Log statistics” (counts per level)

---

### 5. Settings Page

- [ ] **General settings**
  - [ ] App/theme options (Light/Dark, maybe Matrix theme variants)
  - [ ] Language placeholder (if needed later)

- [ ] **Connection / backend settings**
  - [ ] Inputs for API base URL or connection mode (Local / Remote / Simulated)
  - [ ] Example save/apply button with success/error toast placeholders

- [ ] **Layout**
  - [ ] Simple two-column layout for groups of settings (cards or sections)

---

### 6. About / Help Page

- [ ] **About app**
  - [ ] App name, version placeholder, brief description
  - [ ] Links or placeholders for documentation, support

- [ ] **Matrix TSL branding**
  - [ ] Logo placeholder and brand text
  - [ ] Credits / license placeholders

- [ ] **Change log / release notes (optional)**
  - [ ] Simple list or timeline of changes (example only)

---

### 7. Component Gallery Page

- [ ] **Buttons & badges**
  - [ ] Show primary/secondary/outline/ghost buttons
  - [ ] Show status badges (success, warning, error, info)

- [ ] **Forms**
  - [ ] Inputs, selects, checkboxes, radios, toggles
  - [ ] Validation state examples (success/error)

- [ ] **Layout & navigation components**
  - [ ] Cards, tabs, accordions, breadcrumbs
  - [ ] Steppers or progress indicators (if useful)

- [ ] **Feedback components**
  - [ ] Alerts, modals, toasts (UI placeholders only)

This page acts as a **reference** for engineers so they can see all the building blocks available in the template.

---

### 8. Control Page Templates

Many Matrix apps will have a “Control” view where the user can start/stop processes, change modes, and see live status.

- [ ] **Control Template 1 – Simple controls**
  - [ ] Large primary control buttons (Start, Stop, Pause)
  - [ ] Mode selector (e.g. Auto / Manual)
  - [ ] Key status indicators (current state, timer, progress)

- [ ] **Control Template 2 – Panel layout**
  - [ ] Left side: control buttons and mode settings
  - [ ] Right side: live values (gauges, numeric readouts, status badges)
  - [ ] Optional log of recent control actions

- [ ] **Control Template 3 – Grouped controls**
  - [ ] Multiple groups of controls (e.g. Zone A, Zone B, Zone C)
  - [ ] Each group has its own start/stop and status
  - [ ] Clear indication of overall system state

---

### 9. I/O / Signals Page Templates

This is for viewing and (optionally) toggling signals, channels, or I/O lines.

- [ ] **I/O Template 1 – Simple list**
  - [ ] Table of signals (name, type, state, value)
  - [ ] Status badges for On/Off, High/Low, etc.
  - [ ] Basic filter by type (Input, Output, Analog, Digital)

- [ ] **I/O Template 2 – Grouped by function**
  - [ ] Sections for Inputs, Outputs, Analog signals, etc.
  - [ ] Collapsible groups (accordion style)
  - [ ] Optional control widget for writable outputs (toggle or button)

- [ ] **I/O Template 3 – Compact matrix**
  - [ ] Grid view (channels along one axis, states/values on another)
  - [ ] Color-coding for quick visual scanning

---

### 10. Faults / Status Page Templates

Apps will need a clear place to show faults, warnings, and general status.

- [ ] **Faults Template 1 – Fault list**
  - [ ] Table of active faults (time, source, severity, description)
  - [ ] Filters for severity (Info/Warning/Error)
  - [ ] Simple actions (Acknowledge, Clear simulated)

- [ ] **Faults Template 2 – Timeline**
  - [ ] Timeline or list of recent events with icons for severity
  - [ ] Grouped by day or session
  - [ ] Summary cards for “Active faults” and “Last cleared”

- [ ] **Status overview**
  - [ ] High-level cards showing overall system health, connection status, and last update time

---

### 11. Tasks / Worksheets Page Templates

This is for step-by-step tasks, lab worksheets, or guided procedures.

- [ ] **Tasks Template 1 – Simple list**
  - [ ] List of tasks with checkboxes (e.g. “Step 1, Step 2, Step 3”)
  - [ ] Progress indicator (X of Y steps completed)
  - [ ] Basic task details panel

- [ ] **Tasks Template 2 – Worksheet layout**
  - [ ] Multi-section worksheet (cards or accordions for each section)
  - [ ] Inputs for answers/measurements (text fields, numbers, dropdowns)
  - [ ] Save/export placeholder (e.g. “Download as PDF” button stub)

- [ ] **Tasks Template 3 – Guided flow**
  - [ ] Stepper component (Next/Back)
  - [ ] Each step shows controls, instructions, and fields to fill
  - [ ] Summary step showing entered information

---

### 12. Theming & Tokens Hook-up

- [ ] **Central theme configuration**
  - [ ] Tailwind + DaisyUI theme configuration (design tokens for colors, spacing, radius, etc.)

- [ ] **Theme switcher**
  - [ ] Make sure all pages respect the chosen theme (Light/Dark/Matrix)
  - [ ] Store theme in `localStorage` and apply on load

---

### 13. PWA & Offline (Later)

- [ ] **PWA basics**
  - [ ] `manifest.json` with app name, icons, colors
  - [ ] Register service worker

- [ ] **Offline behaviour (minimal)**
  - [ ] Cache static assets so the UI loads without internet
  - [ ] Show a simple “offline” indicator when backend is unreachable (UI only)


