import { Request, Response } from 'express';
import Post from '../Models/Post';
import { handleError } from '../utils';

export const createPost = async (req: Request, res: Response): Promise<void> => {
        try {
        const { title, content, sender } = req.body;
        const post = new Post({ title, content, sender });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: handleError(err) });
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: handleError(err)  });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)  {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: handleError(err)  });
    }
};

export const getPostsBySender = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender } = req.query;
        if (!sender) {
            res.status(400).json({ error: 'Sender ID is required' });
            return;
        }
        const posts = await Post.find({ sender });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: handleError(err)  });
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, sender } = req.body;

        const post = await Post.findByIdAndUpdate(
            id,
            { title, content, sender },
            { new: true, runValidators: true } 
        );

        if (!post) { 
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: handleError(err)  });
    }
};
