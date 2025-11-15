const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middleware/authMiddleware");
const membershipGuard = require("../middleware/membershipGuard");
const {aiGenerateLimiter,aiUpdateLimiter} = require('../middleware/rateLimit')
const validate = require('../middleware/validate')
const {generateSchema,updateSchema} = require('../validators/ai')
const { generateQuoteText , updateGeneratedQuote} = require("../controllers/aiController");

router.post(
  "/generate",
  authMiddleware,
  membershipGuard,
  aiGenerateLimiter,
  validate(generateSchema),
  generateQuoteText
);

router.post(
  "/update-generated",
  authMiddleware,
  membershipGuard,
  aiUpdateLimiter,
  validate(updateSchema),
  updateGeneratedQuote
);

module.exports = router;