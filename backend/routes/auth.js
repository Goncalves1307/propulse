const { signUp ,login} = require("../controllers/authController");
const express = require("express");
const signUpSchema = require("../validators/auth")
const validate = require("../middleware/validate")
const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp)
router.post("/login", login);

module.exports = router;