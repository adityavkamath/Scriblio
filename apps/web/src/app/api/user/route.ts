import dbClient from "@repo/database/dbclient";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized access!!" }, { status: 401 })
        }
        const userId = token.id as string;
        const userRooms = await dbClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                rooms: true
            }
        })
        if (!userRooms) {
            return NextResponse.json({ error: "Unable to fetch Room!!" }, { status: 301 })
        }
        const rooms = userRooms.rooms;
        return NextResponse.json({ message: "Rooms fetch success!!", rooms }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server Error" }, { status: 501 })
    }
}