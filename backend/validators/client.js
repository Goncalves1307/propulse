const z = require("zod");

const clientCreateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(80, "Name must have at most 80 characters"),

  legalName: z.string()
    .trim()
    .min(3, "Legal name must have at least 3 characters")
    .max(80, "Legal name must have at most 80 characters"),

  taxId: z.string()
    .trim()
    .length(9, "Tax ID must have exactly 9 characters"),

  email: z.string()
    .trim()
    .email("Invalid email format"),

  phone: z.string()
    .trim()
    .max(30, "Phone must have at most 30 characters")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
    .optional(),
});

module.exports = clientCreateSchema;