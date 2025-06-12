import express from "express";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const AuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: "Unauthenticated" });
      return;
    }
    const user = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: user.id };
    next();
  } catch (error) {
    res.status(400).json({ message: "Middleware Error" });
    return;
  }
};
