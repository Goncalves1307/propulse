const {createClient,getClients,getClientsId,updateClient,deleteClient} = require('../controllers/clientController')
const express = require("express");
const router = express.Router();

router.post("/:companyId/create", createClient)
router.get('/:companyId/',getClients)
router.get('/:companyId/:clientId',getClientsId)
router.put('/:companyId/:clientId',updateClient)
router.delete('/:companyId/:clientId',deleteClient)

module.exports = router;