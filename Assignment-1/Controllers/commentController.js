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

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, sender } = req.body;

        const comment = await Comment.findByIdAndUpdate(
            id,
            { content, sender },
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
