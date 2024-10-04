import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import {
    createUserSchema,
    safeUsersArraySchema,
    safeUserSchema,
} from "@/lib/validations";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const allUsers = await db.query.users.findMany();

        return CResponse({
            message: "OK",
            data: safeUsersArraySchema.parse(allUsers),
        });
    } catch (err) {
        return handleError(err);
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

        return CResponse({
            message: "CREATED",
            data: safeUserSchema.parse(newUser),
        });
    } catch (err) {
        return handleError(err);
    }
}
