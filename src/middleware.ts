import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const res = NextResponse.next();

    if (url.pathname === "/drvgo")
        return NextResponse.redirect("https://itsdrvgo.me/");

    const supabase = createMiddlewareClient({
        req,
        res,
    });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        if (url.pathname.startsWith("/api"))
            res.headers.set("x-user-id", session.user.id);

        if (url.pathname.startsWith("/auth"))
            return NextResponse.redirect(new URL("/dashboard", url.origin));
    }

    if (!session && !url.pathname.startsWith("/auth"))
        return NextResponse.redirect(new URL("/auth/signin", url.origin));

    return res;
}

export const config = {
    matcher: [
        "/auth/:path*",
        "/dashboard/:path*",
        "/",
        "/posts/:path*",
        "/drvgo",
    ],
};
