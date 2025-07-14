import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET, raw: true })
        if (!token) {
            return NextResponse.json({ "message": "Unauthorized user" }, { status: 401 })
        }
        return NextResponse.json({ message: "token Fetch success!!",token }, { status: 201 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ "message": "Internal server Error" }, { status: 501 })
    }

}