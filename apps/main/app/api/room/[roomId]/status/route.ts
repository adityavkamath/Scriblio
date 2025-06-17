import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { roomId: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await db.room.findUnique({
    where: { id: params.roomId },
    include: { 
      users: true,
      pending: true,
      admin: true 
    }
  });

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const isMember = room.users.some(u => u.email === session.user.email);
  const isPending = room.pending.some(p => p.email === session.user.email);
  
  return NextResponse.json({
    isAdmin: room.admin.email === session.user.email,
    isMember,
    isPending,
    room
  });
}
