import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (error, user) => {
    if (error) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    req.user = user;
    next();
  });
};
