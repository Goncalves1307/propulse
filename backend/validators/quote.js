const z = require("zod");

const quoteItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  discountPct: z.number().min(0).max(100).optional(),
  taxRate: z.number().min(0).max(100).optional(),
});

const quoteCreateSchema = z.object({
  quoteNumber: z.string().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  discountAmount: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  issueDate: z
    .string()
    .datetime() 
    .optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
});

module.exports = { quoteCreateSchema };