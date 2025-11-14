// services/geminiService.js
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt
    });

    // o SDK já te dá .text direto (super simples)
    return {
      success: true,
      text: response.text
    };

  } catch (err) {
    return {
      success: false,
      error: err?.message || "Erro ao chamar o modelo Gemini"
    };
  }
}

module.exports = { generateWithGemini };