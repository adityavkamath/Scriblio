import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = await params.roomId;
    const messages = await db.chat.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
      take: 100,
    });
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("GET /room/[roomId] error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
