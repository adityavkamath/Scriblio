import express from "express";
const app = express();
import { RequestHandler, Request, Response } from "express";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config()
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const SignupController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const parsedBody = CreateUserSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
    return;
  }
  const { email, password, name, photo } = parsedBody.data!;
  try {
    const existingUser = await db.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ message: "User already exist" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        photo,
      },
    });
    if (!user) {
      res.status(500).json({ message: "User not created" });
      return;
    }
    res
      .status(201)
      .json({ message: "user created successfully", user: user.id });
  } catch (err) {
    console.log("Error in SignupController:\n", err);
    res.status(500).json({ message: "Internal server Error" });
    return;
  }
};

export const SigninController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const parsedBody = SigninSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
    return;
  }
  const { email, password } = parsedBody.data;
  try {
    const user = await db.user.findFirst({
      where: { email },
    });
    if (!user) {
      res.status(301).json({ message: "Please Sign-Up" });
      return;
    }
    const hashedPassword = user.password;
    const original = bcrypt.compare(hashedPassword, password);
    if (!original) {
      res.status(301).json({
        message: "Invalid Password",
      });
      return;
    }
    const token = jwt.sign({ user: user.id }, JWT_SECRET);
    res
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "User Logged In",
      });
    return;
  } catch (err) {
    console.log("Error in SigninController:\n", err);
    res.status(500).json({ message: "Internal server Error" });
    return;
  }
};
