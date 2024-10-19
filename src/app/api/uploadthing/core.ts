import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const cookieStore = cookies();

            const supabase = createRouteHandlerClient({
                cookies: () => cookieStore,
            });

            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error)
                throw new UploadThingError({
                    code: "BAD_REQUEST",
                    message: error.message,
                });

            if (!user)
                throw new UploadThingError({
                    code: "FORBIDDEN",
                    message: "You must be signed in to upload images",
                });

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return {
                name: file.name,
                key: file.key,
                url: file.url,
                uploaderId: metadata.userId,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
