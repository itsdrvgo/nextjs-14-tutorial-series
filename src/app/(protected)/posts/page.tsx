import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const cookieStore = cookies();

    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/signin");

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    });
    if (!dbUser) redirect("/auth/signin");

    const userPosts = await db.query.posts.findMany({
        with: {
            author: true,
        },
    });

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md space-y-2">
                {userPosts.map((post) => (
                    <Card key={post.id}>
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
                ))}

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
