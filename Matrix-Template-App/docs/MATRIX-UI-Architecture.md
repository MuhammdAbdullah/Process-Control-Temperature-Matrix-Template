## Matrix TSL – UI Architecture & Tech Stack (Draft)

This document describes the high-level architecture and technology choices for the Matrix TSL UI template. It focuses on a pure web/PWA frontend (HTML, CSS, JavaScript with optional Svelte and Vite) that provides a consistent layout, component set, and theming system for all Matrix products. The template is backend-agnostic and does not include any hardware, native desktop, or server code, so engineers can plug it into their own projects and hosting environments as needed.

### 1. High-Level Goal

- **One UI codebase** that:
  - Runs as a **web app / PWA** in a browser, tablet, or touchscreen.
- **Consistent look and feel** across all Matrix TSL products.
- **Beginner-friendly implementation**: simple patterns, clear structure.

---

## 2. Core Scope: UI Template Only

### 2.1 Primary Answer (Template Scope)

- The **Matrix UI Template is a pure web UI / PWA template**:
  - It contains **only frontend code**: HTML, CSS, JavaScript (and optionally Svelte + Vite).
  - It defines the **layout, components, theming, and UX patterns**.
- Result:
  - The template stays **simple and reusable** for any project (web or desktop).
  - Engineers are free to:
    - Use it as a **web app / PWA only**, or
    - Integrate it into any other backend or shell when needed.

---

### 2.2 Web UI Template

Within this template repository:

- We assume **web-only / PWA context**:
  - Standard browser capabilities:
    - HTTP/HTTPS to remote servers or devices.
    - WebSockets to remote services.
    - Local simulation data (no special hardware).
  - Optional offline support using:
    - **Service Worker** (for caching).
    - **IndexedDB** (for simulation data), all in the browser.
- The template stack is:
  - **Frontend / UI**:
    - Vite (build tool)
    - Svelte *or* plain JavaScript
    - Tailwind CSS
    - DaisyUI (components + themes)
  - **Backend (if any during development)**:
    - Optional mock or remote Node.js/Express/Fastify server.
  - **Delivery**:
    - Web app + PWA features (installable, offline where possible).

The template does **not** include any backend, hardware, or native integration code. It focuses purely on the **frontend UI/UX**.

---

## 3. Agreed Tech Stack (Simplified View)

### 3.1 UI / Frontend

- **Build tool**: Vite
- **Framework**:
  - Start with **plain JavaScript + Vite**, or
  - Move to **Svelte + Vite** when comfortable.
- **Styling**:
  - Tailwind CSS
  - DaisyUI for themed components
- **Language**:
  - Start with **JavaScript**
  - Introduce **TypeScript gradually** later (for types and safety).

### 3.2 Backend / Hardware Layer

- **Out of scope for this template**:
  - Hardware access (USB, Serial, PLCs, cameras, etc.).
  - Local Node.js servers or native desktop hosting.
- **Assumption**:
  - The UI will communicate with **some backend API** (local or remote) over HTTP/WebSockets, but the implementation of that backend is **not part of this template**.

### 3.3 PWA / Offline

- **PWA features**:
  - App manifest (name, icons).
  - Service Worker for caching static assets.
  - IndexedDB for local/simulation data.
- **Adoption plan**:
  - Add PWA and offline **after** the basic UI is stable.

---

## 4. Implementation Style: Library-First, Tiny Custom Code

- **Goal**: Keep the amount of custom code (especially CSS) as small and simple as possible.
- **Approach**:
  - Use **Tailwind CSS and DaisyUI** for almost all of the visual design and components.
  - Let Tailwind + DaisyUI handle:
    - Layout utilities (spacing, flex, grid).
    - Colors, typography, and themes.
    - Buttons, cards, badges, inputs, navbars, etc.
  - Keep our own files very small:
    - `style.css` should mainly contain the three Tailwind directives:
      - `@tailwind base;`
      - `@tailwind components;`
      - `@tailwind utilities;`
    - `main.js` (or equivalent) should:
      - Render a simple HTML structure (header, main, footer, cards, etc.).
      - Handle basic behaviour like **theme switching** and simple UI interactions.
      - Avoid complex state management or patterns unless really needed.
- **Example**:
  - The `matrix-tiny-ui` demo app in this repo shows this method:
    - Very small `style.css`.
    - A single `main.js` that builds the layout and a light/dark theme toggle.
    - All styling and components come from Tailwind + DaisyUI.

---

## 5. Routing & Navigation Strategy

- **Phase 1 (current)**:
  - Very simple navigation:
    - Sidebar links have `data-page` attributes.
    - A small function swaps the content of a single `<main>` element based on the key.
  - No URL changes, no browser history integration.
  - Good for:
    - Demos
    - Small apps
    - Beginner-friendly code
- **Limitations**:
  - No deep linking (you cannot bookmark a specific page).
  - Back/forward browser buttons will not change the visible page.
- **Phase 2 (planned migration path)**:
  - Introduce a tiny router library (for example `page.js` or `navigo`) when:
    - We need deep links for specific templates (e.g. `/home/1`, `/admin/2`).
    - We want proper browser history and back/forward support.
  - Keep the same template functions, but:
    - Register routes that call the existing `renderPage(key)` function.
    - Optionally map routes to data (e.g. `/devices/:id` → render device detail).

This keeps routing simple today, while documenting a clear upgrade path.

---

## 6. Theming & Design System (High-Level)

- **Goal**: Central theme system reusable across all products.
- **Tools**:
  - Tailwind configuration for design tokens:
    - Colors, spacing, border radius, typography.
  - DaisyUI themes configured to match Matrix TSL branding.
- **Rules**:
  - One base “Matrix Default” theme.
  - Optional **light**, **dark**, and **product-specific** overrides.
  - All components use these tokens, not hard-coded colors.

---

## 7. State & Data Flow (Planned)

- **Phase 1 (current)**:
  - All data in the templates is **static** (hard-coded).
  - Good for:
    - Visual design
    - Prototyping layouts and components
- **Phase 2 (simple data model)**:
  - Introduce a plain JavaScript “data” module (for example `data/mockData.js`) that:
    - Exports objects/arrays for devices, logs, tasks, etc.
    - Is imported by template functions which “render” that data.
  - Keep the pattern simple:
    - Functions receive data as parameters (like “props” in React).
    - Higher-level code chooses what data to pass (e.g. filtered lists).
- **Phase 3 (real backend)**:
  - Replace the mock data module with:
    - API calls to a backend (HTTP/REST or WebSockets).
    - A very small state layer (for example a single `appState` object or a simple store).
  - The templates should not know **where** data comes from, only **what shape** it has.

The goal is to keep state management very simple and explicit, so engineers can plug in their own backend logic later without rewriting the UI.

---

## 8. Summary of the Electron Decision

- The **Matrix UI Template** is a **web-only / PWA UI template**:
  - It ships with **no Electron or hardware code**.
  - It focuses purely on **UI/UX, layout, components, and theming**.
- **Electron/Node** is:
  - Added **later, per product**, by engineers who need hardware or desktop features.
  - Used as a **local backend** and optional **wrapper** around this UI.
- This gives:
  - **One shared UI template** for all products.
  - Flexibility to ship:
    - **Pure web/PWA apps** where hardware is not needed.
    - **Electron-based apps** where direct hardware access is required.



