import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "@repo/db/client";
import { DecodeJWT } from "./lib/util.js";
dotenv.config();

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
console.log(Buffer.from(process.env.AUTH_SECRET!, "base64url").length);
const users: User[] = [];
const wss = new WebSocketServer({ port: 8080 });

async function sendPendingUpdate(roomId: string) {
  const pending = await db.default.pendingGuest.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  console.log("Sending pending guests:", pending);
  const room = await db.default.room.findUnique({ where: { id: roomId } });
  if (!room) return;
  users.forEach((u) => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(
        JSON.stringify({
          type: "pending_update",
          pendingUsers: pending,
          roomId,
        })
      );
    }
  });
}

async function sendUsersUpdate(roomId: string) {
  const roomUsers = await db.default.roomUser.findMany({
    where: { roomId },
    include: { user: true },
  });
  const usersList = roomUsers.map((ru) => ({
    id: ru.user.id,
    name: ru.user.name,
    email: ru.user.email,
    permission: ru.permission,
  }));
  console.log("Sending users:", usersList);
  const room = await db.default.room.findUnique({ where: { id: roomId } });
  if (!room) return;
  users.forEach((u) => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(
        JSON.stringify({ type: "users_update", users: usersList, roomId })
      );
    }
  });
}

async function sendApproval(
  userId: string,
  roomId: string,
  status: "approved" | "rejected"
) {
  users.forEach((u) => {
    if (u.userId === userId) {
      u.ws.send(JSON.stringify({ type: "approval", status, roomId }));
    }
  });
}

wss.on("connection", async (ws, req) => {
  console.log("Someone is trying to connect...\n");
  const url = req.url;
  console.log("Request URL:", url);
  if (!url) {
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  console.log("\n\nToken:", token);

  if (!token) {
    console.log("No token provided");
    ws.close();
    return;
  }

  let decoded: any;
  try {
    decoded = await DecodeJWT({
      token,
      secret: process.env.AUTH_SECRET as string,
      salt: process.env.AUTH_SALT as string,
    });
    console.log("Decoded token:", decoded);
  } catch (err) {
    console.log("Invalid token", err);
    ws.close();
    return;
  }
  const userId = decoded?.id || decoded?.sub;
  if (!userId) {
    console.log("Invalid token payload, missing user id");
    ws.close();
    return;
  }
  console.log("User authenticated:", userId);

  users.push({ ws, rooms: [], userId });

  ws.on("close", () => {
    const idx = users.findIndex((u) => u.ws === ws);
    if (idx !== -1) users.splice(idx, 1);
  });

  ws.on("message", async (data) => {
    console.log("Received message:", data);
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      try {
        const roomId = parsedData.roomId;
        if (!roomId) return;
        const user = users.find((x) => x.ws === ws);
        const room = await db.default.room.findUnique({
          where: { id: roomId },
        });
        if (!room) {
          ws.close();
          return;
        }
        if (!user?.rooms.includes(roomId)) user?.rooms.push(roomId);

        const existing = await db.default.roomUser.findUnique({
          where: { roomId_userId: { roomId, userId } },
        });
        if (!existing) {
          await db.default.roomUser.create({
            data: { roomId, userId, permission: "VIEW" },
          });
        }

        await sendUsersUpdate(roomId);
        await sendPendingUpdate(roomId);
      } catch (e) {
        console.log("An error occured", e);
        return;
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
      const roomId = parsedData.roomId;

      try {
        await db.default.roomUser.deleteMany({ where: { roomId, userId } });
        await sendUsersUpdate(roomId);

        ws.send(JSON.stringify({ status: "OK" }));
      } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({ status: "Error" }));
      }
    }

    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const id = parsedData.id;
      const message = parsedData.message;
      try {
        await db.default.chat.create({
          data: { id, roomId, message, userId },
        });
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.userId !== userId) {
            user.ws.send(JSON.stringify({ type: "chat", id, message, roomId }));
          }
        });
      } catch (e) {
        console.log("An error occured", e);
        return;
      }
    } else if (parsedData.type == "eraser") {
      const roomId = parsedData.roomId;
      const id = parsedData.id;
      try {
        const deleted = await db.default.chat.deleteMany({
          where: { id, roomId },
        });
        if (deleted.count > 0) {
          users.forEach((user) => {
            if (user.rooms.includes(roomId) && user.userId !== userId) {
              user.ws.send(JSON.stringify({ type: "eraser", id, roomId }));
            }
          });
        }
      } catch (e) {
        console.log("An error occured", e);
        return;
      }
    } else if (parsedData.type == "clean") {
      const roomId = parsedData.roomId;
      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.userId !== userId) {
          user.ws.send(JSON.stringify({ type: "clean", roomId }));
        }
      });
    } else if (parsedData.type == "update") {
      const roomId = parsedData.roomId;
      const id = parsedData.id;
      const message = parsedData.message;
      try {
        await db.default.chat.update({
          where: { id, roomId },
          data: { message },
        });
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.userId !== userId) {
            user.ws.send(
              JSON.stringify({ type: "update", id, message, roomId })
            );
          }
        });
      } catch (e) {
        console.log("An error occured", e);
        return;
      }
    }

    if (parsedData.type === "pending_guest") {
      const { roomId } = parsedData;
      await sendPendingUpdate(roomId);
    }
    if (parsedData.type === "approve_guest") {
      const { roomId, guestId, approve, permission } = parsedData;
      const guest = await db.default.pendingGuest.findUnique({
        where: { id: guestId },
      });
      if (!guest) return;

      if (approve) {
        const user = await db.default.user.findUnique({
          where: { email: guest.email! },
        });
        if (user) {
          await db.default.roomUser.create({
            data: { roomId, userId: user.id, permission: permission || "VIEW" },
          });
          await db.default.pendingGuest.delete({ where: { id: guestId } });
          await sendApproval(user.id, roomId, "approved");
        }
      } else {
        await db.default.pendingGuest.delete({ where: { id: guestId } });
        const user = await db.default.user.findUnique({
          where: { email: guest.email! },
        });
        if (user) await sendApproval(user.id, roomId, "rejected");
      }
      await sendPendingUpdate(roomId);
      await sendUsersUpdate(roomId);
    }
    if (parsedData.type === "change_permission") {
      const { roomId, userId: targetUserId, permission } = parsedData;
      await db.default.roomUser.update({
        where: { roomId_userId: { roomId, userId: targetUserId } },
        data: { permission },
      });
      await sendUsersUpdate(roomId);
    }
  });
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});
