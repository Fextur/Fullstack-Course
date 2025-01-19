import express, { Router } from 'express';
import {
    createComment,
    getAllComments,
    updateComment,
    deleteComment,
    getCommentsByPostId,
} from '../Controllers/commentController';

const router: Router = express.Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

router.get('/post/:postId', getCommentsByPostId);

export default router;
