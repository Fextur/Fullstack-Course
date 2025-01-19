import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Comment, { IComment } from '../Models/Comment';

describe('Comments API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase(); 
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await Comment.deleteMany({});
    });

    let createdCommentId: string;

    // Test for POST /comment
    it('should create a new comment', async () => {
        const newComment = {
            content: 'This is a test comment',
            postId: new mongoose.Types.ObjectId().toString(),
            sender: 'user123',
        };

        const response = await request(app).post('/comment').send(newComment);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content', 'This is a test comment');
        expect(response.body).toHaveProperty('postId', newComment.postId);
        expect(response.body).toHaveProperty('sender', 'user123');

        createdCommentId = response.body._id; 
    });

    // Test for GET /comment
    it('should retrieve all comments', async () => {
        const comments = [
            { content: 'First Comment', postId: new mongoose.Types.ObjectId().toString(), sender: 'user123' },
            { content: 'Second Comment', postId: new mongoose.Types.ObjectId().toString(), sender: 'user456' },
        ];
        await Comment.insertMany(comments);

        const response = await request(app).get('/comment');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty('content', 'First Comment');
    });

    // Test for GET /comment/post/:postId
    it('should retrieve comments by postId', async () => {
        const postId = new mongoose.Types.ObjectId().toString();
        const comments = [
            { content: 'Comment 1', postId, sender: 'user123' },
            { content: 'Comment 2', postId, sender: 'user456' },
        ];
        await Comment.insertMany(comments);

        const response = await request(app).get(`/comment/post/${postId}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body.every((comment: IComment) => comment.postId.toString() === postId)).toBeTruthy();
    });

    // Test for PUT /comment/:id
    it('should update a comment by ID', async () => {
        const comment = new Comment({
            content: 'Original Content',
            postId: new mongoose.Types.ObjectId().toString(),
            sender: 'user123',
        });
        await comment.save();

        const updatedData = { content: 'Updated Content', sender: 'user123' };

        const response = await request(app).put(`/comment/${comment._id}`).send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('content', 'Updated Content');
    });

    it('should return 404 when updating a non-existent comment', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const updatedData = { content: 'Non-existent Content', sender: 'user123' };

        const response = await request(app).put(`/comment/${nonExistentId}`).send(updatedData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Comment not found');
    });

    // Test for DELETE /comment/:id
    it('should delete a comment by ID', async () => {
        const comment = new Comment({
            content: 'Delete Me',
            postId: new mongoose.Types.ObjectId().toString(),
            sender: 'user123',
        });
        await comment.save();

        const response = await request(app).delete(`/comment/${comment._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
    });

    it('should return 404 when deleting a non-existent comment', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();

        const response = await request(app).delete(`/comment/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Comment not found');
    });
});
