const { createCompany, getCompanies , getCompaniesById } = require("../controllers/companyController");
const express = require("express");
const companyCreateSchema = require("../validators/company")
const validate = require("../middleware/validate")
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const membershipGuard = require('../middleware/membershipGuard')

router.post("/create", authMiddleware,validate(companyCreateSchema), createCompany)
router.get('/',authMiddleware,getCompanies)
router.get('/:id', authMiddleware, membershipGuard, getCompaniesById);
module.exports = router;