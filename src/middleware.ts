// src/app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const ua = req.headers.get("user-agent") || "";
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const url = req.nextUrl.clone();

    if (url.pathname === "/") {
        url.pathname = isMobile ? "/mobile" : "/desktop";
        return NextResponse.rewrite(url);
    }

    if (isMobile) {
        url.pathname = `/mobile${url.pathname}`;
    } else {
        url.pathname = `/desktop${url.pathname}`;
    }

    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.match(/\.(.*)$/) // skip semua file yang punya ekstensi (.png, .jpg, .css, .js, dll)
    ) {
        return NextResponse.next();
    }

    return NextResponse.rewrite(url);
}