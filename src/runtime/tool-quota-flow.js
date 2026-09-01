/**
 * Site-wide quota (V5) — pdf.wps.com demo.
 * Guests have no free uses; signed-in free users: 1 use/day.
 * WPS Pro+ members: unlimited uses, ≤200 MB, unlimited files.
 */
(function (global) {
  const STORAGE_KEY = "wps_pdf_quota_demo_v2";
  const GUEST_DAILY_LIMIT = 0;
  const SIGNED_IN_DAILY_LIMIT = 1;
  const CLIENT_DAILY_LIMIT = 5;
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
      usesRemaining: GUEST_DAILY_LIMIT,
      clientUsesRemaining: 0,
      demoForceIntercept: null
    };
  }

  function dailyLimitFor(state) {
    return state.loggedIn ? SIGNED_IN_DAILY_LIMIT : GUEST_DAILY_LIMIT;
  }

  function normalizeState(state) {
    state.loggedIn = Boolean(state.loggedIn);
    state.isPremium = Boolean(state.isPremium);
    if (typeof state.usesRemaining !== "number") state.usesRemaining = dailyLimitFor(state);
    if (typeof state.clientUsesRemaining !== "number") {
      state.clientUsesRemaining = state.loggedIn ? CLIENT_DAILY_LIMIT : 0;
    }
    if (!state.loggedIn) {
      state.usesRemaining = GUEST_DAILY_LIMIT;
      state.clientUsesRemaining = 0;
    } else if (state.isPremium) {
      state.usesRemaining = SIGNED_IN_DAILY_LIMIT;
      state.clientUsesRemaining = CLIENT_DAILY_LIMIT;
    } else {
      state.usesRemaining = Math.max(0, Math.min(dailyLimitFor(state), state.usesRemaining));
      state.clientUsesRemaining = Math.max(0, Math.min(CLIENT_DAILY_LIMIT, state.clientUsesRemaining));
    }
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

    if (!state.isPremium && state.usesRemaining <= 0 && state.clientUsesRemaining <= 0) {
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
    DAILY_LIMIT: GUEST_DAILY_LIMIT,
    GUEST_DAILY_LIMIT,
    SIGNED_IN_DAILY_LIMIT,
    CLIENT_DAILY_LIMIT,
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
        Object.assign(base, {
          usesRemaining: scenario === "logged_in" ? SIGNED_IN_DAILY_LIMIT : GUEST_DAILY_LIMIT,
          clientUsesRemaining: scenario === "logged_in" ? CLIENT_DAILY_LIMIT : 0,
          isPremium: false
        });
        if (scenario === "logged_in") {
          base.loggedIn = true;
          base.userName = "Demo User";
        }
      } else if (scenario === "guest_exhausted") {
        Object.assign(base, { usesRemaining: 0, clientUsesRemaining: 0, isPremium: false });
      } else if (scenario === "guest_file_limit") {
        Object.assign(base, { usesRemaining: 0, clientUsesRemaining: 0, isPremium: false, demoForceIntercept: "guest_file" });
      } else if (scenario === "guest_count_limit") {
        Object.assign(base, { usesRemaining: 0, clientUsesRemaining: 0, isPremium: false, demoForceIntercept: "guest_count" });
      } else if (scenario === "member_ok" || scenario === "premium") {
        Object.assign(base, {
          loggedIn: true,
          userName: "Demo User",
          isPremium: true,
          usesRemaining: SIGNED_IN_DAILY_LIMIT,
          clientUsesRemaining: CLIENT_DAILY_LIMIT,
          demoForceIntercept: null
        });
      } else if (scenario === "member_file_limit") {
        Object.assign(base, {
          loggedIn: true,
          userName: "Demo User",
          isPremium: true,
          usesRemaining: SIGNED_IN_DAILY_LIMIT,
          clientUsesRemaining: CLIENT_DAILY_LIMIT,
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
      if (!state.isPremium) {
        state.usesRemaining = SIGNED_IN_DAILY_LIMIT;
        state.clientUsesRemaining = CLIENT_DAILY_LIMIT;
      }
      saveState(state);
      return state;
    },
    logout() {
      const state = loadState();
      state.loggedIn = false;
      state.userName = "";
      if (!state.isPremium) {
        state.usesRemaining = GUEST_DAILY_LIMIT;
        state.clientUsesRemaining = 0;
      }
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
        if (state.loggedIn && state.clientUsesRemaining > 0) {
          state.clientUsesRemaining -= 1;
          saveState(state);
          return { ok: true, state, source: "wps-office" };
        }
        saveState(state);
        return { ok: false, state };
      }
      state.usesRemaining -= 1;
      saveState(state);
      return { ok: true, state, source: "web" };
    },
    upgradePremium() {
      const state = loadState();
      state.loggedIn = true;
      state.userName = state.userName || "Demo User";
      state.isPremium = true;
      state.demoForceIntercept = null;
      state.clientUsesRemaining = CLIENT_DAILY_LIMIT;
      saveState(state);
      return state;
    },
    setUsesRemaining(n) {
      const state = loadState();
      if (state.isPremium) return state;
      state.usesRemaining = Math.max(0, Math.min(dailyLimitFor(state), parseInt(n, 10) || 0));
      saveState(state);
      return state;
    },
    setClientUsesRemaining(n) {
      const state = loadState();
      if (state.isPremium || !state.loggedIn) return state;
      state.clientUsesRemaining = Math.max(0, Math.min(CLIENT_DAILY_LIMIT, parseInt(n, 10) || 0));
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
          text: options.compact ? "Unlimited" : "<strong>Unlimited</strong>",
          sub: null
        };
      }
      if (!state.loggedIn && options.compact) {
        return {
          text: "Sign in to get more free uses",
          sub: null
        };
      }
      const left = Math.max(0, state.usesRemaining);
      const dailyLimit = dailyLimitFor(state);
      return {
        text: options.compact
          ? `Online: <strong>${left}</strong> uses left`
          : `<strong>${left}</strong> of ${dailyLimit} free uses left today`,
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
          { label: "Daily uses", guest: "0/day", member: "1/day" },
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
