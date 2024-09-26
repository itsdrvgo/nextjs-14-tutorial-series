import { BlogsPage } from "@/components/blogs-page";

export default function Page() {
    // const res = await fetch("https://api.vercel.app/blog", {
    //     cache: "no-store",
    // });
    // const blogs = await res.json();

    // return (
    //     <div>
    //         <h1>Blog Posts</h1>
    //         <ul>
    //             {blogs.map((blog: any) => (
    //                 <li key={blog.id}>{blog.title}</li>
    //             ))}
    //         </ul>
    //     </div>
    // );

    return <BlogsPage />;
}
