import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { roomId } = body;
  if (!roomId) return new NextResponse("Missing room ID", { status: 400 });

  try {
    // Remove from RoomUser
    await db.roomUser.deleteMany({ where: { roomId, userId } });

    // If no users left, delete room and chats
    const remaining = await db.roomUser.count({ where: { roomId } });
    if (remaining === 0) {
      await db.chat.deleteMany({ where: { roomId } });
      await db.room.delete({ where: { id: roomId } });
      return new NextResponse("Room deleted");
    }

    return new NextResponse("Left room");
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
