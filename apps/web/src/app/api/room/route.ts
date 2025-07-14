import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid"
import { CreateRoomSchema } from "@repo/schemas/userschema";
import dbClient from "@repo/database/dbclient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = CreateRoomSchema.safeParse(body)
        if (!result.success) {
            console.log("Validation error:", result.error.issues);
            const errorMessage = result.error.issues.map(issue => issue.message).join(", ");
            return NextResponse.json({ error: `Invalid data: ${errorMessage}` }, { status: 400 });
        }

        const token = await getToken({ req, secret: process.env.AUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = token.id as string
        const room = await dbClient.room.create({
            data: {
                id: generateRoomID(),
                slug: result.data.name,
                adminId: userId,
                shareToken: generateShareToken(),
                users: {
                    connect: [{ id: userId }]
                }
            }
        })
        return NextResponse.json({
            message: "Room created successfully",
            roomId: room.id,
            shareToken: room.shareToken
        }, { status: 201 })
    } catch (err) {
        console.error("Error creating room:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const roomId = body.id;
        const token = await getToken({ req, secret: process.env.AUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = token.id as string;
        const room = await dbClient.room.findUnique({
            where: { shareToken: roomId },
            include: { users: true }
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }
        const isUserInRoom = room.users.some(user => user.id === userId);
        if (isUserInRoom) {
            return NextResponse.json({ message: "User already in room" }, { status: 200 });
        }

        const updatedRoom = await dbClient.room.update({
            where: { shareToken: roomId },
            data: { users: { connect: { id: userId } } }
        });

        return NextResponse.json({ message: "User added successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error joining room:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const Roomid = searchParams.get("id[]")
        const token = await getToken({ req, secret: process.env.AUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!Roomid) {
            return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
        }
        const userId = token.id as string;
        const room = await dbClient.room.findUnique({
            where: {
                shareToken: Roomid
            }
            , include: {
                users: true
            }
        })
        const users = room?.users;
        if (!users) {
            return NextResponse.json({ error: "unable to fetch users" }, { status: 404 });
        }
        const roomUsers = users
            .filter((u) => u.id !== userId)
            .map((u) => ({ id: u.id }));
        return NextResponse.json({ users: roomUsers }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

function generateRoomID(): string {
    return uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();
}

function generateShareToken(): string {
    return uuidv4().replace(/-/g, "");
}