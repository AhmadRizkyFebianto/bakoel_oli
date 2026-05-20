import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Daftar endpoint publik yang diizinkan tanpa token
    const publicApiPaths = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/payment/notification",
        "/api/test/simulate-payment",
        "/api/docs",
        "/api-docs"
    ];

    // Jika path cocok dengan daftar publik, izinkan akses
    if (publicApiPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Pengecualian khusus: Izinkan GET /api/produk
    if (pathname.startsWith('/api/produk') && req.method === 'GET') {
        return NextResponse.next();
    }

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: Harap login terlebih dahulu" },
                { status: 401 }
            );
        }

        verifyToken(token);

        return NextResponse.next();
    } catch {
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: ["/api/:path*"],
};