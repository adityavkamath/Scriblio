import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await db.room.findUnique({ where: { id: params.roomId } });
    if (!room) {
      return new NextResponse(JSON.stringify({ message: "Room not found" }), {
        status: 404,
      });
    }
    return NextResponse.json({ message: "Room exists" });
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
