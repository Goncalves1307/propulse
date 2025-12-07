const { createClient, getClients, getClientsId, updateClient, deleteClient } = require('../controllers/clientController');
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const clientCreateSchema = require("../validators/client");
const {createQuote,getQuotesByCompany,getQuotesByID,updateQuote, deleteQuote} = require('../controllers/quoteController')
const authMiddleware = require("../middleware/authMiddleware");
const membershipGuard = require("../middleware/membershipGuard");
const {quoteCreateSchema} = require('../validators/quote')

router.use("/:companyId", authMiddleware, membershipGuard);


//quote
router.post('/:companyId/:clientId/quote',authMiddleware,membershipGuard,validate(quoteCreateSchema),createQuote)
router.get('/:companyId/quotes',authMiddleware,membershipGuard,getQuotesByCompany)
router.get('/:companyId/:quoteId',authMiddleware,membershipGuard,getQuotesByID)
router.put('/:companyId/:quoteId',authMiddleware,membershipGuard,updateQuote)
router.delete('/:companyId/:quoteId',authMiddleware,membershipGuard,deleteQuote)


//client
router.post("/:companyId/create", validate(clientCreateSchema), createClient);
router.get("/:companyId", getClients);
router.get("/:companyId/client/:clientId", getClientsId);
router.put("/:companyId/client/:clientId", updateClient);
router.delete("/:companyId/:clientId", deleteClient);




module.exports = router;