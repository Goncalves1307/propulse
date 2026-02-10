const z = require("zod");

const companyCreateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(80, "Name must have at most 80 characters"),

  description: z.string()
    .trim()
    .max(500, "Description must have at most 500 characters")
    .optional(),

  address: z.string()
    .trim()
    .max(120, "Address must have at most 120 characters")
    .optional(),

  city: z.string()
    .trim()
    .max(80, "City must have at most 80 characters")
    .optional(),

  postalCode: z.string()
    .trim()
    .max(20, "Postal code must have at most 20 characters")
    .optional(),

  country: z.string()
    .trim()
    .max(80, "Country must have at most 80 characters")
    .optional(),

  phone: z.string()
    .trim()
    .max(30, "Phone must have at most 30 characters")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
    .optional(),

  email: z.string()
    .trim()
    .email("Invalid email format")
    .optional(),

  website: z.string()
    .trim()
    .url("Invalid website URL")
    .optional(),

  taxId: z.string()
    .trim()
    .max(50, "Tax ID must have at most 50 characters")
    .optional(),
});

const companyUpdateSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(80, "Name must have at most 80 characters")
    .optional(),

  description: z.string()
    .trim()
    .max(500, "Description must have at most 500 characters")
    .optional()
    .nullable(),

  address: z.string()
    .trim()
    .max(120, "Address must have at most 120 characters")
    .optional()
    .nullable(),

  city: z.string()
    .trim()
    .max(120, "City must have at most 120 characters")
    .optional()
    .nullable(),

  postalCode: z.string()
    .trim()
    .max(30, "Postal code must have at most 30 characters")
    .optional()
    .nullable(),

  country: z.string()
    .trim()
    .max(60, "Country must have at most 60 characters")
    .optional()
    .nullable(),

  phone: z.string()
    .trim()
    .regex(/^[0-9+\-\s]*$/, "Invalid phone format")
    .optional()
    .nullable(),

  email: z.string()
    .trim()
    .email("Invalid email format")
    .optional()
    .nullable(),

  website: z.string()
    .trim()
    .max(255, "Website must have at most 255 characters")
    .optional()
    .nullable(),

  taxId: z.string()
    .trim()
    .max(60, "Tax ID must have at most 60 characters")
    .optional()
    .nullable(),
});

const memberCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),
  role: z
    .enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "Role must be either USER or ADMIN" })
    })
    .optional()
    .default("USER"),
});

const memberRoleUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role must be either USER or ADMIN" })
  }),
});

module.exports = {
  companyCreateSchema,
  companyUpdateSchema,
  memberCreateSchema,
  memberRoleUpdateSchema,
};