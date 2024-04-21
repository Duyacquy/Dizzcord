const express = require('express')
const router = express.Router();

const allController = require('../app/controllers/AllController')

router.get('/', allController.show)
router.post('/', allController.restrict)

module.exports = router;