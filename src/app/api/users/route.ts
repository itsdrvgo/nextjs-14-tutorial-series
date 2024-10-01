import {
    createUserSchema,
    safeUsersArraySchema,
    safeUserSchema,
    UserData,
} from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const users: UserData[] = [];

export async function GET() {
    return NextResponse.json(
        {
            data: safeUsersArraySchema.parse(users),
        },
        {
            status: 200,
            statusText: "Ok",
        }
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const user = createUserSchema.parse(body);

        if (users.some((u) => u.username === user.username))
            throw new Error("Username already exists");

        users.push(user);

        return NextResponse.json(
            {
                data: safeUserSchema.parse(user),
            },
            {
                status: 201,
                statusText: "Created",
            }
        );
    } catch (err) {
        if (err instanceof ZodError)
            return NextResponse.json(
                {
                    longMessage: err.issues
                        .map((issue) => issue.message)
                        .join(", "),
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                }
            );
        else if (err instanceof Error)
            return NextResponse.json(
                {
                    longMessage: err.message,
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                }
            );
        else
            return NextResponse.json(
                {
                    longMessage: "An unexpected error occurred",
                },
                {
                    status: 500,
                    statusText: "Internal Server Error",
                }
            );
    }
}
