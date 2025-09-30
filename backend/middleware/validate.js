

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const formatted = {}
      for (const key in result.error.format()) {
        if (key !== "_errors") {
          formatted[key] = result.error.format()[key]._errors[0]
        }
      }
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid Data",
        fields: formatted
      })
    }
    req.validated = result.data
    next()
  }
}
module.exports = validate