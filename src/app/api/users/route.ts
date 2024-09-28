import { NextRequest, NextResponse } from "next/server";

interface User {
    id: number;
    username: string;
    createdAt: Date;
}

const users: User[] = [];

export async function GET() {
    return NextResponse.json(
        {
            data: users,
        },
        {
            status: 200,
            statusText: "Ok",
        }
    );
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    const user = {
        id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
        createdAt: new Date(),
        ...body,
    };

    users.push(user);

    return NextResponse.json(
        {
            data: user,
        },
        {
            status: 201,
            statusText: "Created",
        }
    );
}
