import { db } from "@/lib/drizzle";
import { posts } from "@/lib/drizzle/schema";
import { CResponse, handleError } from "@/lib/utils";
import { createPostSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) throw new Error("User not found");

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
        const form = await req.formData();

        const contentRaw = form.get("content");
        const imageUrlRaw = form.get("imageUrl") ?? null;

        const { content, imageUrl } = createPostSchema.parse({
            content: contentRaw,
            imageUrl: imageUrlRaw,
        });

        const userId = req.headers.get("x-user-id");
        if (!userId) throw new Error("User not found");

        const post = await db
            .insert(posts)
            .values({
                content,
                authorId: userId,
                imageUrl,
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
