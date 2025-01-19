const Comment = require('../Models/Comment');

exports.createComment = async (req, res) => {
    try {
        const { content, postId, sender } = req.body;

        const comment = new Comment({ content, postId, sender });
        await comment.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
