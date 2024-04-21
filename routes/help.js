const express = require('express')
const router = express.Router();

const helpController = require('../app/controllers/HelpController')

router.get('/', helpController.show)

module.exports = router;