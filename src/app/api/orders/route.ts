import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get order history for the authenticated user
 *     tags: [Checkout]
 *     responses:
 *       200:
 *         description: Successfully fetched order history
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *     security:
 *       - cookieAuth: []
 */
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const userId = decodedToken.id;

        // Ambil semua order milik user yang login, diurutkan berdasarkan tanggal terbaru
        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                nama_product: true,
                                jenis_oli: true,
                                image_url: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error("Orders fetching error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
