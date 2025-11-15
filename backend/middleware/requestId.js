const { randomUUID } = require("crypto");

module.exports = function requestId(req, res, next) {
  
  let id =
    req.headers["x-request-id"] &&
    typeof req.headers["x-request-id"] === "string"
      ? req.headers["x-request-id"]
      : null;

  if (!id || !id.trim()) {
    id = randomUUID();
  }


  req.requestId = id;

  res.setHeader("X-Request-Id", id);

  next();
};