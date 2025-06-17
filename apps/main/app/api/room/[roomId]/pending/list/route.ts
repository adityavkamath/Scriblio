import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId;
  const room = await db.room.findUnique({ where: { id: roomId } });
  const adminId = room?.adminId;
  let guests = await db.pendingGuest.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  if (adminId) {
    const admin = await db.user.findUnique({ where: { id: adminId } });
    guests = guests.filter((g) => g.email !== admin?.email);
  }
  return NextResponse.json({ guests });
}
