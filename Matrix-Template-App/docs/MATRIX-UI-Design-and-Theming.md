## Matrix TSL – UI / UX, Design System & Theming (Draft)

This document defines the visual language, layout patterns, and theming system for the Matrix TSL UI template. It explains how we use design tokens (colors, spacing, typography, etc.), CSS variables, Tailwind, and DaisyUI to build consistent, reusable components and layouts. The goal is to provide a simple, beginner-friendly way to create branded, themeable UIs that look and behave the same across all Matrix products, regardless of the backend or hosting environment.

### 1. Design Goals

- **Consistent look and feel** across all Matrix TSL products.
- **One reusable UI template** that future apps can start from.
- **Beginner-friendly implementation**:
  - Simple HTML structure.
  - Clear CSS design tokens.
  - Minimal JavaScript for theme switching.
- **Works the same** when the UI is running as a **web app / PWA**.

---

## 2. Theming Strategy (Design Tokens First)

### 2.1 Core Idea

- Use **design tokens**: small, named values that define the visual style:
  - Colors
  - Typography (fonts, sizes)
  - Spacing
  - Border radius
  - Shadows and borders
- Implement tokens in a **Tailwind + DaisyUI friendly way**:
  - **Phase 1 (current)**:
    - Use **Tailwind config** and **DaisyUI theme objects** as the main source of truth.
    - Avoid complex manual CSS variable wiring until needed.
  - **Phase 2 (optional)**:
    - Add a thin layer of **CSS variables** that map to the Tailwind/DaisyUI tokens when a project needs more advanced theming or interop with non-Tailwind code.

### 2.2 Example Token Categories

- **Color tokens**
  - `--color-bg-main`
  - `--color-bg-card`
  - `--color-text-main`
  - `--color-text-muted`
  - `--color-primary`
  - `--color-primary-hover`
  - `--color-accent`
  - `--color-border`
  - `--color-success`, `--color-warning`, `--color-danger`

- **Typography tokens**
  - `--font-family-main`
  - `--font-size-xs`, `--font-size-s`, `--font-size-m`, `--font-size-l`, `--font-size-xl`
  - `--line-height-normal`, `--line-height-relaxed`

- **Spacing tokens**
  - `--space-xs`, `--space-s`, `--space-m`, `--space-l`, `--space-xl`

- **Border and radius tokens**
  - `--radius-none`, `--radius-s`, `--radius-m`, `--radius-l`
  - `--border-width-thin`, `--border-width-normal`

- **Shadow / elevation tokens**
  - `--shadow-none`, `--shadow-soft`, `--shadow-strong`

These tokens live in one place so all products stay visually consistent.

---

## 3. Themes (Light, Dark, Matrix Brand, Per-Product)

### 3.1 Base Theme: Matrix Default

- Define a **base “Matrix Default” theme** that encodes:
  - Official Matrix TSL **brand colours**.
  - Standard spacing and typography.
  - Standard button and component look.
- This theme is used as the **starting point** for all apps.

### 3.2 Additional Themes

- **Light theme**
  - Focus on bright backgrounds, dark text, high readability.
- **Dark theme**
  - Dark backgrounds, light text, good contrast for low-light usage.
- **Per-product overrides**
  - Small changes on top of Matrix Default (for example):
    - Different accent color.
    - Different header background.
    - Special status colors for specific hardware.

### 3.3 How Themes Are Applied (CSS Classes)

- Each theme corresponds to a **class on the `<body>` element**, for example:
  - `theme-matrix-default`
  - `theme-light`
  - `theme-dark`
  - `theme-product-xyz`
- CSS then defines the token values under each class:
  - `body.theme-light { ... light token values ... }`
  - `body.theme-dark { ... dark token values ... }`

When the class changes, the token values change, and the whole UI updates.

---

## 4. Practical Token Implementation Choice

- **Standard approach for this template (recommended)**:
  - Use **DaisyUI themes** defined in the Tailwind configuration as our “design tokens”.
  - Each theme entry (e.g. `light`, `dark`, `matrix-default`) holds the colors, radii, etc.
  - Components use DaisyUI classes (e.g. `btn-primary`, `bg-base-200`, `text-primary`) which read from those tokens.
- **Optional CSS variable layer (when needed)**:
  - For apps that need to share tokens with non-Tailwind parts (e.g. embedded iframes, legacy CSS):
    - Define CSS custom properties (variables) that are set based on the active DaisyUI theme.
    - Keep this as an **extension**, not a requirement, so beginners are not forced to manage variables manually.
- **Decision**:
  - For the **template itself**, we standardise on:
    - **Tailwind config + DaisyUI themes** as the main token system.
  - For **product-specific apps**, teams may optionally add:
    - A CSS variables layer if their use case demands it.

---

## 4. Layout Structure (App Shell)

### 4.1 High-Level Layout

The basic **app shell** is the same for all Matrix apps:

- **Header**
  - App name or product name.
  - Optional subtitle or mode indicator (e.g. “Simulation”, “Live Device”).
  - Global actions (theme switcher, user/settings, help).

- **Sidebar**
  - Navigation: sections like Dashboard, Devices, Logs, Settings, About.
  - Icons + labels.

- **Main content**
  - The main working area for each section.
  - Contains components like cards, tables, charts, and forms.

- **Footer**
  - Simple branding (“Matrix TSL UI Template” or product name).
  - Optional status summary (e.g. “Connected to device”, “Offline mode”).

### 4.2 Layout Goals

- **Simple and predictable**:
  - Header always at top.
  - Sidebar always at left.
  - Main content fills the rest.
- **Responsive**:
  - On smaller screens, sidebar can collapse or become a top/bottom nav.
  - Main content reflows but keeps hierarchy clear.

---

## 5. Reusable UI Components

### 5.1 Buttons

- Standard variants:
  - Primary (`btn-primary`)
  - Secondary (`btn-secondary`)
  - Outline (`btn-outline`)
  - Ghost / subtle (`btn-ghost`)
  - Destructive (`btn-danger`)
- Behaviour:
  - Use design tokens for colors, borders, radius, and spacing.
  - Hover and active states use `--color-primary-hover` and related tokens.

### 5.2 Form Controls

- Inputs:
  - Text, number, password.
  - Select dropdowns.
  - Checkboxes and radio buttons.
  - Toggle switches.
- Goals:
  - Consistent spacing and label positioning.
  - Clear error and validation states using tokens (`--color-danger`, etc.).

### 5.3 Cards

- Simple **card component** for grouping content:
  - Optional header with title and actions.
  - Body for main content.
  - Footer for buttons or status text.
- Uses card-specific tokens:
  - Background: `--color-bg-card`
  - Border: `--color-border`
  - Radius: `--radius-m`
  - Shadow: `--shadow-soft`

### 5.4 Tables

- Basic data table styling:
  - Header row with clear labels.
  - Rows with alternating shading (striped) for readability.
  - Hover state for active row.
- Status styling in cells:
  - Badges or tags for statuses (OK, Warning, Error).

### 5.5 Tabs

- Simple **tab bar** for switching sections within a page:
  - Active tab highlighting using primary color.
  - Smooth and obvious selection changes.

### 5.6 Dialogs / Modals

- Overlay for important actions:
  - Confirm actions (e.g. “Reset device?”, “Apply configuration?”).
  - Show warnings and errors.
- Uses tokens for:
  - Background overlay.
  - Card background and border.
  - Buttons (primary and cancel).

---

## 6. Theme Switching Logic (High Level)

### 6.1 Basic Behaviour

- The user can pick a theme from:
  - A dropdown in the header.
  - A set of buttons or a simple toggle (for Light/Dark).
- When the theme changes:
  - The UI **updates the `<body>` class** (for example `theme-light` → `theme-dark`).
  - The browser stores the choice (for example in `localStorage`).
  - On next load, the app reads the stored theme and applies it.

### 6.2 Data Structure (Conceptual)

- A simple array or object listing the available themes:
  - Unique ID (e.g. `"matrix-default"`, `"light"`, `"dark"`).
  - Display name (e.g. `"Matrix Default"`, `"Light"`, `"Dark"`).
- The UI uses this list to:
  - Render the theme selector.
  - Know which CSS class to apply for each theme.

---

## 7. Adoption Phases (Beginner-Friendly Path)

### 7.1 Phase 1 – Simple Template UI

- Build a **basic layout** with:
  - Header, sidebar, main content, footer.
- Use:
  - **Vite + plain JavaScript**.
  - Tailwind CSS + DaisyUI for components.
- Add only:
  - One main theme (Matrix Default).
  - A very simple Light/Dark toggle if desired.

### 7.2 Phase 2 – Stronger Theming

- Introduce:
  - Full CSS variables for design tokens.
  - Multiple themes (Matrix Default, Light, Dark).
  - Theme selector with persistent choice (stored in the browser).

### 7.3 Phase 3 – Component Library Usage

- Use DaisyUI to:
  - Standardise buttons, forms, cards, tables.
  - Ensure all base components follow the design tokens.

### 7.4 Phase 4 – Per-Product Overrides

- For each new Matrix product:
  - Create a small **product theme override** file.
  - Change only:
    - Accent color.
    - Logo.
    - A few brand-specific tokens.
- Keep everything else (layout, components) **the same**.

---

## 8. Relationship to the Tech Stack

- The **design and theming system** in this template is:
  - Implemented as a **pure web UI** (HTML, CSS, JS with Vite/Tailwind/DaisyUI).
  - Independent of any specific backend or hardware layer.
- Within this template repository:
  - We assume a **browser / PWA environment only**.
  - There is **no backend, hardware-access, or native-desktop code**.
- For real products:
  - Engineers can use this UI template directly as a **web/PWA front end**.
  - Or they can integrate the built UI into their own projects with whatever backend or hosting environment they choose.
- This ensures:
  - **One visual language** for all Matrix TSL tools.
  - **Minimal changes per product** (mostly branding tokens and content).
  - Clear separation between **UI/UX template** and **product-specific logic**.

---

## 9. Library-First Design Methodology

- **Principle**: Prefer **libraries over custom code** so the template stays small, simple, and easy to understand.
- **CSS approach**:
  - Use **Tailwind CSS** utilities and **DaisyUI** components for almost all styling.
  - Keep custom CSS to a minimum, ideally just the Tailwind directives in `style.css`:
    - `@tailwind base;`
    - `@tailwind components;`
    - `@tailwind utilities;`
  - Define design tokens and themes through Tailwind/DaisyUI configuration instead of long custom CSS files.
- **JavaScript approach**:
  - Use **plain JavaScript** (or Svelte later) with simple, readable code.
  - Focus on:
    - Building the page layout (header, sidebar, main, footer) as HTML.
    - Wiring up **theme selection** and a few basic interactions.
  - Avoid complex patterns, heavy state management, or large custom frameworks in the template.
- **Example**:
  - The `matrix-tiny-ui` demo shows this methodology in practice:
    - Very short `style.css` that only imports Tailwind layers.
    - A small `main.js` that renders the UI and toggles between light/dark themes.
    - All visual styling and components provided by Tailwind + DaisyUI.
