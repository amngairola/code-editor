import axios from "axios";

const API = axios.create({
  // VITE_REACT_APP_BACKEND_URL should be e.g. "http://localhost:5000"
  // The /api/ai prefix is added per-call below — no trailing slash here.
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL || "",
  headers: { "Content-Type": "application/json" },
});

// ─── Transformers ─────────────────────────────────────────────────────────────
// Each transformer maps a raw backend response to the AIResponseCard data shape.

/**
 * bugs: [{ line, severity, issue, fix }]
 * → { items: [{ title, description, severity }] }
 */
const transformBugs = ({ bugs = [] }) => ({
  items: bugs.map((b) => ({
    title: b.line ? `Line ${b.line} — ${b.issue}` : b.issue,
    description: b.fix,
    severity: b.severity,
  })),
});

/**
 * hints: [string]
 * → { items: [{ title, description }] }
 */
const transformHints = ({ hints = [] }) => ({
  items: hints.map((hint, i) => ({
    title: `Hint ${i + 1}`,
    description: hint,
  })),
});

/**
 * optimizations: [{ issue, improvement, benefit }]
 * → { items: [{ title, description }] }
 */
const transformOptimization = ({ optimizations = [] }) => ({
  items: optimizations.map((o) => ({
    title: o.issue,
    description: `**Improvement:** ${o.improvement}\n\n**Benefit:** ${o.benefit}`,
  })),
});

/**
 * { summary, steps: [string] }
 * → { summary, items: [{ title, description }] }
 */
const transformExplain = ({ summary = "", steps = [] }) => ({
  summary,
  items: steps.map((step, i) => ({
    title: `Step ${i + 1}`,
    description: step,
  })),
});

/**
 * { timeComplexity, spaceComplexity, explanation }
 * → { timeComplexity, spaceComplexity, summary }
 * (no items needed — AIResponseCard renders complexities via its grid + summary)
 */
const transformComplexity = ({
  timeComplexity,
  spaceComplexity,
  explanation,
}) => ({
  timeComplexity,
  spaceComplexity,
  summary: explanation,
  items: [], // no item cards for complexity
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const aiService = {
  /**
   * @param {{ code: string, language: string, problem?: string }} payload
   */
  getBugs: async (payload) => {
    const { data } = await API.post("/api/bugs", payload);
    return transformBugs(data);
  },

  getHints: async (payload) => {
    const { data } = await API.post("/api/hints", payload);
    return transformHints(data);
  },

  getOptimization: async (payload) => {
    const { data } = await API.post("/api/optimize", payload);
    return transformOptimization(data);
  },

  getExplanation: async (payload) => {
    const { data } = await API.post("/api/explain", payload);
    return transformExplain(data);
  },

  getComplexity: async (payload) => {
    const { data } = await API.post("/api/complexity", payload);
    return transformComplexity(data);
  },
};
