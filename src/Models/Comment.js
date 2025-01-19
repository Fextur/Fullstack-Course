const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    sender: { type: String, required: false },
});

module.exports = mongoose.model('Comment', CommentSchema);
