import { PostsPage } from "@/components/posts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md space-y-2">
                <h1 className="text-center text-3xl font-semibold">Posts</h1>

                <Suspense
                    fallback={Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                >
                    <PostsPage />
                </Suspense>

                <Link
                    href="/posts/create"
                    className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Create Post
                </Link>
            </div>
        </section>
    );
}
