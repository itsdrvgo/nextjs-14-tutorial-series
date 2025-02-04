import { PostCreatePage } from "@/components/posts/create";
import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
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

    return <PostCreatePage />;
}
