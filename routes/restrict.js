const express = require('express')
const router = express.Router();

const restrictController = require('../app/controllers/RestrictController')

router.get('/', restrictController.show);
router.post('/', restrictController.unblockAndBlock)

module.exports = router;