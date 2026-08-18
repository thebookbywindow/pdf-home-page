/**
 * Site-wide quota (V5) — pdf.wps.com demo.
 * Guest / non-member: 10 uses/day, ≤10 MB, 1 file (merge: 2).
 * Member (wps_pro): unlimited uses, ≤200 MB, unlimited files.
 */
(function (global) {
  const STORAGE_KEY = "wps_pdf_quota_demo_v2";
  const DAILY_LIMIT = 10;
  const GUEST_MAX_MB = 10;
  const MEMBER_MAX_MB = 200;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (_) {}
    return defaultState();
  }

  function defaultState() {
    return {
      loggedIn: false,
      userName: "",
      isPremium: false,
      usesRemaining: DAILY_LIMIT,
      demoForceIntercept: null
    };
  }

  function normalizeState(state) {
    if (typeof state.usesRemaining !== "number") state.usesRemaining = DAILY_LIMIT;
    if (state.isPremium) state.usesRemaining = DAILY_LIMIT;
    return state;
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getMaxFilesForTool(toolSlug) {
    return toolSlug === "merge-pdf" ? 2 : 1;
  }

  function validateUpload(files, toolSlug, state) {
    state = normalizeState(state || loadState());
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return { ok: false, reason: "empty" };

    if (!state.isPremium && state.usesRemaining <= 0) {
      return { ok: false, reason: "quota_exhausted" };
    }

    if (state.demoForceIntercept === "guest_file" && !state.isPremium) {
      return { ok: false, reason: "guest_file_limit", details: { type: "size", demo: true } };
    }
    if (state.demoForceIntercept === "guest_count" && !state.isPremium) {
      return {
        ok: false,
        reason: "guest_file_limit",
        details: { type: "count", maxFiles: getMaxFilesForTool(toolSlug), toolSlug, demo: true }
      };
    }
    if (state.demoForceIntercept === "member_file" && state.isPremium) {
      return { ok: false, reason: "member_file_limit", message: "This file exceeds the 200 MB online upload limit." };
    }

    const maxMb = state.isPremium ? MEMBER_MAX_MB : GUEST_MAX_MB;
    const maxBytes = maxMb * 1024 * 1024;
    const maxFiles = state.isPremium ? Infinity : getMaxFilesForTool(toolSlug);

    for (const file of list) {
      if (file.size > maxBytes) {
        if (state.isPremium) {
          return {
            ok: false,
            reason: "member_file_limit",
            message: "This file exceeds the 200 MB online upload limit."
          };
        }
        return {
          ok: false,
          reason: "guest_file_limit",
          details: { type: "size", maxMb: GUEST_MAX_MB, fileName: file.name }
        };
      }
    }

    if (!state.isPremium && list.length > maxFiles) {
      return {
        ok: false,
        reason: "guest_file_limit",
        details: {
          type: "count",
          maxFiles,
          count: list.length,
          toolSlug
        }
      };
    }

    return { ok: true, state };
  }

  const QuotaFlow = {
    DAILY_LIMIT,
    GUEST_MAX_MB,
    MEMBER_MAX_MB,
    getState() {
      return normalizeState(loadState());
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      return this.getState();
    },
    setScenario(scenario) {
      const base = defaultState();
      if (scenario === "guest_ok" || scenario === "logged_out" || scenario === "logged_in") {
        Object.assign(base, { usesRemaining: DAILY_LIMIT, isPremium: false });
        if (scenario === "logged_in") {
          base.loggedIn = true;
          base.userName = "Demo User";
        }
      } else if (scenario === "guest_exhausted") {
        Object.assign(base, { usesRemaining: 0, isPremium: false });
      } else if (scenario === "guest_file_limit") {
        Object.assign(base, { usesRemaining: DAILY_LIMIT, isPremium: false, demoForceIntercept: "guest_file" });
      } else if (scenario === "guest_count_limit") {
        Object.assign(base, { usesRemaining: DAILY_LIMIT, isPremium: false, demoForceIntercept: "guest_count" });
      } else if (scenario === "member_ok" || scenario === "premium") {
        Object.assign(base, {
          loggedIn: true,
          userName: "Demo User",
          isPremium: true,
          usesRemaining: DAILY_LIMIT,
          demoForceIntercept: null
        });
      } else if (scenario === "member_file_limit") {
        Object.assign(base, {
          loggedIn: true,
          userName: "Demo User",
          isPremium: true,
          usesRemaining: DAILY_LIMIT,
          demoForceIntercept: "member_file"
        });
      }
      saveState(base);
      return base;
    },
    login(name) {
      const state = loadState();
      state.loggedIn = true;
      state.userName = name || "Demo User";
      saveState(state);
      return state;
    },
    logout() {
      const state = loadState();
      state.loggedIn = false;
      state.userName = "";
      saveState(state);
      return state;
    },
    consumeUse() {
      const state = loadState();
      if (state.isPremium) {
        saveState(state);
        return { ok: true, state };
      }
      if (state.usesRemaining <= 0) {
        saveState(state);
        return { ok: false, state };
      }
      state.usesRemaining -= 1;
      saveState(state);
      return { ok: true, state };
    },
    upgradePremium() {
      const state = loadState();
      state.loggedIn = true;
      state.userName = state.userName || "Demo User";
      state.isPremium = true;
      state.demoForceIntercept = null;
      saveState(state);
      return state;
    },
    setUsesRemaining(n) {
      const state = loadState();
      if (state.isPremium) return state;
      state.usesRemaining = Math.max(0, Math.min(DAILY_LIMIT, parseInt(n, 10) || 0));
      saveState(state);
      return state;
    },
    validateUpload(files, toolSlug) {
      return validateUpload(files, toolSlug);
    },
    getMaxFilesForTool,
    getQuotaSummary(state, options = {}) {
      state = normalizeState(state || this.getState());
      if (state.isPremium) {
        return {
          text: options.compact ? "Unlimited uses" : "<strong>Unlimited</strong>",
          sub: null
        };
      }
      const left = Math.max(0, state.usesRemaining);
      return {
        text: options.compact
          ? `Daily <strong>${left}</strong> of ${DAILY_LIMIT}`
          : `<strong>${left}</strong> of ${DAILY_LIMIT} free uses left today`,
        sub: null
      };
    },
    getQuotaRules(toolSlug) {
      const singleFile = Boolean(
        global.WPSToolCatalog?.getBySlug?.(toolSlug)?.singleFile
      );
      return {
        title: "Free quota on pdf.wps.com",
        subtitle: "Resets daily · shared across all tools",
        table: [
          { label: "Daily uses", guest: "10 total / day", member: "Unlimited" },
          { label: "File size", guest: `≤ ${GUEST_MAX_MB} MB`, member: `≤ ${MEMBER_MAX_MB} MB` },
          {
            label: "Files per task",
            guest: singleFile ? "1 file" : "1 file (Merge: 2)",
            member: singleFile ? "1 file" : "Unlimited"
          }
        ]
      };
    }
  };

  global.WPSQuotaFlow = QuotaFlow;
})(typeof window !== "undefined" ? window : globalThis);
