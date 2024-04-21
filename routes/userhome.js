const express = require('express')
const multer  = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router();

const userhomeController = require('../app/controllers/UserhomeController')

const { error } = require('console');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpge" || file.mimetype === "image/png") {
            cb(null, 'public/img');
        } else {
            cb(new Error('not image'), false);
        }
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${originalname}`);
    }
})

const upload = multer({ storage: storage });

router.get('/', userhomeController.show);
router.post('/', upload.single('imgSrc'), userhomeController.post);

module.exports = router;