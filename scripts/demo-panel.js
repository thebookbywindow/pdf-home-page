/**
 * Demo controls panel — hide/show for clean presentations.
 * Toggle: floating button or Ctrl+Shift+D
 */
(function (global) {
  const STORAGE_KEY = "wps_demo_panel_hidden";

  function isHidden() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "1";
  }

  function setHidden(hidden) {
    sessionStorage.setItem(STORAGE_KEY, hidden ? "1" : "0");
    apply();
  }

  function apply() {
    const panel = document.querySelector(".demo-panel");
    const toggle = document.querySelector(".demo-panel-toggle");
    const hidden = isHidden();
    if (panel) {
      panel.classList.toggle("is-hidden", hidden);
      panel.setAttribute("aria-hidden", hidden ? "true" : "false");
    }
    if (toggle) {
      toggle.hidden = !hidden;
      toggle.setAttribute("aria-label", hidden ? "Show demo controls" : "Hide demo controls");
    }
  }

  function init() {
    const panel = document.querySelector(".demo-panel");
    if (!panel) return;

    let toggle = document.querySelector(".demo-panel-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "demo-panel-toggle";
      toggle.innerHTML = '<span class="material-symbols-rounded" aria-hidden="true">tune</span>';
      toggle.title = "Show demo controls (Ctrl+Shift+D)";
      document.body.appendChild(toggle);
    }

    let hideBtn = panel.querySelector("[data-demo-hide]");
    if (!hideBtn) {
      hideBtn = document.createElement("button");
      hideBtn.type = "button";
      hideBtn.className = "btn-ghost demo-panel-hide";
      hideBtn.dataset.demoHide = "";
      hideBtn.textContent = "Hide panel";
      panel.appendChild(hideBtn);
    }

    hideBtn.addEventListener("click", () => setHidden(true));
    toggle.addEventListener("click", () => setHidden(false));

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setHidden(!isHidden());
      }
    });

    apply();
  }

  global.WPSDemoPanel = { init, setHidden, isHidden };
})(typeof window !== "undefined" ? window : globalThis);
