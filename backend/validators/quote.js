const z = require("zod");

const quoteItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().nonnegative("Unit price must be 0 or more"),
});

const quoteCreateSchema = z.object({
  quoteNumber: z.string().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  discountAmount: z.coerce.number().nonnegative().optional(),
  taxAmount: z.coerce.number().nonnegative().optional(),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Issue date must be in format YYYY-MM-DD")
    .optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
});

module.exports = { quoteCreateSchema };