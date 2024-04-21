const express = require('express')
const router = express.Router();

const onlineController = require('../app/controllers/OnlineController')

router.get('/', onlineController.show)
router.post('/', onlineController.block)

module.exports = router;