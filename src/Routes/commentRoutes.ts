import express, { Router } from "express";
import {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} from "../Controllers/commentController";
import { authenticate } from "../Middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - postId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         postId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         user:
 *           type: string
 *           description: ID of the user who created the comment
 *       example:
 *         id: "63f1a28e38d6b8a3a5f35a20"
 *         content: "This is a great post!"
 *         postId: "63f1a28e38d6b8a3a5f35a10"
 *         user: "63f1a28e38d6b8a3a5f35a10"
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *             example:
 *               content: "This is a test comment."
 *               postId: "63f1a28e38d6b8a3a5f35a10"
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Retrieve all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *             example:
 *               content: "Updated comment content."
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: User is not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comment/post/{postId}:
 *   get:
 *     summary: Retrieve comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A list of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post not found or no comments
 */

router.post("/", authenticate, createComment);
router.get("/", getAllComments);
router.put("/:id", authenticate, updateComment);
router.delete("/:id", authenticate, deleteComment);
router.get("/post/:postId", getCommentsByPostId);

export default router;
