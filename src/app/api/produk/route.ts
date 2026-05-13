import prisma  from "@/src/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/produk:
 *   get:
 *     summary: Get all active products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
export async function GET() {
    try {
        const produk = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                status: "Aktif",
            },
        });
        return NextResponse.json({ produk }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Gagal mengambil produk" }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/produk:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_product:
 *                 type: string
 *               sku:
 *                 type: string
 *               kategori:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: number
 *               status:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
    try {
        const {nama_product, sku, kategori, harga, stok, status, deskripsi} = await req.json();
        
        if (!nama_product || !sku || !kategori || !harga || !stok || !status || !deskripsi)   {
            return NextResponse.json({message: "Data tidak boleh kosong"}, {status: 400});
        }

        const existingProduct = await prisma.product.findUnique({
            where: {sku},
        });

        if (existingProduct ) {
            return NextResponse.json({message: "Produk sudah ada"}, {status: 400});
        }

        const existingNama = await prisma.product.findUnique({
            where: {nama_product},
        });

        if (existingNama) {
            return NextResponse.json({message: "Nama produk sudah ada"}, {status: 400});
        }

        const produk = await prisma.product.create({
            data: {
                nama_product,
                sku,
                kategori,
                harga,
                stok,
                status,
                deskripsi,
            },
        });

        return NextResponse.json({ produk }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Gagal menambahkan produk" }, { status: 500 });
    }
}

