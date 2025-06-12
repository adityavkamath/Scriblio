import express, { RequestHandler, Request, Response } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
const app = express();

app.use(AuthMiddleware);
export const CreateRoomController: RequestHandler = async (
  req: Request,
  res: Response
) => {};
