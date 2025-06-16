import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { NextResponse , NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        rooms: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const data = {
      userId: user!.id,
      userName: user!.name,
      rooms: user!.rooms.map((room: any) => ({
        roomId: room.id,
        slug: room.slug,
        createdAt: room.createdAt.toISOString().slice(0, 10).split("-").reverse().join("-"),
        participants: room.users.map((u: any) => u.id === userId ? "You" : u.name),
        noOfParticipants: room.users.length,
      })),
    };

    return NextResponse.json({ messages: data });
  } catch (e) {
    console.error("Error fetching rooms:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
