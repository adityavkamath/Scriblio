import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { guestId, approve, permission } = await req.json();
  const guest = await db.pendingGuest.findUnique({ where: { id: guestId } });
  if (!guest)
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });

  if (approve) {
    const user = await db.user.findUnique({ where: { email: guest.email! } });
    if (user) {
      // Add to RoomUser with selected permission (default to VIEW)
      await db.roomUser.create({
        data: {
          roomId: params.roomId,
          userId: user.id,
          permission: permission || "VIEW",
        },
      });
      // Remove from pending
      await db.pendingGuest.delete({ where: { id: guestId } });
    } else {
      return NextResponse.json(
        { error: "User not found. Please ask them to sign up first.", success: true },
        { status: 400 },
      );
    }
  } else {
    await db.pendingGuest.delete({ where: { id: guestId } });
  }

  return NextResponse.json({ success: true });
}