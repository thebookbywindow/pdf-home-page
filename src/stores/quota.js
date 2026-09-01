import { defineStore } from "pinia";

export const useQuotaStore = defineStore("quota", {
  state: () => ({
    snapshot: null,
  }),
  getters: {
    loggedIn: (state) => Boolean(state.snapshot?.loggedIn),
    isPremium: (state) => Boolean(state.snapshot?.isPremium),
    usesRemaining: (state) => state.snapshot?.usesRemaining ?? 0,
  },
  actions: {
    refresh() {
      this.snapshot = window.WPSQuotaFlow?.getState?.() || null;
      return this.snapshot;
    },
    setScenario(scenario) {
      this.snapshot = window.WPSQuotaFlow?.setScenario?.(scenario) || this.snapshot;
      return this.snapshot;
    },
    consumeUse() {
      const result = window.WPSQuotaFlow?.consumeUse?.();
      if (result) this.snapshot = result.state;
      return result;
    },
    upgradePremium() {
      this.snapshot = window.WPSQuotaFlow?.upgradePremium?.() || this.snapshot;
      return this.snapshot;
    },
  },
});
