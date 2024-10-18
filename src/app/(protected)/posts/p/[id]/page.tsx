import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/drizzle";
import { posts } from "@/lib/drizzle/schema";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = params;

    const post = await db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
            author: true,
        },
    });
    if (!post)
        return {
            title: "Not Found",
            description: "Post not found",
        };

    return {
        title:
            "'" +
            post.content.slice(0, 20) +
            "'" +
            " by, " +
            post.author.username,
        description: post.content,
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = params;

    const post = await db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
            author: true,
        },
    });
    if (!post) redirect("/posts");

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md space-y-2">
                <h1 className="text-center text-3xl font-semibold">Post</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>{post.author.username}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{post.content}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p>
                            Author:{" "}
                            {format(new Date(post.createdAt), "dd/MM/yyyy")}
                        </p>
                    </CardFooter>
                </Card>

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
