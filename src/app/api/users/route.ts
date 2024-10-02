import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import {
    createUserSchema,
    safeUsersArraySchema,
    safeUserSchema,
} from "@/lib/validations";
import { DrizzleError, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
    try {
        const allUsers = await db.query.users.findMany();

        return NextResponse.json(
            {
                data: safeUsersArraySchema.parse(allUsers),
            },
            {
                status: 200,
                statusText: "Ok",
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
        else if (err instanceof DrizzleError)
            return NextResponse.json(
                {
                    longMessage: err.message,
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const user = createUserSchema.parse(body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, user.username),
        });
        if (existingUser) throw new Error("Username already exists");

        const newUser = (await db.insert(users).values(user).returning())[0];

        return NextResponse.json(
            {
                data: safeUserSchema.parse(newUser),
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
        else if (err instanceof DrizzleError)
            return NextResponse.json(
                {
                    longMessage: err.message,
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
