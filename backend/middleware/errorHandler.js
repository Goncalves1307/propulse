// middleware/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";


  let status = err.status || err.statusCode || 500;

  if (err.name === "ZodError") status = 400;
  if (err.code === "P2025") status = 404; // Prisma record not found
  if (err.name === "JsonWebTokenError") status = 401;


  const errorPayload = {
    message: "",
    code: "",
    requestId: req.requestId || null
  };


  if (status === 400) {
    errorPayload.message = "Dados inválidos.";
    errorPayload.code = "INVALID_INPUT";


    if (err.name === "ZodError") {
      const details = {};
      err.errors.forEach(e => {
        const field = e.path.join(".") || "root";
        details[field] = e.message;
      });
      errorPayload.details = details;
    }
  }

  else if (status === 401) {
    errorPayload.message = "Não autorizado.";
    errorPayload.code = "UNAUTHORIZED";
  }

  else if (status === 403) {
    errorPayload.message = "Acesso negado.";
    errorPayload.code = "FORBIDDEN";
  }

  else if (status === 404) {
    errorPayload.message = "Recurso não encontrado.";
    errorPayload.code = "NOT_FOUND";
  }

  else if (status === 502) {
    errorPayload.message = "Serviço externo indisponível.";
    errorPayload.code = "EXTERNAL_SERVICE_ERROR";
  }

  else {
    errorPayload.message = isProduction
      ? "Erro interno."
      : err.message || "Erro interno.";
    errorPayload.code = "INTERNAL_ERROR";
  }

  console.error("---- ERROR ----");
  console.error("RequestId:", req.requestId);
  console.error("Status:", status);
  console.error("Code:", errorPayload.code);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("----------------");

  res.status(status).json({ error: errorPayload });
};