import { auth } from "@/lib/auth";
import { CreateRoomSchema } from "@repo/common/types";
import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateRoomSchema.safeParse(body);

  if (!parsed.success) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  const session = await auth();
  console.log("SESSION:", session);

  if (!session.user.id) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  const userId = session.user.id;
  const { name } = parsed.data;
  const roomId = uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();

  try {
    await db.room.create({
      data: {
        id: roomId,
        slug: name,
        adminId: userId,
        RoomUser: {
          create: [{ userId, permission: "WRITE" }],
        },
      },
    });
    return NextResponse.json({ message: "Room created", roomId });
  } catch (e) {
    console.error(e);
    return new NextResponse("Server error", { status: 500 });
  }
}
