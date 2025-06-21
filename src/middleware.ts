import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export const config = {
    matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
    const isDashboard = pathname.startsWith("/dashboard");

    // 1. Redirect authenticated users away from sign-in/up pages
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. Block unauthenticated users from dashboard
    if (!token && isDashboard) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}
