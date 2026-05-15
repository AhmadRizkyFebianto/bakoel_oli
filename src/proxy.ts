import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";

export default function proxy(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
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
    matcher: ["/api/produk", "/api/produk/:path*", "/api/user", "/api/user/:path*"],
};