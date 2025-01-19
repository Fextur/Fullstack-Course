const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');

router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
