const z = require("zod");

const companyCreateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(80, "Name must have at most 80 characters"),

  slug: z.string()
    .trim()
    .toLowerCase()
    .max(100, "Slug must have at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),

  description: z.string()
    .trim()
    .max(500, "Description must have at most 500 characters")
    .optional(),

  location: z.string()
    .trim()
    .max(120, "Location must have at most 120 characters")
    .optional(),

  phone: z.string()
    .trim()
    .max(30, "Phone must have at most 30 characters")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
    .optional(),
});

module.exports = companyCreateSchema;