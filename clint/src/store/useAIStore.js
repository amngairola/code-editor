import { create } from "zustand";
import { aiService } from "../services/aiService";

const initialSectionState = {
  data: null,
  loading: false,
  error: null,
  isCached: false,
};

// Maps section key → the correct aiService method
const serviceMap = {
  bugs: (payload) => aiService.getBugs(payload),
  hints: (payload) => aiService.getHints(payload),
  optimization: (payload) => aiService.getOptimization(payload),
  explanation: (payload) => aiService.getExplanation(payload),
  complexity: (payload) => aiService.getComplexity(payload),
};

export const useAIStore = create((set, get) => ({
  // ── UI state ────────────────────────────────────────────────────────────────
  isOpen: true,
  activeSection: null,

  // ── Section state ────────────────────────────────────────────────────────────
  bugs: { ...initialSectionState },
  hints: { ...initialSectionState },
  optimization: { ...initialSectionState },
  explanation: { ...initialSectionState },
  complexity: { ...initialSectionState },

  // ── Actions ──────────────────────────────────────────────────────────────────

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),

  /** Toggle active section; clicking the same section collapses it */
  setActiveSection: (section) =>
    set({ activeSection: get().activeSection === section ? null : section }),

  /**
   * Fetch AI data for a section.
   * Skips the network call if data is cached (unless forceRefresh = true).
   *
   * @param {"bugs"|"hints"|"optimization"|"explanation"|"complexity"} section
   * @param {{ code: string, language: string, problem?: string }} payload
   * @param {boolean} forceRefresh - bypass cache
   */
  fetchAIAnalysis: async (section, payload, forceRefresh = false) => {
    const serviceFn = serviceMap[section];
    if (!serviceFn) {
      console.error(`[useAIStore] Unknown section: "${section}"`);
      return;
    }

    const sectionState = get()[section];

    // Use cache if available and refresh not forced
    if (sectionState?.isCached && !forceRefresh) return;

    // Set loading, clear previous error
    set((state) => ({
      [section]: { ...state[section], loading: true, error: null },
    }));

    try {
      const responseData = await serviceFn(payload);

      set({
        [section]: {
          data: responseData,
          loading: false,
          error: null,
          isCached: true,
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error || // matches backend: res.status(500).json({ error: "..." })
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch AI insights.";

      set((state) => ({
        [section]: {
          ...state[section],
          loading: false,
          error: message,
          isCached: false,
        },
      }));
    }
  },

  /** Call this when the user switches rooms or opens a new file */
  clearAICache: () =>
    set({
      bugs: { ...initialSectionState },
      hints: { ...initialSectionState },
      optimization: { ...initialSectionState },
      explanation: { ...initialSectionState },
      complexity: { ...initialSectionState },
      activeSection: null,
    }),
}));
