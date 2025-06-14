import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      user: { id: string };
    }
  }
}

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Unauthenticated" });
      return;
    }
    console.log("Token received");

    const decoded = jwt.verify(token, JWT_SECRET) as { user: string };
    console.log("Decoded:", decoded);

    req.user = { id: decoded.user };
    console.log("req.user:", req.user);

    next();
  } catch (error) {
    res.status(400).json({ message: "Middleware Error" });
    return;
  }
};
