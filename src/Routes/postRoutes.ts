import express, { Router } from 'express';
import {
    createPost,
    getAllPosts,
    getPostById,
    getPostsBySender,
    updatePost,
} from '../Controllers/postController';

const router: Router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/sender', getPostsBySender);
router.get('/:id', getPostById);
router.put('/:id', updatePost);

export default router;
