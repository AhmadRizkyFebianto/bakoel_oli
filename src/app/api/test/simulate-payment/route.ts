import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

/**
 * @openapi
 * /api/test/simulate-payment:
 *   post:
 *     summary: (DEV ONLY) Otomatis Simulasikan Pembayaran Sukses
 *     description: Endpoint ini secara otomatis mencari order terbaru yang BelumBayar, men-generate signature key yang valid, dan menembak webhook Midtrans. Cukup klik Execute!
 *     tags: [Checkout]
 *     responses:
 *       200:
 *         description: Payment simulated successfully
 *       404:
 *         description: No unpaid orders found
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
    try {
        // Cari order terbaru yang belum dibayar
        const order = await prisma.order.findFirst({
            where: { status: "BelumBayar" },
            orderBy: { createdAt: "desc" }
        });

        if (!order) {
            return NextResponse.json({ message: "Tidak ada pesanan (Order) dengan status BelumBayar di database." }, { status: 404 });
        }

        const order_id = order.id;
        const status_code = "200";
        const gross_amount = order.total.toFixed(2); // Midtrans menggunakan format .00
        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

        // Buat signature key secara otomatis
        const signature_key = crypto.createHash("sha512").update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest("hex");

        const mockPayload = {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status: "settlement",
            fraud_status: "accept"
        };

        // Dapatkan URL base secara dinamis
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host") || "localhost:3000";
        
        // Tembak webhook notifikasi secara otomatis
        const response = await fetch(`${protocol}://${host}/api/payment/notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mockPayload)
        });

        const result = await response.json();

        return NextResponse.json({
            message: `Berhasil menyimulasikan pembayaran untuk Order ID: ${order_id}. Status order di database saat ini sudah menjadi SudahBayar.`,
            webhook_payload_sent: mockPayload,
            webhook_response: result
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
