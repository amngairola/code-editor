/**
 * @file geminiHelper.js
 * @description Generic wrapper around Gemini's generateContent API.
 *
 * Centralises the model call so every controller stays DRY.
 * Import `model` from wherever your Gemini client is initialised
 * (e.g. config/gemini.js) and pass it in — or re-export a bound version.
 */

import { cleanAndParseJSON } from "./cleanGeminiResponse.js";

/**
 * Sends a prompt to Gemini and returns the parsed JSON response.
 *
 * @param {object} model     - Gemini GenerativeModel instance
 * @param {string} prompt    - The full prompt string to send
 * @returns {Promise<object>} Parsed JSON from Gemini's reply
 * @throws {Error}           On API failure or non-JSON response
 */
export const generateAIResponse = async (model, prompt) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();
  return cleanAndParseJSON(rawText);
};
