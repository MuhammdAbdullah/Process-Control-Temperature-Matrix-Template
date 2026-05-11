# Matrix TSL UI Design Rules

These rules govern the design and behavior of Matrix TSL user interfaces for hardware control systems. They prioritize safety, clarity, and operator confidence in industrial environments.

---

## 1. System State Must Be Visible at All Times

**Connection, mode, run state, safety status, and data logging state are always on screen.**

- No hidden state
- No inference required
- Critical system information is persistently visible

---

## 2. Never Allow an Action the Hardware Will Reject

**If the hardware cannot accept a command, the UI must not present it as available.**

- Disabled controls must show a visible reason
- Prevent invalid operations before they are attempted
- Match UI capabilities to actual hardware capabilities

---

## 3. One Control Does One Thing, Always

**No multi-mode buttons or controls that change meaning without a label change.**

- Each control has a single, consistent function
- Button labels must accurately reflect current behavior
- Avoid context-dependent control meanings

---

## 4. Separate Operation, Setup, and Calibration

**Normal operation must not expose setup or calibration controls.**

- Mode boundaries are explicit and visible
- Clear separation between operational and administrative functions
- Prevent accidental access to configuration during normal use

---

## 5. All Numeric Inputs Have Units, Bounds, and Resolution

**No unitless numbers or free-text engineering values.**

- Every numeric input must display its unit
- Input bounds (min/max) are clearly indicated
- Resolution/precision is explicit
- Invalid values are blocked before execution

---

## 6. No Hidden or Gesture-Based Critical Actions

**No shortcuts, right-clicks, scroll wheels, or long-presses for motion, power, or safety-related actions.**

- Critical actions require explicit, visible controls
- No hidden interactions for safety-critical functions
- All important actions are discoverable and intentional

---

## 7. Errors Must Be Actionable and Persistent

**Errors must communicate what failed, where, when, and what to do next.**

- Errors do not auto-clear
- Error messages provide specific, actionable guidance
- Error state persists until explicitly acknowledged or resolved

---

## 8. Control and Observation Are Visually Separated

**Controls and live data are not mixed in the same visual cluster.**

- Clear visual distinction between interactive controls and read-only data
- Accidental changes must be physically difficult to make
- Prevent confusion between monitoring and control functions

---

## 9. Loss of Communication Forces a Safe, Obvious UI State

**On disconnect, the UI must enter a safe, obvious state.**

- Controls disable immediately
- Last known values freeze (do not update)
- Operator is clearly informed of the disconnection
- No automatic retries without explicit operator consent

---

## 10. Every Run Must Be Reproducible

**Software version, hardware ID, parameters, and timestamps are captured automatically.**

- Complete run metadata is logged automatically
- If a run cannot be reconstructed from the logs, the UI is incomplete
- All parameters affecting system behavior are recorded