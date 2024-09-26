"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchBlogs() {
    // due to CORS, this will not work in the browser
    // const res = await fetch("https://api.vercel.app/blog");

    // this will work in the browser
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    return res.json();
}

export function BlogsPage() {
    const { data, error, isPending } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <div>
            <h1>Client-Side Blog Posts</h1>
            <ul>
                {data.map((blog: any) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    );
}
