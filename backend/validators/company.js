const z = require("zod");

const companyCreateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(80, "Name must have at most 80 characters"),

  description: z.string()
    .trim()
    .max(500)
    .optional(),

  address: z.string()
    .trim()
    .max(120)
    .optional(),

  city: z.string()
    .trim()
    .max(80)
    .optional(),

  postalCode: z.string()
    .trim()
    .max(20)
    .optional(),

  country: z.string()
    .trim()
    .max(80)
    .optional(),

  phone: z.string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format"),

  email: z.string()
    .email()
    .optional(),

  website: z.string()
    .url()
    .optional(),

  taxId: z.string()
    .trim()
    .max(50)
    .optional(),
});


const companyUpdateSchema = z.object({
  name: z.string().min(1).max(80).optional(),

  description: z.string().max(500).optional().nullable(),

  address: z.string().max(120).optional().nullable(),

  city: z.string().max(120).optional().nullable(),

  postalCode: z.string().max(30).optional().nullable(),

  country: z.string().max(60).optional().nullable(),

  phone: z.string()
    .regex(/^[0-9+\-\s]*$/)
    .optional()
    .nullable(),

  email: z.string().email().optional().nullable(),

  website: z.string().max(255).optional().nullable(),

  taxId: z.string().max(60).optional().nullable(),
});


module.exports = {
  companyCreateSchema,
  companyUpdateSchema,
};