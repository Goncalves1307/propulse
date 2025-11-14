const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middleware/authMiddleware");
const membershipGuard = require("../middleware/membershipGuard");

const { generateQuoteText , updateGeneratedQuote} = require("../controllers/aiController");

router.post("/generate", authMiddleware, membershipGuard, generateQuoteText);
router.put("/updateGenerated", authMiddleware, membershipGuard, updateGeneratedQuote);

module.exports = router;