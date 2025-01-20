import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../app";
import Comment from "../Models/Comment";
import User from "../Models/User";
import Post from "../Models/Post";

describe("Comments API", () => {
  let user: any;
  let otherUser: any;
  let refreshToken: string;
  let otherUserRefreshToken: string;
  let post: any;

  const createUserAndLogin = async () => {
    const testUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    user = new User({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    });
    await user.save();

    const loginResponse = await request(app)
      .post("/user/login")
      .send({ email: testUser.email, password: testUser.password });

    refreshToken = loginResponse.body.refreshToken;
  };

  const createOtherUserAndLogin = async () => {
    const testOtherUser = {
      username: "otheruser",
      email: "other@example.com",
      password: "password456",
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testOtherUser.password, salt);
    otherUser = new User({
      username: testOtherUser.username,
      email: testOtherUser.email,
      password: hashedPassword,
    });
    await otherUser.save();

    const loginResponse = await request(app)
      .post("/user/login")
      .send({ email: testOtherUser.email, password: testOtherUser.password });

    otherUserRefreshToken = loginResponse.body.refreshToken;
  };

  const createPost = async () => {
    post = await Post.create({
      title: "Sample Post",
      content: "This is a test post.",
      user: user._id,
    });
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await createUserAndLogin();
    await createOtherUserAndLogin();
    await createPost();
  });

  it("should create a new comment", async () => {
    const newComment = {
      content: "This is a test comment",
      postId: post._id,
    };

    const response = await request(app)
      .post("/comment")
      .set("Authorization", `JWT ${refreshToken}`)
      .send(newComment);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("content", "This is a test comment");
    expect(response.body).toHaveProperty("postId", post._id.toString());
    expect(response.body).toHaveProperty("user", user._id.toString());
  });

  it("should retrieve all comments", async () => {
    await Comment.create([
      { content: "Comment 1", postId: post._id, user: user._id },
      { content: "Comment 2", postId: post._id, user: user._id },
    ]);

    const response = await request(app).get("/comment");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("content", "Comment 1");
  });

  it("should retrieve comments by postId", async () => {
    const comments = [
      { content: "Comment 1", postId: post._id, user: user._id },
      { content: "Comment 2", postId: post._id, user: user._id },
    ];
    await Comment.insertMany(comments);

    const response = await request(app).get(`/comment/post/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(
      response.body.every(
        (comment: any) => comment.postId === post._id.toString()
      )
    ).toBeTruthy();
  });

  it("should update a comment by ID", async () => {
    const comment = await Comment.create({
      content: "Original Content",
      postId: post._id,
      user: user._id,
    });

    const updatedData = { content: "Updated Content" };

    const response = await request(app)
      .put(`/comment/${comment._id}`)
      .set("Authorization", `JWT ${refreshToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("content", "Updated Content");
  });

  it("should return 404 when updating a non-existent comment", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = { content: "Updated Content" };

    const response = await request(app)
      .put(`/comment/${nonExistentId}`)
      .set("Authorization", `JWT ${refreshToken}`)
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Comment not found");
  });

  it("should delete a comment made by the logged-in user", async () => {
    const comment = await Comment.create({
      content: "Delete Me",
      postId: post._id,
      user: user._id,
    });

    const response = await request(app)
      .delete(`/comment/${comment._id}`)
      .set("Authorization", `JWT ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Comment deleted successfully"
    );
  });

  it("should not allow a user to delete another user's comment", async () => {
    const comment = await Comment.create({
      content: "Not Your Comment",
      postId: post._id,
      user: otherUser._id,
    });

    const response = await request(app)
      .delete(`/comment/${comment._id}`)
      .set("Authorization", `JWT ${refreshToken}`);

    expect(response.status).toBe(405);
    expect(response.body).toHaveProperty("error", "Not comment owner");
  });

  it("should return 404 when trying to delete a non-existent comment", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/comment/${nonExistentId}`)
      .set("Authorization", `JWT ${refreshToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Comment not found");
  });
});
