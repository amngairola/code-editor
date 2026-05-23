import model from "../config/gemini.js";
import { generateAIResponse } from "../utils/geminiHelper.js";
import { cleanAndParseJSON } from "./../utils/cleanGeminiResponse.js";

export const runCode = async (req, res) => {
  const { language, code } = req.body;
  console.log("req resive");

  if (!code) {
    return res.status(400).json({
      error: "No code provided.",
    });
  }

  const prompt = `
        Act as a code interpreter for the ${language} language. 
        Your task is to execute the following code snippet and return only the raw output.
        - If the code executes successfully, provide only the standard output (e.g., what would be printed to the console).
        - If the code has a syntax or runtime error, provide only the error message.
        - Do not add any explanations, introductory text, or markdown code blocks like \`\`\`. Just return the raw text output or the raw error.

        Code to execute:
        \`\`\`${language}
        ${code}
        \`\`\`
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      output: text.trim(),
    });
  } catch (error) {
    console.error("Error executing code", error);

    res.status(500).json({ error: "Failed to execute code." });
  }
};

// add controller+routes for hint , bug , optimisation
const missingCode = (req, res) => {
  if (!req.body.code) {
    res.status(400).json({ error: "No code provided." });
    return true;
  }
  return false;
};

// 1. findBugs
/**
 * Detects syntax, runtime, logical bugs and edge-case issues.
 *
 * Response shape:
 * {
 *   "bugs": [
 *     { "line": 12, "severity": "high", "issue": "...", "fix": "..." }
 *   ]
 * }
 */
export const findBugs = async (req, res) => {
  if (missingCode(req, res)) return;
  const { language = "unknown", code } = req.body;
  console.log("finding bug in :", code);

  const prompt = `
You are an expert ${language} code reviewer and static analyser.
 
Analyse the following ${language} code for ALL types of bugs:
- Syntax errors
- Runtime errors (null dereference, out-of-bounds, type mismatches)
- Logical errors (wrong algorithm, off-by-one, incorrect conditionals)
- Edge cases that are unhandled (empty input, overflow, negative numbers)
 
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.
Use this exact schema:
{
  "bugs": [
    {
      "line": <integer or null if unknown>,
      "severity": "<high | medium | low>",
      "issue": "<concise description of the bug>",
      "fix": "<concise suggestion to fix it>"
    }
  ]
}
 
If no bugs are found, return: { "bugs": [] }
 
Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();

  try {
    const data = await generateAIResponse(model, prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("[findBugs]", error.message);
    res.status(500).json({ error: "Failed to analyse code for bugs." });
  }
};

// ─────────────────────────────────────────────
// 2. getHints
// ─────────────────────────────────────────────

/**
 * Returns directional hints toward a solution WITHOUT revealing the answer.
 *
 * Response shape:
 * {
 *   "hints": ["Try using a hashmap.", "Think about time complexity first."]
 * }
 */
export const getHints = async (req, res) => {
  if (missingCode(req, res)) return;

  const { language = "unknown", code, problem = "" } = req.body;
  console.log("finding hint in :", code);

  const prompt = `
You are a coding mentor helping a student solve a ${language} problem.
 
${problem ? `Problem statement:\n"${problem}"\n` : ""}
Here is the student's current code attempt:
\`\`\`${language}
${code}
\`\`\`
 
Your task: provide 2–4 SHORT, directional hints that nudge the student in the
right direction WITHOUT revealing the full solution or writing any code.
 
Rules:
- NEVER write or show corrected code
- NEVER give away the complete algorithm
- Keep each hint to one sentence
- Focus on data structures, patterns, or edge cases to think about
 
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.
Schema:
{
  "hints": ["<hint 1>", "<hint 2>", ...]
}
  `.trim();

  try {
    const data = await generateAIResponse(model, prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("[getHints]", error.message);
    res.status(500).json({ error: "Failed to generate hints." });
  }
};

// ─────────────────────────────────────────────
// 3. optimizeCode
// ─────────────────────────────────────────────

/**
 * Suggests performance, memory, and readability optimisations.
 *
 * Response shape:
 * {
 *   "optimizations": [
 *     { "issue": "...", "improvement": "...", "benefit": "..." }
 *   ]
 * }
 */
export const optimizeCode = async (req, res) => {
  if (missingCode(req, res)) return;

  const { language = "unknown", code } = req.body;
  console.log("optimizing bug in :", code);
  const prompt = `
You are a senior ${language} engineer performing a code review focused on
optimisation.
 
Analyse the following ${language} code across these dimensions:
1. Time complexity — is there a faster algorithm or data structure?
2. Memory usage — are there unnecessary allocations or copies?
3. Readability — can logic be simplified or made more idiomatic?
4. Modern language patterns — are there built-in functions / syntax that
   replace verbose custom logic?
 
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.
Schema:
{
  "optimizations": [
    {
      "issue": "<what is suboptimal>",
      "improvement": "<what to do instead>",
      "benefit": "<why this is better — e.g. O(n) → O(log n), cleaner syntax>"
    }
  ]
}
 
If the code is already optimal, return: { "optimizations": [] }
 
Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();

  try {
    const data = await generateAIResponse(model, prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("[optimizeCode]", error.message);
    res.status(500).json({ error: "Failed to optimise code." });
  }
};

// ─────────────────────────────────────────────
// 4. explainCode
// ─────────────────────────────────────────────

/**
 * Produces a plain-English summary and step-by-step walkthrough.
 *
 * Response shape:
 * {
 *   "summary": "...",
 *   "steps": ["...", "..."]
 * }
 */
export const explainCode = async (req, res) => {
  if (missingCode(req, res)) return;

  const { language = "unknown", code } = req.body;

  const prompt = `
You are a patient programming tutor explaining ${language} code to a student.
 
Read the following ${language} code carefully and produce:
1. A concise summary (1–2 sentences) of what the code does overall.
2. A numbered, step-by-step explanation of how it works — each step should
   be one clear sentence. Aim for 3–8 steps depending on complexity.
 
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.
Schema:
{
  "summary": "<one or two sentence overview>",
  "steps": ["<step 1>", "<step 2>", ...]
}
 
Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();

  try {
    const data = await generateAIResponse(model, prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("[explainCode]", error.message);
    res.status(500).json({ error: "Failed to explain code." });
  }
};

// ─────────────────────────────────────────────
// 5. analyzeComplexity
// ─────────────────────────────────────────────

/**
 * Computes Big-O time and space complexity with a short explanation.
 *
 * Response shape:
 * {
 *   "timeComplexity": "O(n log n)",
 *   "spaceComplexity": "O(n)",
 *   "explanation": "..."
 * }
 */
export const analyzeComplexity = async (req, res) => {
  if (missingCode(req, res)) return;

  const { language = "unknown", code } = req.body;

  const prompt = `
You are a computer science expert specialised in algorithmic analysis.
 
Analyse the following ${language} code and determine:
1. Time complexity — express as a Big-O notation (e.g. O(n), O(n log n), O(n²))
   for the worst case.
2. Space complexity — express as Big-O for auxiliary space (excluding input).
3. A 2–3 sentence explanation covering:
   - Which loop / recursion / data structure drives the time complexity
   - What additional memory is allocated and why
   - Any notable best/average-case differences if relevant
 
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.
Schema:
{
  "timeComplexity": "<Big-O string>",
  "spaceComplexity": "<Big-O string>",
  "explanation": "<2–3 sentence explanation>"
}
 
Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();

  try {
    const data = await generateAIResponse(model, prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("[analyzeComplexity]", error.message);
    res.status(500).json({ error: "Failed to analyse complexity." });
  }
};
