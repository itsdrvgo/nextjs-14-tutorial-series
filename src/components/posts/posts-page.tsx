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
import { wait } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function PostsPage() {
    const cookieStore = cookies();

    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/signin");

    console.log("Before");
    await wait(5000);
    console.log("After");

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
        <>
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
        </>
    );
}
