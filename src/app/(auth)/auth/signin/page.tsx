import { SignInPage } from "@/components/auth";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
};

export default async function Page() {
    const cookieStore = cookies();

    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");

    return <SignInPage />;
}
