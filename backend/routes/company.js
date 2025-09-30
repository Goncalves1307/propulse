const { createCompany, getCompanies } = require("../controllers/companyController");
const express = require("express");
const companyCreateSchema = require("../validators/company")
const validate = require("../middleware/validate")
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

router.post("/create", authMiddleware,validate(companyCreateSchema), createCompany)
router.get('/',authMiddleware,getCompanies)
module.exports = router;