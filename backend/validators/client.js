const { z } = require("zod");

const emptyToUndefined = (schema) =>
  z
    .union([schema, z.literal("")])
    .transform((val) => (val === "" ? undefined : val));

const clientCreateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(80, "Name must have at most 80 characters"),

  email: z.string()
    .trim()
    .email("Invalid email format"),

  phone: emptyToUndefined(
    z.string()
      .trim()
      .max(30, "Phone must have at most 30 characters")
      .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
  ),

  taxId: z.string()
  .trim()
  .min(9, "Tax ID is required")
  .max(9, "Tax ID must have at most 9 characters"),

  legalName: emptyToUndefined(
    z.string()
      .trim()
      .max(120, "Legal name must have at most 120 characters")
  ),

  address: emptyToUndefined(
    z.string()
      .trim()
      .max(120, "Address must have at most 120 characters")
  ),

  city: emptyToUndefined(
    z.string()
      .trim()
      .max(80, "City must have at most 80 characters")
  ),

  state: emptyToUndefined(
    z.string()
      .trim()
      .max(80, "State must have at most 80 characters")
  ),

  zipCode: emptyToUndefined(
    z.string()
      .trim()
      .max(20, "Zip code must have at most 20 characters")
  ),

  country: emptyToUndefined(
    z.string()
      .trim()
      .max(80, "Country must have at most 80 characters")
  ),

  notes: emptyToUndefined(
    z.string()
      .trim()
      .max(500, "Notes must have at most 500 characters")
  ),
});

// Update schema: all fields optional
const clientUpdateSchema = clientCreateSchema.partial();

module.exports = {
  clientCreateSchema,
  clientUpdateSchema,
};