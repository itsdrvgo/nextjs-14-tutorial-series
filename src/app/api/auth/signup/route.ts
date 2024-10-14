import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import { safeUserSchema, signUpSchema } from "@/lib/validations";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username } = signUpSchema.parse(body);

        const cookieStore = cookies();

        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore,
        });

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        const { user, session } = data;
        if (!user || !session)
            throw new Error("An error occurred while signing up");

        await supabase.auth.setSession(session);

        const newUser = (
            await db
                .insert(users)
                .values({
                    id: user.id,
                    email,
                    username,
                })
                .returning()
        )[0];

        return CResponse({
            message: "CREATED",
            data: safeUserSchema.parse(newUser),
        });
    } catch (err) {
        return handleError(err);
    }
}
