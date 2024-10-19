import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/drizzle";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export async function PostsPage() {
    const userPosts = await db.query.posts.findMany({
        with: {
            author: true,
        },
    });

    return (
        <>
            {userPosts.map((post) => (
                <div key={post.id}>
                    <Link href={`/posts/p/${post.id}`}>
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.author.username}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{post.content}</p>

                                {post.imageUrl && (
                                    <div className="aspect-video overflow-hidden rounded-md">
                                        <Image
                                            src={post.imageUrl}
                                            alt="Post image"
                                            width={500}
                                            height={500}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <p>
                                    Author:{" "}
                                    {format(
                                        new Date(post.createdAt),
                                        "dd/MM/yyyy"
                                    )}
                                </p>
                            </CardFooter>
                        </Card>
                    </Link>
                </div>
            ))}
        </>
    );
}
