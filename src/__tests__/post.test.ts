import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Post, { IPost } from '../Models/Post';

describe('Posts API', () => {
    // Clear the database before and after tests
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!); // Connect to test DB
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // Drop the database after tests
        await mongoose.disconnect(); // Disconnect from MongoDB
    });

    beforeEach(async () => {
        await Post.deleteMany({}); // Clear all posts before each test
    });

    let createdPostId: string;

    // Test for POST /post
    it('should create a new post', async () => {
        const newPost = {
            title: 'Test Post',
            content: 'This is a test post',
            sender: 'user123',
        };

        const response = await request(app).post('/post').send(newPost);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('title', 'Test Post');
        expect(response.body).toHaveProperty('content', 'This is a test post');
        expect(response.body).toHaveProperty('sender', 'user123');

        createdPostId = response.body._id; // Save the ID for further tests
    });

    // Test for GET /post
    it('should retrieve all posts', async () => {
        const posts = [
            { title: 'First Post', content: 'Content 1', sender: 'user123' },
            { title: 'Second Post', content: 'Content 2', sender: 'user456' },
        ];
        await Post.insertMany(posts); // Add multiple posts to the database

        const response = await request(app).get('/post');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty('title', 'First Post');
    });

    // Test for GET /post/:id
    it('should retrieve a specific post by ID', async () => {
        const post: IPost = new Post({
            title: 'Single Post',
            content: 'This is a single post',
            sender: 'user123',
        });
        await post.save();

        const response = await request(app).get(`/post/${post._id as unknown as string}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', (post._id as mongoose.Types.ObjectId).toString());
        expect(response.body).toHaveProperty('title', 'Single Post');
    });

    it('should return 404 for a non-existent post', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/post/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Post not found');
    });

    // Test for GET /post/sender
    it('should retrieve posts by sender', async () => {
        const posts = [
            { title: 'Sender Post 1', content: 'Content 1', sender: 'user123' },
            { title: 'Sender Post 2', content: 'Content 2', sender: 'user123' },
            { title: 'Other Post', content: 'Content 3', sender: 'user456' },
        ];
        await Post.insertMany(posts);

        const response = await request(app).get('/post/sender').query({ sender: 'user123' });

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body.every((post: any) => post.sender === 'user123')).toBeTruthy();
    });

    it('should return 400 if sender is not provided', async () => {
        const response = await request(app).get('/post/sender');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Sender ID is required');
    });

    // Test for PUT /post/:id
    it('should update a post by ID', async () => {
        const post = new Post({
            title: 'Old Title',
            content: 'Old Content',
            sender: 'user123',
        });
        await post.save();

        const updatedData = {
            title: 'Updated Title',
            content: 'Updated Content',
            sender: 'user123',
        };

        const response = await request(app).put(`/post/${post._id}`).send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', 'Updated Title');
        expect(response.body).toHaveProperty('content', 'Updated Content');
    });

    it('should return 404 when updating a non-existent post', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const updatedData = {
            title: 'Non-existent Title',
            content: 'Non-existent Content',
            sender: 'user123',
        };

        const response = await request(app).put(`/post/${nonExistentId}`).send(updatedData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Post not found');
    });
});
