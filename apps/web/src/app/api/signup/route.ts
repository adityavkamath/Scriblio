import { NextRequest, NextResponse } from 'next/server';
import dbClient from '@repo/database/dbclient';
import { encryptPassword } from '@/lib/server/util';
import { signInSchema } from '@repo/schemas/userschema';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = await signInSchema.parseAsync(body);
        const existing = await dbClient.user.findUnique({
            where: { email },
        });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await encryptPassword(password);
        const newUser = await dbClient.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "User created", user: newUser });
    } catch (err) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}

