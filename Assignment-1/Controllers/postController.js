const Post = require('../Models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, content, sender } = req.body;
        const post = new Post({ title, content, sender });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
