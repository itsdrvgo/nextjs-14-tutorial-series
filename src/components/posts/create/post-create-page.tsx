"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cFetch } from "@/lib/utils";
import {
    CreatePostData,
    createPostSchema,
    ResponseData,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function PostCreatePage() {
    const router = useRouter();

    const form = useForm<CreatePostData>({
        resolver: zodResolver(createPostSchema),
    });

    const { mutate: createPost, isPending } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Creating post...");
            return { toastId };
        },
        mutationFn: async (values: CreatePostData) => {
            const data = await cFetch<ResponseData>("/api/posts", {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (!data.success) throw new Error(data.longMessage);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Post created!", { id: toastId });
            router.push("/posts");
        },
        onError: (err, _, ctx) =>
            toast.error(err.message, { id: ctx?.toastId }),
    });

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md space-y-2">
                <Form {...form}>
                    <form
                        className="space-y-2"
                        onSubmit={form.handleSubmit((values) =>
                            createPost(values)
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="What's on your mind?"
                                            rows={5}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            Create Post
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
