const {createClient,getClients} = require('../controllers/clientController')
const express = require("express");
const router = express.Router();

router.post("/:companyId/create", createClient)
router.get('/:companyId/',getClients)

module.exports = router;