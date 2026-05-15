/* layout.js — clock, mode-toggle sync, temp display bridge */

(function () {
    // ── Digital Clock ──────────────────────────────────────────
    const clockEl = document.getElementById('digitalClock');

    function tickClock() {
        if (!clockEl) return;
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss}`;
    }

    tickClock();
    setInterval(tickClock, 1000);

    // ── Mode Toggle → hidden select sync ──────────────────────
    const modeSelect  = document.getElementById('controlModeSelect');
    const modeBtns    = document.querySelectorAll('.mode-btn');
    const modePanels  = {
        manual: document.getElementById('manualControlMode'),
        onoff:  document.getElementById('onoffControlMode'),
        pid:    document.getElementById('pidControlMode'),
    };

    function activateMode(mode) {
        modeBtns.forEach(b => {
            const isActive = b.dataset.mode === mode;
            b.classList.toggle('btn-active', isActive);
            b.classList.toggle('btn-primary', isActive);
        });

        Object.entries(modePanels).forEach(([key, panel]) => {
            if (!panel) return;
            panel.style.display = key === mode ? 'flex' : 'none';
        });

        if (modeSelect && modeSelect.value !== mode) {
            modeSelect.value = mode;
            modeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        updateSetPoint();
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => activateMode(btn.dataset.mode));
    });

    // If renderer.js changes the select externally, reflect it in the toggle
    if (modeSelect) {
        modeSelect.addEventListener('change', () => {
            const mode = modeSelect.value;
            modeBtns.forEach(b => {
                const isActive = b.dataset.mode === mode;
                b.classList.toggle('btn-active', isActive);
                b.classList.toggle('btn-primary', isActive);
            });
        });
    }

    // ── Set Point display ─────────────────────────────────────
    const setPointEl = document.getElementById('setPointBig');

    const targetSliders = {
        manual: null,
        onoff:  document.getElementById('onoffTargetSlider'),
        pid:    document.getElementById('pidTargetSlider'),
    };

    function updateSetPoint() {
        if (!setPointEl) return;
        const mode = modeSelect ? modeSelect.value : 'manual';
        const unit = (typeof currentTempUnit !== 'undefined' && currentTempUnit === 'F') ? '°F' : '°C';

        if (mode === 'manual') {
            setPointEl.textContent = '-- ' + unit;
            return;
        }

        const slider = targetSliders[mode];
        if (slider) {
            setPointEl.textContent = `${slider.value} ${unit}`;
        }
    }

    Object.values(targetSliders).forEach(s => {
        if (s) s.addEventListener('input', updateSetPoint);
    });

    updateSetPoint();


    // ── System status pill class sync ─────────────────────────
    const origIndicator = document.getElementById('systemStatusIndicator');

    if (origIndicator) {
        const observer = new MutationObserver(() => {
            const isOnline = origIndicator.classList.contains('online');
            origIndicator.textContent = isOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE';
        });
        observer.observe(origIndicator, { attributes: true, attributeFilter: ['class'] });
    }

    // ── Chart.js global defaults for responsive fill ──────────
    if (window.Chart) {
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.Chart) {
                Chart.defaults.responsive = true;
                Chart.defaults.maintainAspectRatio = false;
            }
        });
    }

})();
