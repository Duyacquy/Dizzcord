const express = require('express')
const router = express.Router();

const signupController = require('../app/controllers/SignupController')

router.get('/', signupController.show)
router.post('/', signupController.submit)

module.exports = router;