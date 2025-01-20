import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logout,
} from "../Controllers/userController";
import { authenticate } from "../Middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username: testuser
 *         email: test@example.com
 *         password: password123
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: test@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /user/refreshToken:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", authenticate, refreshToken);
router.post("/logout", authenticate, logout);

export default router;
