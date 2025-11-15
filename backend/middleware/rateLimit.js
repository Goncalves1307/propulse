const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

function keyGenerator(req /*, res*/) {
  if (req.user && req.user.id) {
    return `user_${req.user.id}`;
  }
  return ipKeyGenerator(req);
}

function createRateLimiter(opts = {}) {
  const {
    windowMs = 60 * 1000,
    max = 5,
    message = "Too many requests, please try again later."
  } = opts;

  return rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message
  });
}

const aiGenerateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many AI generate requests. Try again in 1 minute."
});

const aiUpdateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI update requests. Try again in 1 minute."
});

module.exports = { aiGenerateLimiter, aiUpdateLimiter };