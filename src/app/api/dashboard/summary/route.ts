import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard statistics summary (Admin only)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully fetched dashboard statistics summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        } catch (err) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = decodedToken.id;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Calculate total pendapatan from "SudahBayar" orders
        const totalPendapatanResult = await prisma.order.aggregate({
            where: { status: "SudahBayar" },
            _sum: { total: true }
        });
        const totalPendapatan = totalPendapatanResult._sum.total || 0;

        // Calculate pesanan bulan ini
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const pesananBulanIni = await prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfMonth
                }
            }
        });

        // Calculate total produk
        const totalProduk = await prisma.product.count();

        // Calculate total pelanggan
        const totalPelanggan = await prisma.user.count({
            where: { role: "user" }
        });

        // Calculate nilai inventaris
        const products = await prisma.product.findMany({
            select: { harga: true, stok: true }
        });
        const nilaiInventaris = products.reduce((sum, p) => sum + (p.harga * p.stok), 0);

        return NextResponse.json({
            totalPendapatan,
            pesananBulanIni,
            totalProduk,
            totalPelanggan,
            nilaiInventaris
        }, { status: 200 });

    } catch (error) {
        console.error("Dashboard summary error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
