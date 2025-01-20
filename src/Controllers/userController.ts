import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { IUser } from "../Models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Invalid user input" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: encryptedPassword });
    const newUser = await user.save();

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRATION,
      }
    );
    const refreshToken = await jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET!
    );

    if (user.tokens === null) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.user);
  if (
    !user ||
    !user.tokens.includes(req.headers.authorization!.split(" ")[1])
  ) {
    res.sendStatus(403);
    return;
  }

  const accessToken = await jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
  );
  const refreshToken = await jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET!
  );

  user.tokens[user.tokens.indexOf(req.headers.authorization!.split(" ")[1])] =
    refreshToken;
  await user.save();

  res.status(200).json({ accessToken, refreshToken });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const tokenIndex = user.tokens.indexOf(
    req.headers.authorization!.split(" ")[1]
  );
  if (tokenIndex === -1) {
    res.sendStatus(403);
    return;
  }

  user.tokens.splice(tokenIndex, 1);
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
};
