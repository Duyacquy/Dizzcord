const express = require('express')
const router = express.Router();

const awaitController = require('../app/controllers/AwaitController')

router.get('/', awaitController.show);
router.post('/', awaitController.addAndBlock); 

module.exports = router;