const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');

router.post('/', commentController.createComment);

module.exports = router;
