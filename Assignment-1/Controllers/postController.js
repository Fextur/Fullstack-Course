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

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
