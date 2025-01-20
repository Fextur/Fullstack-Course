import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../app";
import Post, { IPost } from "../Models/Post";
import User from "../Models/User";

describe("Posts API", () => {
  let user: any;
  let refreshToken: string;

  const createUserAndLogin = async () => {
    const testUser = {
      username: "testuser2",
      email: "test2@example.com",
      password: "password123",
    };

    // Create user with encrypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    user = new User({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    });
    await user.save();

    // Log in the user to get the refresh token
    const loginResponse = await request(app)
      .post("/user/login")
      .send({ email: testUser.email, password: testUser.password });

    refreshToken = loginResponse.body.refreshToken;
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear the database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await createUserAndLogin(); // Recreate user and get refresh token
  });

  it("should create a new post", async () => {
    const newPost = { title: "Test Post", content: "This is a test post" };

    const response = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${refreshToken}`)
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("title", "Test Post");
    expect(response.body).toHaveProperty("content", "This is a test post");
    expect(response.body).toHaveProperty("user", user._id.toString());
  });

  it("should retrieve all posts", async () => {
    await Post.create([
      { title: "Post 1", content: "Content 1", user: user._id },
      { title: "Post 2", content: "Content 2", user: user._id },
      { title: "Post 3", content: "Content 2", user: user._id },
    ]);

    const response = await request(app).get("/post");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
  });

  it("should retrieve a specific post by ID", async () => {
    const post = await Post.create({
      title: "Test Post",
      content: "Test Content",
      user: user._id,
    });

    const response = await request(app).get(
      `/post/${(post._id as any).toString()}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", (post._id as any).toString());
    expect(response.body).toHaveProperty("title", "Test Post");
  });

  it("should update a post by ID", async () => {
    const post = await Post.create({
      title: "Old Title",
      content: "Old Content",
      user: user._id,
    });

    const updatedData = { title: "Updated Title", content: "Updated Content" };

    const response = await request(app)
      .put(`/post/${post._id}`)
      .set("Authorization", `JWT ${refreshToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Title");
    expect(response.body).toHaveProperty("content", "Updated Content");
  });
});
