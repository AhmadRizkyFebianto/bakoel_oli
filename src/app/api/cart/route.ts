import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Successfully fetched cart
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
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        let cart = await prisma.cart.findUnique({
            where: { userId: decodedToken.id },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: decodedToken.id },
                include: { items: { include: { product: true } } }
            });
        }

        return NextResponse.json({ cart }, { status: 200 });
    } catch (error) {
        console.error("Cart GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/cart:
 *   post:
 *     summary: Add an item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Added to cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *     security:
 *       - cookieAuth: []
 */
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const { productId, quantity } = await req.json();
        if (!productId || typeof quantity !== "number" || quantity <= 0) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        let cart = await prisma.cart.findUnique({ where: { userId: decodedToken.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: decodedToken.id } });
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: { cartId_productId: { cartId: cart.id, productId } }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId, quantity }
            });
        }

        return NextResponse.json({ message: "Added to cart successfully" }, { status: 200 });
    } catch (error) {
        console.error("Cart POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/cart:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 *     security:
 *       - cookieAuth: []
 */
export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const { cartItemId, quantity } = await req.json();
        if (!cartItemId || typeof quantity !== "number" || quantity <= 0) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== decodedToken.id) {
            return NextResponse.json({ message: "Cart item not found or unauthorized" }, { status: 404 });
        }

        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });

        return NextResponse.json({ message: "Cart item updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Cart PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     summary: Remove item from cart or clear cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: itemId
 *         schema:
 *           type: string
 *         description: The cartItemId to remove. If omitted, clears the entire cart.
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *     security:
 *       - cookieAuth: []
 */
export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        const cart = await prisma.cart.findUnique({ where: { userId: decodedToken.id } });
        if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

        if (itemId) {
            // Remove single item
            const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
            if (cartItem && cartItem.cartId === cart.id) {
                await prisma.cartItem.delete({ where: { id: itemId } });
            }
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return NextResponse.json({ message: "Cart updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Cart DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
