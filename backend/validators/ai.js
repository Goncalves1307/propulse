// validators/ai.js
const { z } = require("zod");

const generateSchema = z.object({
  lang: z.string().optional(),
  tone: z.enum(["formal", "informal", "neutral"]).optional(),
  maxItems: z.number().int().min(1).max(200).optional(),
  maxWords: z.number().int().min(20).max(2000).optional(),
  persist: z.boolean().optional()
});

const updateSchema = z.object({
  text: z.string().min(1, "text is required")
});

module.exports = {
  generateSchema,
  updateSchema
};