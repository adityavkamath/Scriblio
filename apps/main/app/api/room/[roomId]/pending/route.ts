import { auth } from "@/lib/auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const roomId = params.roomId;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

  if (room.adminId === user.id) return NextResponse.json({ ok: true }); 

  const exists = await prisma.pendingGuest.findFirst({ where: { roomId, email: user.email } });
  if (!exists) {
    await prisma.pendingGuest.create({
      data: { roomId, name: user.name, email: user.email },
    });
  }
  return NextResponse.json({ ok: true });
}
