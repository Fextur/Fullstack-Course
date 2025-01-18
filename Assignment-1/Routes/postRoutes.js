const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');

router.post('/', postController.createPost);

module.exports = router;
