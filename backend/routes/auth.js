const { signUp ,login,me} = require("../controllers/authController");
const express = require("express");
const signUpSchema = require("../validators/auth")
const auth = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp)
router.post("/login", login );
router.get("/me", auth, me);

module.exports = router;