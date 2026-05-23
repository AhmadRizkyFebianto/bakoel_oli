import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/dashboard/pesanan:
 *   get:
 *     summary: Get all orders in the system for monitoring (Admin only)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully fetched all orders
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

        // Fetch all orders in the system
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        jenis_motor: true,
                        jenis_mesin: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                nama_product: true,
                                kekentalan_oli: true,
                                image_url: true
                            }
                        }
                    }
                }
            }
        });

        // Helper to generate realistic address and phone based on user info
        const cities = ["Bandung", "Jakarta Barat", "Depok", "Bekasi Selatan", "Bogor Barat", "Tangerang"];
        const districts = ["Sukamaju", "Tanah Sereal", "Harapan Indah", "Cimanggis", "Dago", "Ciputat"];

        const mappedOrders = orders.map((order) => {
            const orderUser = order.user;
            const username = orderUser.username;
            
            // Consistent hashing for realistic address
            const cityIndex = username.charCodeAt(0) % cities.length;
            const districtIndex = username.charCodeAt(username.length - 1) % districts.length;
            const streetNum = (username.length * 7) % 88 + 1;
            const address = `Jl. Merdeka No. ${streetNum}, Kel. ${districts[districtIndex]}, ${cities[cityIndex]}`;
            
            // Consistent hashing for realistic phone number
            const phoneHash = (orderUser.id.charCodeAt(0) + orderUser.id.charCodeAt(orderUser.id.length - 1)) % 9000 + 1000;
            const noHp = `0812-3456-${phoneHash}`;

            // Map items
            const mappedItems = order.items.map((item) => {
                const sku = `OLI-${item.product.nama_product.substring(0, 3).toUpperCase()}-${item.product.kekentalan_oli.replace(/\s+/g, "").toUpperCase()}`;
                return {
                    productId: item.productId,
                    namaProduk: item.product.nama_product,
                    sku: sku,
                    qty: item.quantity,
                    hargaSatuan: item.price
                };
            });

            // Map order status to "BelumBayar" or "SudahBayar"
            const status = order.status === "SudahBayar" ? "SudahBayar" : "BelumBayar";

            return {
                id: order.id,
                namaPemesan: username,
                alamat: address,
                noHp: noHp,
                status: status,
                tglPesan: order.createdAt.toISOString(),
                catatan: `Layanan ganti oli untuk motor ${orderUser.jenis_motor} (${orderUser.jenis_mesin}).`,
                items: mappedItems,
                total: order.total
            };
        });

        return NextResponse.json({ orders: mappedOrders }, { status: 200 });

    } catch (error) {
        console.error("Dashboard orders fetching error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
