/**
 * Quota intercept modals for tool inner pages.
 * Quota exhausted | Pro+ upgrade (size) | Multi-file limit | Member 200 MB.
 */
(function (global) {
  const BUY_CTA = "Upgrade to Pro+";
  const BUY_URL = "https://www.wps.com/buy/";

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function links() {
    return global.WPSLinks;
  }

  function goBuy(backdrop) {
    if (links()?.openPremium) links().openPremium();
    else window.open(BUY_URL, "_blank", "noopener");
    global.WPSQuotaFlow?.upgradePremium();
    if (backdrop) {
      backdrop.hidden = true;
      backdrop.dispatchEvent(new CustomEvent("quota-upgraded"));
    }
  }

  function quotaTableHTML(data) {
    const rows = (data.table || []).map((row) =>
      `<tr><th scope="row">${escapeHtml(row.label)}</th><td>${escapeHtml(row.guest)}</td><td>${escapeHtml(row.member)}</td></tr>`
    ).join("");
    return `
      <table class="quota-tooltip-table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Free</th>
            <th scope="col">WPS Pro+</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderQuotaTooltipHTML(data) {
    return `
      <div class="quota-tooltip-head">
        <div class="quota-tooltip-head-text">
          <strong>${escapeHtml(data.title)}</strong>
          <span>${escapeHtml(data.subtitle)}</span>
        </div>
        <button type="button" class="quota-tooltip-upgrade" data-quota-upgrade>
          ${BUY_CTA}
        </button>
      </div>
      ${quotaTableHTML(data)}`;
  }

  function wireQuotaTooltipActions(el) {
    if (!el || el.dataset.upgradeWired === "1") {
      // Re-bind after innerHTML refresh: always attach to current button
    }
    el.querySelectorAll("[data-quota-upgrade]").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goBuy(null);
        el.classList.remove("is-visible");
      });
    });
  }

  function bindModalClose(backdrop, closeFn) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest("[data-modal-close]")) closeFn();
    });
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape" && !backdrop.hidden) {
        closeFn();
        document.removeEventListener("keydown", onKey);
      }
    });
  }

  function wireBuyButtons(backdrop, selectors) {
    const close = () => { backdrop.hidden = true; };
    bindModalClose(backdrop, close);
    backdrop.querySelector(selectors.download)?.addEventListener("click", () => {
      links()?.openDownload("auto");
      close();
    });
    backdrop.querySelector(selectors.buy)?.addEventListener("click", () => {
      goBuy(backdrop);
    });
    return close;
  }

  function ensureQuotaExhaustedModal() {
    let backdrop = document.getElementById("quota-exhausted-modal");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.id = "quota-exhausted-modal";
    backdrop.className = "multifile-modal-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="multifile-modal" role="dialog" aria-modal="true" aria-labelledby="quota-exhausted-title">
        <button class="multifile-modal-close" type="button" data-modal-close aria-label="Close">
          <span class="material-symbols-rounded">close</span>
        </button>
        <div class="multifile-modal-art" aria-hidden="true">
          <div class="art-window">
            <span class="art-tile"></span><span class="art-tile"></span><span class="art-tile"></span>
          </div>
          <span class="art-lock"><span class="material-symbols-rounded">lock</span></span>
        </div>
        <p class="multifile-modal-copy" id="quota-exhausted-title">
          You've used all 10 free uses today. Upgrade to WPS Pro+ for unlimited use!
        </p>
        <div class="multifile-modal-actions">
          <button class="btn-download-free" type="button" data-quota-download>
            <span class="material-symbols-rounded">download</span>
            Free Download
          </button>
          <button class="btn-start-trial" type="button" data-quota-trial>
            <span class="material-symbols-rounded">diamond</span>
            ${BUY_CTA}
          </button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    wireBuyButtons(backdrop, { download: "[data-quota-download]", buy: "[data-quota-trial]" });
    return backdrop;
  }

  /** 图3 — Pro+ upgrade modal (file size intercept) */
  function ensureProUpgradeModal() {
    let backdrop = document.getElementById("pro-upgrade-modal");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.id = "pro-upgrade-modal";
    backdrop.className = "proplus-modal-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="proplus-modal proplus-modal--classic" role="dialog" aria-modal="true" aria-labelledby="pro-upgrade-title">
        <button class="proplus-modal-close" type="button" data-modal-close aria-label="Close">
          <span class="material-symbols-rounded">close</span>
        </button>
        <h3 class="proplus-modal-title" id="pro-upgrade-title">Try All WPS Pro+ Features</h3>
        <div class="proplus-modal-lead" id="pro-upgrade-copy">
          <p class="proplus-lead-line">
            Free use has limits on file size and count. See the
            <button type="button" class="proplus-inline-info" id="pro-upgrade-info" aria-label="Quota details" aria-describedby="pro-upgrade-info-tip">ⓘ</button>
            tip for details.
          </p>
          <p class="proplus-lead-line">
            Upgrade to WPS Pro+ now for unlimited use, or just click Continue to enjoy the free quota.
          </p>
          <div class="proplus-inline-tip" id="pro-upgrade-info-tip" role="tooltip" hidden></div>
        </div>
        <div class="proplus-modal-body">
          <div class="proplus-folder-art" aria-hidden="true">
            <div class="proplus-folder">
              <span class="proplus-folder-label">WPS PRO</span>
              <div class="proplus-folder-tiles">
                <span class="proplus-tile"></span>
                <span class="proplus-tile"></span>
                <span class="proplus-tile"></span>
                <span class="proplus-tile"></span>
              </div>
            </div>
          </div>
          <ul class="proplus-feature-list">
            <li><span class="material-symbols-rounded">check_circle</span> Full access to all PDF tools</li>
            <li><span class="material-symbols-rounded">check_circle</span> Unlimited file processing</li>
            <li><span class="material-symbols-rounded">check_circle</span> Unlimited batch file conversion</li>
            <li><span class="material-symbols-rounded">check_circle</span> Larger file uploads</li>
            <li><span class="material-symbols-rounded">check_circle</span> Work on Windows, Linux, Android, macOS, iOS, and Web</li>
            <li><span class="material-symbols-rounded">check_circle</span> 80+ benefits on desktop and mobile clients</li>
          </ul>
        </div>
        <div class="proplus-modal-actions">
          <button class="btn-download-free" type="button" data-pro-download>
            <span class="material-symbols-rounded">download</span>
            Free Download
          </button>
          <button class="btn-start-trial" type="button" data-pro-trial>
            <span class="material-symbols-rounded">diamond</span>
            ${BUY_CTA}
          </button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    wireBuyButtons(backdrop, { download: "[data-pro-download]", buy: "[data-pro-trial]" });

    // Continue = dismiss and stay on free quota
    const continueHint = backdrop.querySelector(".proplus-lead-line:last-of-type");
    // Inline ⓘ shows Free vs Pro+ entitlement table
    const infoBtn = backdrop.querySelector("#pro-upgrade-info");
    const tip = backdrop.querySelector("#pro-upgrade-info-tip");
    let hideTimer;
    const showTip = () => {
      clearTimeout(hideTimer);
      const rules = global.WPSQuotaFlow?.getQuotaRules?.(
        document.body?.dataset?.toolSlug || ""
      );
      if (rules && tip) {
        tip.innerHTML = `
          <div class="quota-tooltip-head">
            <div class="quota-tooltip-head-text">
              <strong>${escapeHtml(rules.title)}</strong>
              <span>${escapeHtml(rules.subtitle)}</span>
            </div>
          </div>
          ${quotaTableHTML(rules)}`;
        tip.hidden = false;
      }
    };
    const hideTip = () => {
      hideTimer = setTimeout(() => { if (tip) tip.hidden = true; }, 140);
    };
    infoBtn?.addEventListener("mouseenter", showTip);
    infoBtn?.addEventListener("focus", showTip);
    infoBtn?.addEventListener("mouseleave", hideTip);
    infoBtn?.addEventListener("blur", hideTip);
    tip?.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    tip?.addEventListener("mouseleave", hideTip);

    void continueHint;
    return backdrop;
  }

  /** 图5/6 — free user selected too many files */
  function ensureMultiFileModal() {
    let backdrop = document.getElementById("multifile-limit-modal");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.id = "multifile-limit-modal";
    backdrop.className = "multifile-modal-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="multifile-modal" role="dialog" aria-modal="true" aria-labelledby="multifile-limit-title">
        <button class="multifile-modal-close" type="button" data-modal-close aria-label="Close">
          <span class="material-symbols-rounded">close</span>
        </button>
        <div class="multifile-modal-art" aria-hidden="true">
          <div class="art-window art-window--tools">
            <span class="art-tile"></span><span class="art-tile"></span><span class="art-tile"></span>
            <span class="art-tile"></span><span class="art-tile"></span><span class="art-tile"></span>
          </div>
          <span class="art-lock"><span class="material-symbols-rounded">lock</span></span>
        </div>
        <p class="multifile-modal-copy" id="multifile-limit-title"></p>
        <div class="multifile-modal-actions">
          <button class="btn-download-free" type="button" data-multifile-download>
            <span class="material-symbols-rounded">download</span>
            Free Download
          </button>
          <button class="btn-start-trial" type="button" data-multifile-trial>
            <span class="material-symbols-rounded">diamond</span>
            ${BUY_CTA}
          </button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    wireBuyButtons(backdrop, { download: "[data-multifile-download]", buy: "[data-multifile-trial]" });
    return backdrop;
  }

  function ensureMemberLimitModal() {
    let backdrop = document.getElementById("member-file-limit-modal");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.id = "member-file-limit-modal";
    backdrop.className = "member-limit-modal-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="member-limit-modal" role="alertdialog" aria-modal="true" aria-labelledby="member-limit-title">
        <button class="member-limit-modal-close" type="button" data-modal-close aria-label="Close">
          <span class="material-symbols-rounded">close</span>
        </button>
        <div class="member-limit-icon" aria-hidden="true">
          <span class="material-symbols-rounded">info</span>
        </div>
        <p class="member-limit-copy" id="member-limit-title">This file exceeds the 200 MB online upload limit.</p>
        <button class="btn-primary member-limit-ok" type="button" data-member-ok>OK</button>
      </div>`;
    document.body.appendChild(backdrop);
    const close = () => { backdrop.hidden = true; };
    bindModalClose(backdrop, close);
    backdrop.querySelector("[data-member-ok]")?.addEventListener("click", close);
    return backdrop;
  }

  function multiFileCopy(details) {
    if (details?.toolSlug === "merge-pdf") {
      return "Free users can only merge up to 2 files at a time. Upgrade to WPS Pro+ now for unlimited use of PDF features!";
    }
    return "Free users can process only 1 file every time. Upgrade to WPS Pro+ and enjoy unlimited PDF features now!";
  }

  function openQuotaExhausted() {
    ensureQuotaExhaustedModal().hidden = false;
  }

  function openProUpgrade() {
    ensureProUpgradeModal().hidden = false;
  }

  function openMultiFileLimit(details) {
    const modal = ensureMultiFileModal();
    const copy = modal.querySelector("#multifile-limit-title");
    if (copy) copy.textContent = multiFileCopy(details || {});
    modal.hidden = false;
  }

  function openMemberFileLimit(message) {
    const modal = ensureMemberLimitModal();
    const copy = modal.querySelector("#member-limit-title");
    if (copy) copy.textContent = message || "This file exceeds the 200 MB online upload limit.";
    modal.hidden = false;
  }

  function showIntercept(result) {
    if (!result || result.ok) return false;
    if (result.reason === "quota_exhausted") {
      openQuotaExhausted();
      return true;
    }
    if (result.reason === "guest_file_limit") {
      if (result.details?.type === "count") {
        openMultiFileLimit(result.details);
      } else {
        openProUpgrade();
      }
      return true;
    }
    if (result.reason === "member_file_limit") {
      openMemberFileLimit(result.message);
      return true;
    }
    return false;
  }

  function interceptUpload(files, toolSlug) {
    const Q = global.WPSQuotaFlow;
    if (!Q) return false;
    const result = Q.validateUpload(files, toolSlug);
    if (result.ok) return false;
    showIntercept(result);
    return true;
  }

  function wireUpgradeListener(callback) {
    ["quota-exhausted-modal", "pro-upgrade-modal", "multifile-limit-modal"].forEach((id) => {
      document.getElementById(id)?.addEventListener("quota-upgraded", callback);
    });
  }

  global.WPSQuotaModals = {
    BUY_CTA,
    BUY_URL,
    renderQuotaTooltipHTML,
    wireQuotaTooltipActions,
    openQuotaExhausted,
    openProUpgrade,
    openMultiFileLimit,
    openMemberFileLimit,
    showIntercept,
    interceptUpload,
    wireUpgradeListener
  };
})(typeof window !== "undefined" ? window : globalThis);
