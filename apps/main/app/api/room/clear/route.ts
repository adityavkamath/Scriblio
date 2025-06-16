import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomId } = body;
  if (!roomId) return new NextResponse("Missing room ID", { status: 400 });

  try {
    await db.chat.deleteMany({ where: { roomId } });
    return new NextResponse("Chat cleared");
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
