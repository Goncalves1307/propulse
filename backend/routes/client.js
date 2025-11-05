const {createClient,getClients,getClientsId,updateClient} = require('../controllers/clientController')
const express = require("express");
const router = express.Router();

router.post("/:companyId/create", createClient)
router.get('/:companyId/',getClients)
router.get('/:companyId/:clientId',getClientsId)
router.put('/:companyId/:clientId',updateClient)

module.exports = router;