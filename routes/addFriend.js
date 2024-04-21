const express = require('express')
const router = express.Router();

const addFriendController = require('../app/controllers/AddFriendController')

router.get('/', addFriendController.show);
router.post('/', addFriendController.searchAndBlock)


module.exports = router;