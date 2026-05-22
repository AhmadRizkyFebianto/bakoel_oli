import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/checkout:
 *   post:
 *     summary: Process checkout using user's cart and get Midtrans Snap Token
 *     tags: [Checkout]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional list of cart item IDs to checkout. If not provided or empty, the entire cart will be checked out.
 *                 example: ["cm39mxl1p0001xyz", "cm39mxl1p0002abc"]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or Product not found
 *       500:
 *         description: Server error
 *     security:
 *       - cookieAuth: []
 */
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const userId = decodedToken.id;

        // Parse optional itemIds from request body
        let selectedItemIds: string[] = [];
        try {
            const body = await req.json();
            if (body && Array.isArray(body.itemIds)) {
                selectedItemIds = body.itemIds;
            }
        } catch (e) {
            // Body might be empty, which is fine
        }

        // Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ message: "Keranjang belanja kosong" }, { status: 400 });
        }

        // Filter items if specific itemIds are provided
        const itemsToCheckout = selectedItemIds.length > 0 
            ? cart.items.filter(item => selectedItemIds.includes(item.id))
            : cart.items;

        if (itemsToCheckout.length === 0) {
            return NextResponse.json({ message: "Item yang dipilih tidak ditemukan di keranjang" }, { status: 400 });
        }

        let total = 0;
        const orderItemsData = itemsToCheckout.map(item => {
            total += item.product.harga * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.harga
            };
        });

        // Get user for customer details
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        // Create Order and OrderItems in a transaction, and delete cart items
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: "BelumBayar",
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Delete selected cart items after successful checkout
            await tx.cartItem.deleteMany({
                where: { 
                    id: { in: itemsToCheckout.map(item => item.id) }
                }
            });

            return newOrder;
        });

        // Send request to Midtrans
        const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
        const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
        const MIDTRANS_URL = IS_PRODUCTION
            ? "https://app.midtrans.com/snap/v1/transactions"
            : "https://app.sandbox.midtrans.com/snap/v1/transactions";

        const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

        const midtransPayload = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.total
            },
            customer_details: {
                first_name: user.username,
                email: user.email
            },
            item_details: order.items.map(item => ({
                id: item.productId,
                price: item.price,
                quantity: item.quantity,
                name: item.product.nama_product
            }))
        };

        const response = await fetch(MIDTRANS_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`
            },
            body: JSON.stringify(midtransPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Midtrans Error:", errorText);
            throw new Error("Gagal mendapatkan token pembayaran dari Midtrans");
        }

        const responseData = await response.json();
        const snapToken = responseData.token;

        // Update order with snap token
        await prisma.order.update({
            where: { id: order.id },
            data: { snapToken }
        });

        return NextResponse.json({
            message: "Order berhasil dibuat",
            orderId: order.id,
            snapToken,
            total: order.total
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Gagal memproses checkout" }, { status: 500 });
    }
}
