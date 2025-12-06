const {
  createCompany,
  getCompanies,
  getCompaniesById,
  deleteCompany,
  updateCompany,
  getCompanyMembers,
  addCompanyMember,
  updateCompanyMemberRole,
  removeCompanyMember,
} = require("../controllers/companyController");
const express = require("express");
const {companyCreateSchema,companyUpdateSchema} = require("../validators/company")
const validate = require("../middleware/validate")
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const membershipGuard = require('../middleware/membershipGuard')


router.post("/create", authMiddleware,validate(companyCreateSchema), createCompany)
router.get('/',authMiddleware,getCompanies)
router.get('/:companyId', authMiddleware, membershipGuard, getCompaniesById);
router.delete('/:companyId', authMiddleware, membershipGuard, deleteCompany);
router.put('/:companyId', authMiddleware, membershipGuard, validate(companyUpdateSchema), updateCompany);

//members
router.get("/:companyId/members", authMiddleware, membershipGuard, getCompanyMembers);
router.post("/:companyId/members", authMiddleware, membershipGuard, addCompanyMember);
router.put("/:companyId/members/:userId", authMiddleware, membershipGuard, updateCompanyMemberRole);
router.delete("/:companyId/members/:userId", authMiddleware, membershipGuard, removeCompanyMember);
module.exports = router;