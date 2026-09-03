/**
 * Quota intercept modals for tool inner pages.
 * Quota exhausted | Pro+ upgrade (size) | Multi-file limit | Member 200 MB.
 */
(function (global) {
  const BUY_CTA = "Upgrade to Pro+";
  const BUY_URL = "https://www.wps.com/buy/";
  let loginContinuation = null;

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

  function quotaAsset(name) {
    const base = global.WPSToolCatalog?.assetBase?.() || document.body?.dataset?.assetBase || "";
    const normalizedBase = base && !base.endsWith("/") ? `${base}/` : base;
    return `${normalizedBase}images/tool-live/quota/${name}`;
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

  const OFFICIAL_QUOTA_PANEL = {
    panelTitle: "Daily free quota",
    panelSub: "Resets daily · shared across all tools",
    colSignedIn: "Signed-in",
    colClient: "WPS Drive",
    colPro: "WPS Pro+",
    rows: [
      { label: "Daily uses", signedIn: "1/day", client: "5/day", pro: "Unlimited" },
      { label: "File size", signedIn: "≤ 10 MB", client: "≤ 10 MB", pro: "≤ 200 MB" },
      { label: "Files per task", signedIn: "1", client: "1", pro: "Unlimited" }
    ],
    upgradeHint: "Unlimited use with WPS Pro+",
    downloadHint: "Download WPS Office to view and edit the converted file in WPS Drive.",
    upgrade: "Upgrade",
    download: "Download"
  };

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

  function officialQuotaRowHTML(row, last) {
    return `
            <div class="daily-quota-panel__row${last ? " daily-quota-panel__row--last" : ""}">
              <span class="daily-quota-panel__cell daily-quota-panel__cell--label">${escapeHtml(row.label)}</span>
              <span class="daily-quota-panel__cell">${escapeHtml(row.signedIn)}</span>
              <span class="daily-quota-panel__cell">${escapeHtml(row.client)}</span>
              <span class="daily-quota-panel__cell">${escapeHtml(row.pro)}</span>
            </div>`;
  }

  function renderOfficialQuotaTooltipHTML() {
    const copy = OFFICIAL_QUOTA_PANEL;
    const rows = copy.rows.map((row, i) => officialQuotaRowHTML(row, i === copy.rows.length - 1)).join("");
    return `
      <div class="daily-quota-panel" role="dialog" aria-label="${escapeHtml(copy.panelTitle)}">
        <div class="daily-quota-panel__head">
          <p class="daily-quota-panel__title">${escapeHtml(copy.panelTitle)}</p>
          <p class="daily-quota-panel__sub">${escapeHtml(copy.panelSub)}</p>
        </div>
        <div class="daily-quota-panel__table">
          <div class="daily-quota-panel__table-head">
            <span class="daily-quota-panel__cell"></span>
            <span class="daily-quota-panel__cell">${escapeHtml(copy.colSignedIn)}</span>
            <span class="daily-quota-panel__cell">${escapeHtml(copy.colClient)}</span>
            <span class="daily-quota-panel__cell">${escapeHtml(copy.colPro)}</span>
          </div>
          ${rows}
        </div>
        <div class="daily-quota-panel__actions">
          <div class="daily-quota-panel__action-row">
            <p>${escapeHtml(copy.upgradeHint)}</p>
            <button type="button" class="daily-quota-panel__pill" data-quota-upgrade>${escapeHtml(copy.upgrade)}</button>
          </div>
          <div class="daily-quota-panel__action-row">
            <p>${escapeHtml(copy.downloadHint)}</p>
            <button type="button" class="daily-quota-panel__pill" data-quota-download>${escapeHtml(copy.download)}</button>
          </div>
        </div>
      </div>`;
  }

  function renderQuotaTooltipHTML(data, options = {}) {
    if (options.official) return renderOfficialQuotaTooltipHTML();
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
    if (!el) return;
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
    el.querySelectorAll("[data-quota-download]").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        links()?.openDownload("auto");
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
    backdrop.className = "continer-wrap is-guest-login";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="guest-login-dialog" role="dialog" aria-modal="true" aria-labelledby="quota-exhausted-modal-title" aria-describedby="quota-exhausted-title">
        <div class="guest-login-dialog__top">
          <button class="guest-login-dialog__close" type="button" data-modal-close aria-label="Close">
            <img src="${escapeHtml(quotaAsset("close.svg"))}" alt="">
          </button>
        </div>
        <div class="guest-login-dialog__body">
          <div class="guest-login-dialog__hero" aria-hidden="true">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2525" src="${escapeHtml(quotaAsset("intro-r2525.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2526" src="${escapeHtml(quotaAsset("intro-r2526.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2528" src="${escapeHtml(quotaAsset("intro-r2528.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--subtract" src="${escapeHtml(quotaAsset("intro-subtract.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--vector" src="${escapeHtml(quotaAsset("intro-vector.svg"))}" alt="">
          </div>
          <h2 class="guest-login-dialog__title" id="quota-exhausted-modal-title">Unlock more</h2>
          <p class="guest-login-dialog__sub" id="quota-exhausted-title">
            You've used all free uses today. Sign in to get more daily free uses.
          </p>
        </div>
        <div class="guest-login-dialog__actions">
          <button class="guest-login-dialog__btn guest-login-dialog__btn--primary" type="button" data-quota-sign-in>
            <img src="${escapeHtml(quotaAsset("sign-in.svg"))}" alt="">
            <span>Sign in</span>
          </button>
          <button class="guest-login-dialog__btn guest-login-dialog__btn--secondary" type="button" data-quota-trial>
            <span class="guest-login-dialog__badge" aria-hidden="true">
              <img class="guest-login-dialog__badge-union" src="${escapeHtml(quotaAsset("upgrade-union.svg"))}" alt="">
              <img class="guest-login-dialog__badge-star" src="${escapeHtml(quotaAsset("upgrade-star.svg"))}" alt="">
            </span>
            <span>${BUY_CTA}</span>
          </button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const close = () => { backdrop.hidden = true; };
    bindModalClose(backdrop, close);
    backdrop.querySelector("[data-quota-sign-in]")?.addEventListener("click", () => {
      links()?.openSignIn();
      close();
    });
    backdrop.querySelector("[data-quota-trial]")?.addEventListener("click", () => goBuy(backdrop));
    return backdrop;
  }

  function ensureLoginRequiredModal() {
    let backdrop = document.getElementById("login-required-modal");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.id = "login-required-modal";
    backdrop.className = "continer-wrap is-guest-login";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="guest-login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-required-modal-title" aria-describedby="login-required-modal-copy">
        <div class="guest-login-dialog__top">
          <button class="guest-login-dialog__close" type="button" data-modal-close aria-label="Close">
            <img src="${escapeHtml(quotaAsset("close.svg"))}" alt="">
          </button>
        </div>
        <div class="guest-login-dialog__body">
          <div class="guest-login-dialog__hero" aria-hidden="true">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2525" src="${escapeHtml(quotaAsset("intro-r2525.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2526" src="${escapeHtml(quotaAsset("intro-r2526.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--r2528" src="${escapeHtml(quotaAsset("intro-r2528.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--subtract" src="${escapeHtml(quotaAsset("intro-subtract.svg"))}" alt="">
            <img class="guest-login-dialog__hero-layer guest-login-dialog__hero-layer--vector" src="${escapeHtml(quotaAsset("intro-vector.svg"))}" alt="">
          </div>
          <h2 class="guest-login-dialog__title" id="login-required-modal-title">Sign in to continue</h2>
          <p class="guest-login-dialog__sub" id="login-required-modal-copy">
            Sign in to continue processing your file.
          </p>
        </div>
        <div class="guest-login-dialog__actions">
          <button class="guest-login-dialog__btn guest-login-dialog__btn--primary" type="button" data-login-required-sign-in>
            <img src="${escapeHtml(quotaAsset("sign-in.svg"))}" alt="">
            <span>Sign in</span>
          </button>
          <button class="guest-login-dialog__btn guest-login-dialog__btn--secondary" type="button" data-modal-close>
            <span>Cancel</span>
          </button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const close = () => { backdrop.hidden = true; };
    const cancel = () => {
      loginContinuation = null;
      close();
    };
    bindModalClose(backdrop, cancel);
    backdrop.querySelector("[data-login-required-sign-in]")?.addEventListener("click", () => {
      const resume = loginContinuation;
      loginContinuation = null;
      links()?.openSignIn();
      close();
      resume?.();
    });
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

  function openLoginRequired() {
    ensureLoginRequiredModal().hidden = false;
  }

  function setLoginContinuation(callback) {
    loginContinuation = typeof callback === "function" ? callback : null;
  }

  function interceptUnauthenticatedPdf(files, onLogin) {
    const state = global.WPSQuotaFlow?.getState?.();
    const list = Array.from(files || []).filter(Boolean);
    const containsPdf = list.some((file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""));
    if (!containsPdf || state?.loggedIn) return false;
    setLoginContinuation(onLogin);
    openLoginRequired();
    return true;
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
    openLoginRequired,
    setLoginContinuation,
    interceptUnauthenticatedPdf,
    openProUpgrade,
    openMultiFileLimit,
    openMemberFileLimit,
    showIntercept,
    interceptUpload,
    wireUpgradeListener
  };
})(typeof window !== "undefined" ? window : globalThis);
