import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/drizzle";
import { format } from "date-fns";

export async function PostsPage() {
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
