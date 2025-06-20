import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const params = await context.params;
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Find the user by email
  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Fetch the room and admin
  const room = await db.room.findUnique({
    where: { id: params.roomId },
    include: {
      pending: true,
      admin: true,
      RoomUser: { include: { user: true } },
    },
  });
  if (!room)
    return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Check membership and permission using RoomUser
  const roomUser = await db.roomUser.findUnique({
    where: { roomId_userId: { roomId: params.roomId, userId: user.id } },
  });

  const isMember = !!roomUser;
  const permission = roomUser?.permission ?? null;
  const isPending = room.pending.some((p) => p.email === session.user.email);

  return NextResponse.json({
    isAdmin: room.admin.email === session.user.email,
    isMember,
    isPending,
    permission,
    room,
  });
}
