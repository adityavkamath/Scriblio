import express, { RequestHandler, Request, Response } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
const app = express();

app.use(AuthMiddleware);
export const CreateRoomController: RequestHandler = async (
  req: Request,
  res: Response
) => {};
