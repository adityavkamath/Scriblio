import express, { RequestHandler, Request, Response } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { CreateRoomSchema } from "@repo/common/types";
import { v4 as uuidv4 } from "uuid";
import db from "@repo/db/client";
const app = express();

const generateRoomID = (): string => {
  return uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();
};

export const CreateRoomController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(401).json({
      message: "Invalid Credentials",
    });
    return;
  }
  const userId = req.user.id;
  if (!userId) {
    res.status(401).json({
      message: "Unauthenticated",
    });
    return;
  }
  const { name } = parsedData.data;
  try {
    const roomId = generateRoomID();
    const room = await db.room.create({
      data: {
        id: roomId,
        slug: name,
        adminId: userId,
        users: {
          connect: [{ id: userId }],
        },
      },
    });
    res.status(200).json({
      message: "Room created successfully",
      roomId: room.id,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const JoinRoomController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const roomId = req.params.roomId;
  try {
    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (room) {
      res.status(200).json({
        message: "Room found",
      });
    } else {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const GetChatMeesagesController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const roomId = req.params.roomId;
  try {
    const messages = await db.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "asc",
      },
      take: 100,
    });
    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const CheckRoomExistsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    res.status(400).json({
      message: "Room ID is required",
    });
    return;
  }
  try {
    const room = await db.room.findFirst({
      where: {
        id: roomId,
      },
    });
    if (!room) {
      res.status(404).json({ message: "Room doesnt exist" });
      return;
    }
    res.status(200).json({ message: "RoomExist" });
  } catch (error) {
    console.error("Error checking room existence:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const GetAllRoomsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        rooms: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const data = {
      userId: user.id,
      userName: user.name,
      rooms: user.rooms.map((room: any) => ({
        roomId: room.id,
        slug: room.slug,
        createdAt: room.createdAt
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        participants: room.users.map((participant: any) =>
          participant.id === user.id ? "You" : participant.name
        ),
        noOfParticipants: room.users.length,
      })),
    };

    res.status(200).json({
      messages: data,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const ClearChatController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const roomId = req.body.roomId;
  if (!roomId) {
    res.status(400).json({
      message: "Room ID is required",
    });
    return;
  }
  try {
    await db.chat.deleteMany({
      where: {
        roomId: roomId,
      },
    });
    res.status(200).json({
      message: "Chat cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const LeaveRoomController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;
  const roomId = req.body.roomId;
  if (!roomId || roomId == "") {
    res.status(400).json({ message: "Invalid or missing roomId" });
    return;
  }
  try {
    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: { users: true },
    });
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const updatedUsers = room.users.filter((user) => user.id !== userId);
    if (updatedUsers.length === 0) {
      await db.chat.deleteMany({
        where: { roomId },
      });
      await db.room.delete({
        where: { id: roomId },
      });
      res.status(200).json({ message: "Room Deleted Successfully" });
      return;
    }

    await db.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          set: updatedUsers.map((user) => ({ id: user.id })),
        },
      },
    });
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

