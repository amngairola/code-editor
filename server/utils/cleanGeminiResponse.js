/**
 * @file cleanGeminiResponse.js
 * @description Utility to sanitize raw Gemini API output before JSON.parse().
 *
 * Gemini often wraps JSON in markdown code fences like:
 *   ```json
 *   { ... }
 *   ```
 * Passing that raw string to JSON.parse() throws a SyntaxError.
 * This helper strips fences, trims whitespace, and throws a clean error
 * if the result still isn't parseable — so callers get a consistent throw.
 */

/**
 * Strips markdown code fences and surrounding whitespace from a Gemini
 * response string, then parses it as JSON.
 *
 * @param {string} rawText - The raw text returned by response.text()
 * @returns {object} The parsed JSON object
 * @throws {Error} If the cleaned string cannot be parsed as JSON
 */
export const cleanAndParseJSON = (rawText) => {
  // Remove ```json ... ``` or ``` ... ``` wrappers (greedy, multiline)
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "") // opening fence
    .replace(/\s*```\s*$/i, "") // closing fence
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemini returned non-JSON output. Cleaned text: ${cleaned.slice(0, 200)}`
    );
  }
};
