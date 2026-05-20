import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

/**
 * @openapi
 * /api/payment/notification:
 *   post:
 *     summary: Midtrans Payment Webhook Callback
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload from Midtrans
 *     responses:
 *       200:
 *         description: Notification processed successfully
 *       400:
 *         description: Invalid signature
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // payload structure from Midtrans
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status
        } = payload;

        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

        // Verifikasi Signature Key
        const hash = crypto.createHash("sha512").update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest("hex");

        if (hash !== signature_key) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        // Cari order berdasarkan order_id
        const order = await prisma.order.findUnique({
            where: { id: order_id }
        });

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        let newStatus = order.status;

        if (transaction_status === 'capture') {
            if (fraud_status === 'challenge') {
                // TODO set transaction status on your database to 'challenge'
                // e.g: 'pending'
                newStatus = 'challenge';
            } else if (fraud_status === 'accept') {
                newStatus = "SudahBayar";
            }
        } else if (transaction_status === 'settlement') {
            newStatus = "SudahBayar";
        } else if (transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire') {
            newStatus = "Batal";
        } else if (transaction_status === 'pending') {
            newStatus = "BelumBayar";
        }

        // Update status in database
        await prisma.order.update({
            where: { id: order_id },
            data: { status: newStatus }
        });

        return NextResponse.json({ message: "Notification processed successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}