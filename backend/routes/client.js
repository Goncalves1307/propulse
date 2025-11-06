const { createClient, getClients, getClientsId, updateClient, deleteClient } = require('../controllers/clientController');
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const clientCreateSchema = require("../validators/client");

const authMiddleware = require("../middleware/authMiddleware");
const membershipGuard = require("../middleware/membershipGuard");


router.use("/:companyId", authMiddleware, membershipGuard);

router.post("/:companyId/create", validate(clientCreateSchema), createClient);
router.get("/:companyId", getClients);
router.get("/:companyId/:clientId", getClientsId);
router.put("/:companyId/:clientId", updateClient);
router.delete("/:companyId/:clientId", deleteClient);

module.exports = router;