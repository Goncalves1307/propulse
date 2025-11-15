// middleware/validate.js
function validate(schema) {
  return (req, res, next) => {
    // Aceita tanto um Zod schema object como uma função que o retorna
    const realSchema = (typeof schema === "function" && typeof schema.safeParse !== "function")
      ? schema()
      : schema;

    
    if (!realSchema || typeof realSchema.safeParse !== "function") {
      console.error("validate middleware: schema inválido passado para validate()", { schema });
      return res.status(500).json({
        code: "VALIDATOR_ERROR",
        message: "Validator inválido. Verifica a importação do schema."
      });
    }

    const result = realSchema.safeParse(req.body);
    if (!result.success) {
      const formatted = {};
      const formattedError = result.error.format ? result.error.format() : {};
      for (const key in formattedError) {
        if (key !== "_errors") {
          formatted[key] = formattedError[key]._errors ? formattedError[key]._errors[0] : String(formattedError[key]);
        }
      }
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid Data",
        fields: formatted
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = validate;
