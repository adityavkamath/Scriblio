import express, { Router } from "express";
const app = express();
import {
  CheckRoomExistsController,
  ClearChatController,
  CreateRoomController,
  GetAllRoomsController,
  GetChatMeesagesController,
  JoinRoomController,
  LeaveRoomController,
} from "../controller/roomController";
import { AuthMiddleware } from "../middleware/authMiddleware";
const roomRouter: Router = Router();

roomRouter.use(AuthMiddleware);

roomRouter.post("/create-room", CreateRoomController);
roomRouter.get("/join-room/:roomId", JoinRoomController);
roomRouter.get("/chats/:roomId", GetChatMeesagesController);
roomRouter.get("/room/:roomId", CheckRoomExistsController);
roomRouter.get("/rooms", GetAllRoomsController);
roomRouter.post("/clear", ClearChatController);
roomRouter.post("/leave-room", LeaveRoomController);

export default roomRouter;
