import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Get all RoomUser entries for this user, include room and users in the room
    const roomUsers = await db.roomUser.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            RoomUser: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      // Remove orderBy: { createdAt: "desc" }, because RoomUser has no createdAt
    });

    const data = {
      userId: session.user.id,
      userName: session.user.name,
      rooms: roomUsers.map((ru) => ({
        roomId: ru.room.id,
        slug: ru.room.slug,
        // Remove or replace createdAt if you want, or use ru.room.createdAt
        createdAt: ru.room.createdAt
          ? ru.room.createdAt
              .toISOString()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("-")
          : null,
        participants: ru.room.RoomUser.map((rUser) =>
          rUser.userId === userId ? "You" : rUser.user.name
        ),
        noOfParticipants: ru.room.RoomUser.length,
        permission: ru.permission,
      })),
    };

    return NextResponse.json({ messages: data });
  } catch (e) {
    console.error("Error fetching rooms:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
