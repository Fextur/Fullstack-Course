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

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostsBySender = async (req, res) => {
    try {
        const { sender } = req.query;
        if (!sender) {
            return res.status(400).json({ error: 'Sender ID is required' });
        }
        const posts = await Post.find({ sender });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, sender } = req.body;

        const post = await Post.findByIdAndUpdate(
            id,
            { title, content, sender },
            { new: true, runValidators: true } 
        );

        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
