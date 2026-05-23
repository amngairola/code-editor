import express from "express";

import {
  runCode,
  findBugs,
  getHints,
  optimizeCode,
  explainCode,
  analyzeComplexity,
} from "../controllers/geminiController.js";

const router = express.Router();
router.post("/run", runCode);
router.post("/bugs", findBugs);

// ── Directional hints (no solution spoilers) ──────────────────────────────────
// Body: { language, code, problem? }
router.post("/hints", getHints);

// ── Code optimisation suggestions ─────────────────────────────────────────────
// Body: { language, code }
router.post("/optimize", optimizeCode);

// ── Plain-English code explanation ────────────────────────────────────────────
// Body: { language, code }
router.post("/explain", explainCode);

// ── Big-O complexity analysis ─────────────────────────────────────────────────
// Body: { language, code }
router.post("/complexity", analyzeComplexity);

export default router;
