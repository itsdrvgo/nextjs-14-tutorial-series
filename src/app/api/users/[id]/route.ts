import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import { safeUserSchema, updateUserSchema } from "@/lib/validations";
import { and, eq, ne } from "drizzle-orm";
import { NextRequest } from "next/server";

interface Context {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, ctx: Context) {
    try {
        const { id } = ctx.params;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, id),
        });
        if (!existingUser) throw new Error("User not found");

        return CResponse({
            message: "OK",
            data: safeUserSchema.parse(existingUser),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest, ctx: Context) {
    try {
        const { id } = ctx.params;
        const body = await req.json();
        const { username } = updateUserSchema.parse(body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, id),
        });
        if (!existingUser) throw new Error("User not found");

        if (username) {
            const existingUserWithSameUsername = await db.query.users.findFirst(
                {
                    where: and(ne(users.id, id), eq(users.username, username)),
                }
            );
            if (existingUserWithSameUsername)
                throw new Error("Username already exists");
        }

        const updatedUser = (
            await db
                .update(users)
                .set({ username })
                .where(eq(users.id, id))
                .returning()
        )[0];

        return CResponse({
            message: "OK",
            data: safeUserSchema.parse(updatedUser),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest, ctx: Context) {
    try {
        const { id } = ctx.params;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, id),
        });
        if (!existingUser) throw new Error("User not found");

        await db.delete(users).where(eq(users.id, id));

        return CResponse({
            message: "OK",
        });
    } catch (err) {
        return handleError(err);
    }
}
