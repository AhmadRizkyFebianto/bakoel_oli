import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
export async function GET() {
    try {
        const jumlahUser = await prisma.user.count({
            where: {
                role : "user"
            },
        });
        return NextResponse.json({ jumlahUser }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Gagal mengambil user" }, { status: 500 });
    }
}
