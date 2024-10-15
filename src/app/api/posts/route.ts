import { db } from "@/lib/drizzle";
import { posts, users } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import { createPostSchema } from "@/lib/validations";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const cookieStore = cookies();

        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore,
        });

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, data.user.id),
        });
        if (!existingUser) throw new Error("User not found");

        const userPosts = await db.query.posts.findMany({
            with: {
                author: true,
            },
        });

        return CResponse({
            message: "OK",
            data: userPosts,
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content } = createPostSchema.parse(body);

        const cookieStore = cookies();

        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore,
        });

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, data.user.id),
        });
        if (!existingUser) throw new Error("User not found");

        const post = await db
            .insert(posts)
            .values({
                content,
                authorId: existingUser.id,
            })
            .returning()
            .then((res) => res[0]);

        return CResponse({
            message: "CREATED",
            data: post,
        });
    } catch (err) {
        return handleError(err);
    }
}
