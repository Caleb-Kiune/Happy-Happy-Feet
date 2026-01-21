import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdmin } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes (except login page)
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Allow access to login page
        if (request.nextUrl.pathname === "/admin/login") {
            // If already logged in, redirect to admin dashboard
            if (user) {
                // Determine if user is actually authorized
                if (!isAuthorizedAdmin(user.email)) {
                    // Logged in but not admin -> Sign out or show error?
                    // For now, let's just let them see the login page or redirect to home?
                    // Better: If they are logged in but not admin, they shouldn't go to /admin.
                    // But if they are just visiting login, we can redirect to /admin -> which will then fail.
                    // So we must check here too.

                    // Force logout or just redirect to home
                    return NextResponse.redirect(new URL("/", request.url));
                }

                const url = request.nextUrl.clone();
                url.pathname = "/admin";
                return NextResponse.redirect(url);
            }
            return supabaseResponse;
        }

        // For all other admin routes, require authentication AND authorization
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }

        // Check if user is an authorized admin
        if (!isAuthorizedAdmin(user.email)) {
            console.warn(
                `[Middleware] Admin access denied for user: ${user.email}. ` +
                `ADMIN_EMAILS env var exists? ${!!process.env.ADMIN_EMAILS}`
            );
            // Logged in user is NOT an admin. Redirect to home.
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        // Match all admin routes
        "/admin/:path*",
    ],
};
