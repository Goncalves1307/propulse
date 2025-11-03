const z = require("zod"); 



const signUpSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER","ADMIN"]).default("USER")
})

module.exports = signUpSchema