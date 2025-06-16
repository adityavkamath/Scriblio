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
    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { users: true },
    });

    if (!room) return new NextResponse("Room not found", { status: 404 });

    const updatedUsers = room.users.filter((user) => user.id !== userId);
    if (updatedUsers.length === 0) {
      await db.chat.deleteMany({ where: { roomId } });
      await db.room.delete({ where: { id: roomId } });
      return new NextResponse("Room deleted");
    }

    await db.room.update({
      where: { id: roomId },
      data: {
        users: {
          set: updatedUsers.map((u) => ({ id: u.id })),
        },
      },
    });
    return new NextResponse("Left room");
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
