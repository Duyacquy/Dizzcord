const express = require('express')
const router = express.Router();

const messageController = require('../app/controllers/MessageController')

router.get('/', messageController.show);
router.post('/', messageController.shown);
router.post('/restrict', messageController.restrict);


module.exports = router;