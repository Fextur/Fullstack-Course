import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../Models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

describe("User Routes API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  let refreshToken: string;
  let accessToken: string;

  const createUser = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    const user = new User({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    });
    await user.save();
  };

  // Test for POST /user/register
  it("should register a new user", async () => {
    const response = await request(app).post("/user/register").send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("username", testUser.username);
    expect(response.body).toHaveProperty("email", testUser.email);
  });

  // Test for POST /user/login
  it("should login a user and return access and refresh tokens", async () => {
    await createUser();

    const response = await request(app).post("/user/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  // Test for POST /user/refreshToken
  it("should refresh tokens when provided with a valid refresh token", async () => {
    await createUser();
    const loginResponse = await request(app).post("/user/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    refreshToken = loginResponse.body.refreshToken;

    const response = await request(app)
      .post("/user/refreshToken")
      .set("Authorization", `JWT ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  // Test for POST /user/logout
  it("should logout the user and invalidate the refresh token", async () => {
    await createUser();
    const loginResponse = await request(app).post("/user/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    refreshToken = loginResponse.body.refreshToken;

    const response = await request(app)
      .post("/user/logout")
      .set("Authorization", `JWT ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged out successfully");

    const user = await User.findOne({ email: testUser.email });
    expect(user?.tokens.includes(refreshToken)).toBe(false);
  });

  // Test for failed login with invalid credentials
  it("should not login with invalid credentials", async () => {
    await createUser();

    const response = await request(app).post("/user/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  // Test for access protected route with invalid token
  it("should deny access to protected routes with an invalid token", async () => {
    const response = await request(app)
      .post("/user/refreshToken")
      .set("Authorization", "JWT invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid or expired token");
  });
});
