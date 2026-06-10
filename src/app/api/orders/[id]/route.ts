import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get order detail by id for the authenticated user
 *     tags: [Checkout]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched order detail
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await context.params;

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decodedToken.id;

    if (!orderId) {
      return NextResponse.json(
        { message: "Order id is required" },
        { status: 400 },
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                nama_product: true,
                jenis_oli: true,
                image_url: true,
                harga: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Make UI-compatible fields.
    // UI expects: order.items[].product.harga, order.items[].product.nama_product, order.items[].quantity, etc.
    // Since UI also calculates totals from product.harga today, we overwrite product.harga
    // with the persisted OrderItem.price (harga saat dibeli).
    const orderWithUiCompatibleItems = {
      ...order,
      items: order.items.map((it) => ({
        ...it,
        product: {
          ...it.product,
          harga: it.price,
        },
      })),
    };

    return NextResponse.json(
      { order: orderWithUiCompatibleItems },
      { status: 200 },
    );
  } catch (error) {
    console.error("Order detail fetching error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
