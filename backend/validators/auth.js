const z = require("zod");

const signUpSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(3).max(20).optional(),
});

module.exports = signUpSchema;