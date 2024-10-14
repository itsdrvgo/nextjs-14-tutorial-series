import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import { safeUserSchema, signInSchema } from "@/lib/validations";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = signInSchema.parse(body);

        const cookieStore = cookies();

        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore,
        });

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (!existingUser) throw new Error("User not found");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const { session } = data;

        await supabase.auth.setSession(session);

        return CResponse({
            message: "OK",
            data: safeUserSchema.parse(existingUser),
        });
    } catch (err) {
        return handleError(err);
    }
}
