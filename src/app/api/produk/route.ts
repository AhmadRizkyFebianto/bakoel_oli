import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { uploadToImgBB } from "@/src/lib/upload";

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
            }
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
 *               jenis_oli:
 *                 type: string
 *               peruntukan:
 *                 type: string
 *               cc_motor:
 *                 type: string
 *               kekentalan_oli:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: number
 *               deskripsi:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: Base64 string of the image to be uploaded to ImgBB
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_product:
 *                 type: string
 *               jenis_oli:
 *                 type: string
 *               peruntukan:
 *                 type: string
 *               cc_motor:
 *                 type: string
 *               kekentalan_oli:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: number
 *               deskripsi:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to be uploaded to ImgBB
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input or product name already exists
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
    try {
        let nama_product = "";
        let jenis_oli = "";
        let peruntukan = "";
        let cc_motor = "";
        let kekentalan_oli = "";
        let harga = 0;
        let stok = 0;
        let deskripsi = "";
        let imageInput: any = null;
        let image_url = "";

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            nama_product = formData.get("nama_product") as string || "";
            jenis_oli = formData.get("jenis_oli") as string || "";
            peruntukan = formData.get("peruntukan") as string || "";
            cc_motor = formData.get("cc_motor") as string || "";
            kekentalan_oli = formData.get("kekentalan_oli") as string || "";
            harga = Number(formData.get("harga")) || 0;
            stok = Number(formData.get("stok")) || 0;
            deskripsi = formData.get("deskripsi") as string || "";
            
            const file = formData.get("image");
            if (file instanceof File && file.size > 0) {
                imageInput = file;
            }
        } else {
            const body = await req.json();
            nama_product = body.nama_product || "";
            jenis_oli = body.jenis_oli || "";
            peruntukan = body.peruntukan || "";
            cc_motor = body.cc_motor || "";
            kekentalan_oli = body.kekentalan_oli || "";
            harga = Number(body.harga) || 0;
            stok = Number(body.stok) || 0;
            deskripsi = body.deskripsi || "";
            
            if (body.image) {
                imageInput = body.image;
            }
        }

        // Validasi field wajib
        if (!nama_product || !jenis_oli || !peruntukan || !cc_motor || !kekentalan_oli || harga === undefined || deskripsi === undefined) {
            return NextResponse.json({ message: "Data tidak boleh kosong" }, { status: 400 });
        }

        // Cek keunikan nama produk
        const existingNama = await prisma.product.findUnique({
            where: { nama_product },
        });

        if (existingNama) {
            return NextResponse.json({ message: "Nama produk sudah ada" }, { status: 400 });
        }

        // Proses upload ke ImgBB jika ada file/base64 gambar
        if (imageInput) {
            try {
                const uploadedUrl = await uploadToImgBB(imageInput);
                if (uploadedUrl) {
                    image_url = uploadedUrl;
                }
            } catch (uploadError) {
                console.error("Gagal mengupload gambar ke ImgBB:", uploadError);
                return NextResponse.json({ message: "Gagal mengupload gambar ke ImgBB" }, { status: 500 });
            }
        }

        const produk = await prisma.product.create({
            data: {
                nama_product,
                jenis_oli,
                peruntukan,
                cc_motor,
                kekentalan_oli,
                harga: Math.round(harga),
                stok: Math.round(stok),
                deskripsi,
                image_url: image_url || null,
            },
        });

        return NextResponse.json({ produk }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Gagal menambahkan produk" }, { status: 500 });
    }
}
