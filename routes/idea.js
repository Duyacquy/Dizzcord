const express = require('express')
const router = express.Router();

const ideaController = require('../app/controllers/IdeaController')

router.get('/', ideaController.show)

module.exports = router;