/**
 * Shared WPS outbound links + platform-aware client download.
 */
(function (global) {
  const SIGN_IN_URL = "https://global.wps.com/account/signin?autologin=false&hidetitle=false&opener=true";
  const EXTENSION_URL = "https://chromewebstore.google.com/detail/wps-pdf-read-edit-fill-co/kdpelmjpfafjppnhbloffcjpeomlnpah";
  const PREMIUM_URL = "https://www.wps.com/buy/";

  const DOWNLOAD_URLS = {
    windows: "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/onlinesetup/distsrc/200.1021/wpsinst/wps_office_inst.exe",
    mac: "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/macwpsoffice/download/installer/WPS_Office_Installer_0024.31300027.zip",
    "linux-deb": "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/download/linux/11691/wps-office_11.1.0.11691.XA_amd64.deb",
    "linux-rpm": "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/download/linux/11691/wps-office-11.1.0.11691.XA-1.x86_64.rpm",
    android: "https://play.google.com/store/apps/details?id=cn.wps.moffice_eng&referrer=utm_source%3Dseo_com_pdf%26utm_medium%3D{cid}%26source%3Dseo_com_pdf",
    ios: "https://wpsoffice.onelink.me/Z13H/ikut3iwr"
  };

  function detectPlatform() {
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    if (/(iPad|iPhone|iPod)/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Win/i.test(ua) || /Windows/i.test(navigator.platform || "")) return "windows";
    if (/Mac/i.test(ua) || /Macintosh/i.test(navigator.platform || "")) return "mac";
    if (/Linux/i.test(ua) || /Linux/i.test(navigator.platform || "")) return "linux-deb";
    return "windows";
  }

  function openDownload(platform) {
    const resolved = platform === "auto" ? detectPlatform() : platform;
    if (resolved === "windows" && global.__WPSdownloader?.download) {
      global.__WPSdownloader.download();
      return;
    }
    const url = DOWNLOAD_URLS[resolved];
    if (!url) return;
    const cid = Date.now().toString(36);
    global.open(url.replace("{cid}", cid), "_blank", "noopener,noreferrer");
  }

  function openSignIn() {
    const quota = global.WPSQuotaFlow;
    const state = quota?.login?.();
    if (state) {
      global.WPSToolUserSwitcher?.sync?.(state);
      const quotaText = document.getElementById("quota-text");
      if (quotaText && quota.getQuotaSummary) {
        const compact = document.body?.classList.contains("tool-page--3d-parity")
          || document.body?.classList.contains("tool-page--pdf-parity");
        const summary = quota.getQuotaSummary(state, { compact });
        quotaText.innerHTML = summary.sub
          ? `${summary.text} <span class="quota-sub">(${summary.sub})</span>`
          : summary.text;
      }
    }
    global.open(SIGN_IN_URL, "_blank", "noopener,noreferrer");
  }

  function openExtension() {
    global.open(EXTENSION_URL, "_blank", "noopener,noreferrer");
  }

  function openPremium() {
    global.open(PREMIUM_URL, "_blank", "noopener,noreferrer");
  }

  function wireDownloadTriggers(root) {
    (root || document).querySelectorAll("[data-wps-download]").forEach((trigger) => {
      if (trigger.dataset.wpsDownloadWired) return;
      trigger.dataset.wpsDownloadWired = "1";
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openDownload(trigger.dataset.wpsDownload || "auto");
      });
    });
  }

  global.WPSLinks = {
    SIGN_IN_URL,
    EXTENSION_URL,
    PREMIUM_URL,
    DOWNLOAD_URLS,
    detectPlatform,
    openDownload,
    openSignIn,
    openExtension,
    openPremium,
    wireDownloadTriggers
  };
})(typeof window !== "undefined" ? window : globalThis);
