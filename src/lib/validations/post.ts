import { z } from "zod";

export const postSchema = z.object({
    id: z.string().min(1, "ID is required"),
    authorId: z.string().min(1, "Author ID is required"),
    content: z
        .string({
            required_error: "Content is required",
        })
        .min(3, "Content must be at least 3 characters long")
        .max(2000, "Content must be at most 2000 characters long"),
    imageUrl: z.string().min(1, "Image URL is required").url().nullable(),
    createdAt: z.date(),
});

export const createPostSchema = postSchema.pick({
    content: true,
    imageUrl: true,
});

export type PostData = z.infer<typeof postSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
