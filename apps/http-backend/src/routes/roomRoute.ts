import express, { Router } from "express";
import { CreateRoomController } from "../controller/roomController.js";
const roomRouter: Router = Router();

roomRouter.post("/create-room" , CreateRoomController);

export default roomRouter;
