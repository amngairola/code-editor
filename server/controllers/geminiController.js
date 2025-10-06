import model from "../config/gemini.js";

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
    console.error("Error executing code with Gemini:", error);

    res.status(500).json({ error: "Failed to execute code." });
  }
};
